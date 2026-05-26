"use client";
console.log("NEW PAGE LOADED");
import dynamic from "next/dynamic";
import { useState } from "react";

const PdfReader = dynamic(
  () =>
    import("@/components/PdfReader").then(
      (mod) => mod.PdfReader
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-gray-400">
        Loading PDF...
      </p>
    ),
  }
);

export default function Home() {
  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [selectedText, setSelectedText] =
    useState("");

  const [explanation, setExplanation] =
    useState("");

  const [summary, setSummary] =
    useState("");

  async function explainText() {
    if (!selectedText) return;

    const response = await fetch(
      "/api/explain",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          text:selectedText
        })
      }
    );

    const data =
      await response.json();

    setExplanation(
      data.explanation
    );
  }

  async function summarizePaper() {
    if (!selectedText) return;

    const response = await fetch(
      "/api/summarize",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          text:selectedText
        })
      }
    );

    const data =
      await response.json();

    setSummary(
      data.summary
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <h1 className="text-6xl font-bold text-center mb-5">
        ExplainAI
      </h1>

      <p className="text-center text-gray-400 mb-8">
        Upload research papers and understand anything instantly
      </p>

      {!pdfFile && (
        <div className="flex justify-center">

          <input
            type="file"
            accept=".pdf"
            onChange={(e)=>{

              const file =
                e.target.files?.[0];

              if(file){

                setPdfFile(file);

              }

            }}
          />

        </div>
      )}

      {pdfFile && (

        <div className="flex gap-5">

          <div className="w-3/4 h-[80vh] bg-zinc-900 p-4 rounded-xl">

            <PdfReader
              file={pdfFile}
              onTextSelected={
                setSelectedText
              }
            />

          </div>

          <div className="w-1/4 bg-zinc-900 p-4 rounded-xl">

            <h2 className="text-2xl font-bold mb-5">
              🧠 ExplainAI
            </h2>

            <button
              onClick={explainText}
              className="w-full bg-blue-600 p-3 rounded-xl mb-3"
            >
              Explain Like I'm 15
            </button>

            <button
              onClick={summarizePaper}
              className="w-full bg-green-600 p-3 rounded-xl"
            >
              📝 Summarize Paper
            </button>

            <div className="mt-5">

              <p className="font-bold">
                Selected:
              </p>

              <p className="text-sm border-b border-gray-700 pb-3">
                {selectedText}
              </p>

              <div className="mt-4">

                <p className="font-bold">
                  AI:
                </p>

                <p>
                  {explanation}
                </p>

              </div>

              <div className="mt-5">

                <p className="font-bold">
                  Summary:
                </p>

                <p className="whitespace-pre-wrap">
                  {summary}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}