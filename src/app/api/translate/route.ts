import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  console.log("📥 Text received for translation:", text)

  try {
    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: "en",
        target: "ur",
        format: "text"
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )

    console.log("📤 Translated:", response.data)

    return NextResponse.json({ translated: response.data.translatedText })
  } catch (err) {
    console.error("❌ Translation API error:", err)
    return NextResponse.json({ translated: "⚠️ ترجمہ ناکام ہو گیا۔" }, { status: 500 })
  }
}
