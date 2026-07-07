import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 8;

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

  const { error } = await supabase.from("inquiries").insert({
    name,
    company,
    email,
    phone,
    job_title: typeof body.jobTitle === "string" ? body.jobTitle.trim() : null,
    product_interest:
      typeof body.productNeeded === "string" ? body.productNeeded : null,
    brand: typeof body.brand === "string" && body.brand ? body.brand : null,
    quantity: typeof body.quantity === "string" ? body.quantity.trim() : null,
    delivery_location: deliveryLocation,
    delivery_date:
      typeof body.deliveryDate === "string" && body.deliveryDate
        ? body.deliveryDate
        : null,
    service_conditions:
      typeof body.serviceConditions === "string"
        ? body.serviceConditions.trim()
        : null,
    message,
  });

  if (error) {
    console.error("inquiries insert failed:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not save your enquiry" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
