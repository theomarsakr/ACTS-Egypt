import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: "Name, email and requirement are required." },
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

  const { error } = await supabase.from("inquiries").insert({
    name,
    company: typeof body.company === "string" ? body.company.trim() : null,
    email,
    phone: typeof body.phone === "string" ? body.phone.trim() : null,
    product_interest:
      typeof body.productInterest === "string" ? body.productInterest : null,
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
