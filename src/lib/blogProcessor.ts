import axios from "axios"

/**
 * Simulates blog scraping based on the input URL.
 * In production, this would fetch and parse actual blog HTML content.
 */
export function scrapeBlogText(url: string): string {
  console.log("🔍 Scraping blog from:", url);

  // Simulate different dummy content based on domain
  if (url.includes("medium")) {
    return `
      Working from home has become a common trend in the tech industry. Many developers struggle to stay productive without structured office environments.
      Key strategies include setting a routine, minimizing distractions, and using task management tools like Notion or Trello.
      Breaks, proper workspaces, and clear goals can improve remote work efficiency drastically.
    `;
  }

  if (url.includes("example")) {
    return `
      Artificial Intelligence is changing the future of work. Tools like ChatGPT and DALL·E are redefining how we interact with information.
      Businesses are increasingly relying on automation to speed up tasks and reduce human effort.
    `;
  }

  // Fallback generic content if domain isn't recognized
  return `
    This is simulated blog content fetched from: ${url}
    Blog scraping is in progress. Real blog content would be extracted and summarized here in a real-world app.
  `;
}

/**
 * Generates a basic summary from blog content.
 * For now, it just takes the first 3 non-empty sentences.
 */
export function generateSummary(fullText: string): string {
  const sentences = fullText
    .split('.')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const summary = sentences.slice(0, 3).join('. ') + '.';
  return summary;
}

/**
 * Uses LibreTranslate to convert English summary to Urdu.
 * This makes the summarizer generic and AI-powered.
 */
export async function translateToUrdu(summary: string): Promise<string> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summary }),
    })

    const data = await response.json()
    console.log("✅ Urdu translation result:", data)

    return data.translated || "⚠️ ترجمہ دستیاب نہیں"
  } catch (err) {
    console.error("❌ Translation fetch error:", err)
    return "⚠️ ترجمہ ناکام ہو گیا۔"
  }
}
