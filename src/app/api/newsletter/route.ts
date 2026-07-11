import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email })
    .select()
    .single();

  if (error) {
    // Unique violation — already subscribed, treat as success.
    if (error.code === "23505") {
      return NextResponse.json({ subscribed: true });
    }
    console.error("Failed to save newsletter subscriber:", error);
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
  }

  return NextResponse.json({ subscribed: true });
}
