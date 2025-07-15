// src/app/api/save/route.ts
import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const dbName = "BlogData"

export async function POST(req: NextRequest) {
  const { fullText } = await req.json()

  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection("blogs")

    const result = await collection.insertOne({ content: fullText, createdAt: new Date() })
    await client.close()

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (err) {
    console.error("MongoDB Error:", err)
    return NextResponse.json({ success: false, error: err }, { status: 500 })
  }
}
