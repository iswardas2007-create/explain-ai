import { NextResponse } from "next/server";
import OpenAI from "openai";

// Fix Windows certificate issue (development)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(req: Request) {
  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const body = await req.json();

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `
You are an expert teacher.

Summarize the given content into 10–15 easy points.

Rules:
• Very simple language
• Bullet points only
• Short sentences
• Explain difficult concepts simply
• Focus on key ideas only
`,
          },

          {
            role: "user",
            content: body.text,
          },
        ],
      });

    return NextResponse.json({
      summary:
        completion.choices[0].message.content,
    });

  } catch (error) {
    console.log(
      "SUMMARY ERROR:",
      error
    );

    return NextResponse.json({
      summary:
        "Could not generate summary",
    });
  }
}