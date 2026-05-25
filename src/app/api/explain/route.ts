import { NextResponse } from "next/server";
import OpenAI from "openai";

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
Explain to a smart 15-year-old.

Rules:
- Use simple language
- Give examples
- Avoid jargon
- Keep it short
`,
          },
          {
            role: "user",
            content: body.text,
          },
        ],
      });

    return NextResponse.json({
      explanation:
        completion.choices[0].message.content,
    });

  } catch (error) {
    console.log("GROQ ERROR:", error);

    return NextResponse.json({
      explanation: "Groq request failed",
    });
  }
}