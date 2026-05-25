"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const PdfReader = dynamic(
  () => import("@/components/PdfReader").then((mod) => mod.PdfReader),
  {
    ssr: false,
  }
);

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function explainText() {
    if (!selectedText) return;

    setLoading(true);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: selectedText,
        }),
      });

      const data = await response.json();

      setAiResponse(data.explanation);

    } catch {
      setAiResponse("Error getting explanation");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold text-center mb-4">
        ExplainAI
      </h1>

      <p className="text-center text-gray-400 mb-8">
        Upload research papers and understand anything instantly
      </p>

      {!pdfFile && (
        <div className="flex justify-center">
          <label className="bg-white text-black px-6 py-3 rounded-xl cursor-pointer">

            Upload PDF

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) setPdfFile(file);
              }}
            />

          </label>
        </div>
      )}

      {pdfFile && (
        <div className="grid grid-cols-4 gap-4 h-[80vh]">

          <div className="col-span-3">
            <PdfReader
              file={pdfFile}
              onTextSelected={setSelectedText}
            />
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">

            <h2 className="text-xl font-bold mb-4">
              🧠 ExplainAI
            </h2>

            <button
              onClick={explainText}
              className="w-full bg-blue-600 p-3 rounded-lg mb-4"
            >
              Explain Like I'm 15
            </button>

            <div className="bg-black p-4 rounded-lg">

              <p className="text-sm text-gray-400">
                Selected:
              </p>

              <p className="text-xs mb-4">
                {selectedText.slice(0,120)}
              </p>

              <hr className="my-4"/>

              <p className="text-sm text-gray-400">
                AI:
              </p>

              <p className="mt-2">
                {loading
                  ? "Thinking..."
                  : aiResponse || "No explanation yet"}
              </p>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}