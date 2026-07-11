import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 8;
const NOTIFICATION_EMAIL = "omar.sakr27x@gmail.com";
const ATTACHMENTS_BUCKET = "rfq-attachments";
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_EXTENSIONS = [".pdf", ".dwg", ".dxf", ".doc", ".docx"];

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
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${key}</td><td style="padding:4px 0">${value}</td></tr>`
    )
    .join("");

  const resend = new Resend(apiKey);
  const base = {
    from: "ACTS Website <onboarding@resend.dev>",
    to: NOTIFICATION_EMAIL,
    replyTo: typeof fields.Email === "string" ? fields.Email : undefined,
    subject: `New RFQ: ${fields.Company ?? "Unknown company"}`,
  };

  // Surface attachment failures in the email body instead of silently
  // dropping the file — the sender still has to hear about it somehow.
  let note = attachmentError
    ? `<p style="margin-top:12px;color:#b91c1c">Note: the attachment failed to send (${attachmentError}).</p>`
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
      note = `<p style="margin-top:12px;color:#b91c1c">Note: the attachment (${attachment.filename}) failed to send (${sendError.message}). Check attachment_path in Supabase Storage.</p>`;
    } catch (err) {
      // Resend rejected the attachment itself (e.g. size/type) — fall back
      // to sending the enquiry text below rather than losing the email.
      console.error("notification email with attachment failed:", err);
      note = `<p style="margin-top:12px;color:#b91c1c">Note: the attachment (${attachment.filename}) failed to send. Check attachment_path in Supabase Storage.</p>`;
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
      from: "ACTS Website <onboarding@resend.dev>",
      to: email,
      subject: "We've received your request: ACTS",
      html: `
        <p>Hi ${name},</p>
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
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
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

  const attachmentEntry = formData.get("attachment");
  const attachmentFile =
    attachmentEntry instanceof File && attachmentEntry.size > 0 ? attachmentEntry : null;

  if (attachmentFile) {
    const extension = attachmentFile.name
      .slice(attachmentFile.name.lastIndexOf("."))
      .toLowerCase();
    if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
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
    return NextResponse.json(
      {
        success: false,
        error:
          "The enquiry service isn't configured yet (missing Supabase keys in .env.local)",
      },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  // Best-effort cleanup so the table doesn't grow unbounded — failures here
  // don't block the request.
  await supabase.from("inquiry_rate_limits").delete().lt("created_at", oneDayAgo);

  const { count: hourCount } = await supabase
    .from("inquiry_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", oneHourAgo);

  const { count: dayCount } = await supabase
    .from("inquiry_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", oneDayAgo);

  if ((hourCount ?? 0) >= HOURLY_LIMIT || (dayCount ?? 0) >= DAILY_LIMIT) {
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
      const safeName = attachmentFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const path = `${Date.now()}-${randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(ATTACHMENTS_BUCKET)
        .upload(path, attachmentBuffer, {
          contentType: attachmentFile.type || "application/octet-stream",
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
