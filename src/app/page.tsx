'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { scrapeBlogText, generateSummary, translateToUrdu } from "@/lib/blogProcessor"
import { motion } from "framer-motion"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [summary, setSummary] = useState("")
  const [urduSummary, setUrduSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const fullText = scrapeBlogText(url)
      const summaryResult = generateSummary(fullText)
      const urduResult = await translateToUrdu(summaryResult)

      setSummary(summaryResult)
      setUrduSummary(urduResult)

      await fetch("/api/save-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          summary: summaryResult,
          urdu_translation: urduResult,
        }),
      })
    } catch (err) {
      console.error("❌ Summarising failed:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#043B4C] via-[#075E54] to-[#0B766C] flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-8 rounded-3xl shadow-2xl backdrop-blur-sm bg-white/90">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-teal-800 mb-2 tracking-tight">
              ✨ AI Blog Summariser
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Paste any blog URL to get a smart AI-powered summary in English & Urdu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              placeholder="e.g. https://medium.com/@someone/blog-post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="ring-2 ring-teal-500 focus:ring-blue-500 transition-all text-sm"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:scale-105 transition-all duration-300 text-white font-medium text-base py-2.5"
              disabled={loading}
            >
              {loading ? "Summarising..." : "Summarise Blog"}
            </Button>
          </form>

          {error && (
            <p className="text-red-600 mt-3 text-center text-sm">{error}</p>
          )}
        </Card>

        {(summary || urduSummary) && (
          <motion.div
            className="mt-10 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {summary && (
              <Card className="bg-white/90 rounded-2xl shadow-lg border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-blue-700 mb-2">📝 English Summary</h2>
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </CardContent>
              </Card>
            )}

            {urduSummary && (
              <Card className="bg-white/90 rounded-2xl shadow-lg border-l-4 border-green-500">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-green-700 mb-2">🌐 Urdu Translation</h2>
                  <p className="text-gray-800 leading-relaxed font-noto">{urduSummary}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
