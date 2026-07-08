import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 8;
const NOTIFICATION_EMAIL = "omar.sakr27x@gmail.com";

async function sendNotificationEmail(fields: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${key}</td><td style="padding:4px 0">${value}</td></tr>`
    )
    .join("");

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "ACTS Website <onboarding@resend.dev>",
      to: NOTIFICATION_EMAIL,
      replyTo: typeof fields.Email === "string" ? fields.Email : undefined,
      subject: `New RFQ: ${fields.Company ?? "Unknown company"}`,
      html: `<table>${rows}</table>`,
    });
  } catch (err) {
    // Don't fail the request over a notification email — the enquiry is
    // already saved in Supabase either way.
    console.error("notification email failed:", err);
  }
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot — real users never see or fill this field. Bots that
  // auto-fill every input trip it; pretend success so they don't adapt.
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const deliveryLocation =
    typeof body.deliveryLocation === "string" ? body.deliveryLocation.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

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

  const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : null;
  const productInterest =
    typeof body.productNeeded === "string" ? body.productNeeded : null;
  const brand = typeof body.brand === "string" && body.brand ? body.brand : null;
  const quantity = typeof body.quantity === "string" ? body.quantity.trim() : null;
  const deliveryDate =
    typeof body.deliveryDate === "string" && body.deliveryDate
      ? body.deliveryDate
      : null;
  const serviceConditions =
    typeof body.serviceConditions === "string"
      ? body.serviceConditions.trim()
      : null;

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
  });

  if (error) {
    console.error("inquiries insert failed:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not save your enquiry" },
      { status: 500 }
    );
  }

  await sendNotificationEmail({
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
  });

  return NextResponse.json({ success: true });
}
