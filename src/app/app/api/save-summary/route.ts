import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { url, summary, urdu_translation } = await req.json()

  const { data, error } = await supabase
    .from("summaries")
    .insert([{ url, summary, urdu_translation }])

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
