import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { contact } from "@/lib/data";

const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 8;

// Where new RFQs land. Set INQUIRY_NOTIFICATION_EMAIL to route them elsewhere;
// the fallback is the sales address already published across the site, so a
// missing env var can never silently drop a lead into nowhere.
const NOTIFICATION_EMAIL =
  process.env.INQUIRY_NOTIFICATION_EMAIL || contact.salesEmail;

// Resend's shared `onboarding@resend.dev` sender only delivers to the address
// that owns the Resend account, so customer confirmations sent from it never
// arrive. Set RESEND_FROM to a verified domain sender to fix that.
const MAIL_FROM = process.env.RESEND_FROM || "ACTS Website <onboarding@resend.dev>";

const ATTACHMENTS_BUCKET = "rfq-attachments";
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

// Extension -> the Content-Type the file is stored under. Never trust the
// browser-supplied `File.type`: it is attacker-controlled, and storing a file
// as text/html would make the bucket serve markup from a domain we own.
// These values match the bucket's own allowed_mime_types allowlist.
const ATTACHMENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".dwg": "image/vnd.dwg",
  ".dxf": "image/vnd.dxf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// Positive signature checks, kept deliberately lenient: a customer whose real
// drawing gets bounced is a worse outcome than a mislabelled file landing in a
// private bucket under a forced, non-renderable content type. ASCII DXF has no
// signature at all, so it is accepted on extension alone.
const ATTACHMENT_SIGNATURES: Record<string, (head: Buffer) => boolean> = {
  ".pdf": (h) => h.subarray(0, 5).toString("latin1") === "%PDF-",
  // Zip local-file header: DOCX is a zip container.
  ".docx": (h) =>
    h.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])),
  ".doc": (h) =>
    h.subarray(0, 8).equals(
      Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    ),
  ".dwg": (h) => /^AC[0-9]{4}$/.test(h.subarray(0, 6).toString("latin1")),
  ".dxf": () => true,
};

// Generous enough that no genuine enquiry hits them, tight enough that the
// endpoint can't be used to write arbitrary volumes into the table.
const FIELD_LIMITS: Record<string, number> = {
  name: 120,
  company: 160,
  email: 254, // RFC 5321 maximum
  phone: 40,
  jobTitle: 120,
  productNeeded: 160,
  brand: 120,
  quantity: 80,
  deliveryLocation: 200,
  deliveryDate: 40,
  serviceConditions: 2000,
  message: 5000,
};

// Deliberately loose: a strict RFC 5322 regex rejects valid addresses, and the
// confirmation email is the real proof of deliverability. This only catches
// input that could not possibly be an address.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Anything that a browser might render as markup, whatever it claims to be. */
function looksLikeMarkup(head: Buffer): boolean {
  const text = head.subarray(0, 1024).toString("latin1").trimStart().toLowerCase();
  return (
    text.startsWith("<!doctype") ||
    text.startsWith("<html") ||
    text.startsWith("<svg") ||
    text.startsWith("<script") ||
    (text.startsWith("<?xml") && text.includes("<svg"))
  );
}

/** Every submitted value reaches an HTML email body — escape before it does. */
function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface EmailAttachment {
  filename: string;
  // Resend's API (and this SDK, which JSON.stringifies the request body)
  // requires base64 text here — a raw Buffer serializes to {type,data} JSON
  // instead, silently corrupting the attachment.
  content: string;
}

async function sendNotificationEmail(
  fields: Record<string, unknown>,
  attachment: EmailAttachment | null,
  attachmentError: string | null
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(
          key
        )}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const resend = new Resend(apiKey);
  const base = {
    from: MAIL_FROM,
    to: NOTIFICATION_EMAIL,
    replyTo: typeof fields.Email === "string" ? fields.Email : undefined,
    subject: `New RFQ: ${fields.Company ?? "Unknown company"}`,
  };

  // Surface attachment failures in the email body instead of silently
  // dropping the file — the sender still has to hear about it somehow.
  let note = attachmentError
    ? `<p style="margin-top:12px;color:#b91c1c">Note: the attachment failed to send (${escapeHtml(
        attachmentError
      )}).</p>`
    : "";

  if (attachment) {
    try {
      const { error: sendError } = await resend.emails.send({
        ...base,
        html: `<table>${rows}</table>${note}`,
        attachments: [{ filename: attachment.filename, content: attachment.content }],
      });
      if (!sendError) return;
      console.error("notification email with attachment failed:", sendError.message);
      note = `<p style="margin-top:12px;color:#b91c1c">Note: the attachment (${escapeHtml(
        attachment.filename
      )}) failed to send (${escapeHtml(
        sendError.message
      )}). Check attachment_path in Supabase Storage.</p>`;
    } catch (err) {
      // Resend rejected the attachment itself (e.g. size/type) — fall back
      // to sending the enquiry text below rather than losing the email.
      console.error("notification email with attachment failed:", err);
      note = `<p style="margin-top:12px;color:#b91c1c">Note: the attachment (${escapeHtml(
        attachment.filename
      )}) failed to send. Check attachment_path in Supabase Storage.</p>`;
    }
  }

  try {
    await resend.emails.send({ ...base, html: `<table>${rows}</table>${note}` });
  } catch (err) {
    // Don't fail the request over a notification email — the enquiry is
    // already saved in Supabase either way.
    console.error("notification email failed:", err);
  }
}

