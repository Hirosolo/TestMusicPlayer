import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";

export async function GET(req: Request, { params }: any) {
  const { id } = params; 
  
  const { data, error } = await supabaseClient
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
