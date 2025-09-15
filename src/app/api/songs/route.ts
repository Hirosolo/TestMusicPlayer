import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

// GET all songs
export async function GET() {
  const { data, error } = await supabaseClient.from("songs").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST new song
export async function POST(request: Request) {
  const body = await request.json();
  const { title, artist, album, duration, cover_url, file_path, file_url } = body;

  const { data, error } = await supabaseClient.from("songs").insert([
    { title, artist, album, duration, cover_url, file_path, file_url },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