async function sendCustomerConfirmationEmail(name: string, email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: MAIL_FROM,
      to: email,
      subject: "We've received your request: ACTS",
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out to ACTS. We've received your request for quote and a member of our team will get back to you shortly.</p>
        <p>If anything is urgent, feel free to reply to this email.</p>
        <p>ACTS (Advanced Company for Trading Services)</p>
      `,
    });
  } catch (err) {
    // Don't fail the request over a confirmation email — the enquiry is
    // already saved in Supabase either way.
    console.error("confirmation email failed:", err);
  }
}

function getClientIp(request: Request): string {
  // Order matters. `x-forwarded-for` is trivially set by the caller, so
  // reading it first let anyone rotate the header and walk straight past the
  // limits below. Vercel's own `x-vercel-forwarded-for` is overwritten by the
  // platform on every request and cannot be spoofed from outside; the others
  // are last-resort fallbacks for running behind a different proxy.
  const trusted =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for");
  if (!trusted) return "unknown";
  return trusted.split(",")[0].trim() || "unknown";
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const getField = (key: string): string => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  // Honeypot — real users never see or fill this field. Bots that
  // auto-fill every input trip it; pretend success so they don't adapt.
  const honeypot = getField("website").trim();
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  const name = getField("name").trim();
  const company = getField("company").trim();
  const email = getField("email").trim();
  const phone = getField("phone").trim();
  const deliveryLocation = getField("deliveryLocation").trim();
  const message = getField("message").trim();

  if (!name || !company || !email || !phone || !deliveryLocation || !message) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Name, company, email, phone, delivery location, and notes are required.",
      },
      { status: 400 }
    );
  }

  // Nothing upstream bounds these — the browser's own maxlength is advisory
  // and the API is reachable directly, so without this a single request could
  // push megabytes of text into Postgres. Reject rather than truncate: silently
  // cutting someone's spec in half is worse than telling them it was too long.
  const overLimit = Object.entries(FIELD_LIMITS).find(
    ([field, limit]) => getField(field).trim().length > limit
  );
  if (overLimit) {
    return NextResponse.json(
      { success: false, error: `That ${overLimit[0]} is too long.` },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const attachmentEntry = formData.get("attachment");
  const attachmentFile =
    attachmentEntry instanceof File && attachmentEntry.size > 0 ? attachmentEntry : null;

  let attachmentExtension = "";
  if (attachmentFile) {
    attachmentExtension = attachmentFile.name
      .slice(attachmentFile.name.lastIndexOf("."))
      .toLowerCase();
    if (!Object.hasOwn(ATTACHMENT_TYPES, attachmentExtension)) {
      return NextResponse.json(
        {
          success: false,
          error: "Attachment must be a PDF, DWG, DXF, DOC, or DOCX file.",
        },
        { status: 400 }
      );
    }
    if (attachmentFile.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        { success: false, error: "Attachment is too large (max 10MB)." },
        { status: 400 }
      );
    }
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // The cause (unset Supabase env vars) is an internal detail — log it, and
    // tell the sender only what they can act on.
    console.error("inquiries: Supabase is not configured; check env vars");
    return NextResponse.json(
      {
        success: false,
        error:
          "The enquiry service is temporarily unavailable. Please email us directly.",
      },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  // Best-effort cleanup so the table doesn't grow unbounded. Sampled rather
  // than run on every submission — the table only needs trimming occasionally,
  // and this used to add a write to the critical path of every single request.
  if (Math.random() < 0.05) {
    await supabase.from("inquiry_rate_limits").delete().lt("created_at", oneDayAgo);
  }

  // One query for both windows: pull the last 24h of attempts for this IP and
  // count the last hour from the same rows, instead of two counting queries.
  const { data: recentAttempts } = await supabase
    .from("inquiry_rate_limits")
    .select("created_at")
    .eq("ip_address", ip)
    .gte("created_at", oneDayAgo);

  const dayCount = recentAttempts?.length ?? 0;
  // Compare as timestamps, not strings: Postgres returns "+00:00" offsets
  // while toISOString() produces "Z", so lexical comparison would be wrong.
  const hourCutoff = now - 60 * 60 * 1000;
  const hourCount =
    recentAttempts?.filter(
      (row) => new Date(row.created_at as string).getTime() >= hourCutoff
    ).length ?? 0;

  if (hourCount >= HOURLY_LIMIT || dayCount >= DAILY_LIMIT) {
    return NextResponse.json(
      {
        success: false,
        error:
          "You've submitted several requests recently. Please wait a while before trying again, or email us directly.",
      },
      { status: 429 }
    );
  }

  // Log this attempt before the real insert so a failed insert still counts
  // against the limit (prevents retry-storming on errors).
  await supabase.from("inquiry_rate_limits").insert({ ip_address: ip });

  const jobTitle = getField("jobTitle").trim() || null;
  const productInterest = getField("productNeeded") || null;
  const brand = getField("brand") || null;
  const quantity = getField("quantity").trim() || null;
  const deliveryDate = getField("deliveryDate") || null;
  const serviceConditions = getField("serviceConditions").trim() || null;

  // Read the upload once and reuse the bytes for both the Storage upload and
  // the Resend attachment, instead of fetching it back from Storage after.
  let attachmentBuffer: Buffer | null = null;
  let attachmentPath: string | null = null;
  let attachmentError: string | null = null;

  if (attachmentFile) {
    try {
      attachmentBuffer = Buffer.from(await attachmentFile.arrayBuffer());

      // The extension allowlist above only checks the filename. Confirm the
      // bytes agree before this is stored or emailed on.
      const signatureOk = ATTACHMENT_SIGNATURES[attachmentExtension];
      if (looksLikeMarkup(attachmentBuffer) || !signatureOk?.(attachmentBuffer)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "That file doesn't look like a valid PDF, DWG, DXF, DOC, or DOCX. Please re-export it and try again.",
          },
          { status: 400 }
        );
      }

      const safeName = attachmentFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const path = `${Date.now()}-${randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(ATTACHMENTS_BUCKET)
        .upload(path, attachmentBuffer, {
          // Derived from the validated extension, never from the browser.
          contentType: ATTACHMENT_TYPES[attachmentExtension],
        });

      if (uploadError) {
        attachmentError = uploadError.message;
        console.error("attachment upload failed:", uploadError.message);
      } else {
        attachmentPath = path;
      }
    } catch (err) {
      attachmentError = "failed to read the uploaded file";
      console.error("attachment read failed:", err);
    }
  }

  const { error } = await supabase.from("inquiries").insert({
    name,
    company,
    email,
    phone,
    job_title: jobTitle,
    product_interest: productInterest,
    brand,
    quantity,
    delivery_location: deliveryLocation,
    delivery_date: deliveryDate,
    service_conditions: serviceConditions,
    message,
    attachment_path: attachmentPath,
  });

  if (error) {
    console.error("inquiries insert failed:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not save your enquiry" },
      { status: 500 }
    );
  }

  // Only hand the buffer to the email if we actually managed to read it —
  // a storage upload failure alone shouldn't stop us attaching it here.
  const emailAttachment: EmailAttachment | null =
    attachmentFile && attachmentBuffer
      ? { filename: attachmentFile.name, content: attachmentBuffer.toString("base64") }
      : null;

  await Promise.all([
    sendNotificationEmail(
      {
        Name: name,
        Company: company,
        Email: email,
        Phone: phone,
        "Job title": jobTitle,
        "Product needed": productInterest,
        Brand: brand,
        Quantity: quantity,
        "Delivery location": deliveryLocation,
        "Delivery date": deliveryDate,
        "Service conditions": serviceConditions,
        Message: message,
      },
      emailAttachment,
      attachmentFile && !attachmentBuffer ? attachmentError : null
    ),
    sendCustomerConfirmationEmail(name, email),
  ]);

  return NextResponse.json({ success: true });
}
