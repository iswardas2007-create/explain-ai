"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfReaderProps {
  file: File;
  onTextSelected: (text: string) => void;
}

export function PdfReader({
  file,
  onTextSelected,
}: PdfReaderProps) {
  const [numPages, setNumPages] = useState(0);

  const handleMouseUp = () => {
    const text = window.getSelection()?.toString();

    if (text?.trim()) {
      onTextSelected(text);
    }
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="h-full overflow-y-auto rounded-xl bg-zinc-100 p-4"
    >
      <Document
        file={file}
        onLoadSuccess={({ numPages }) =>
          setNumPages(numPages)
        }
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF</p>}
      >
        {Array.from(
          { length: numPages },
          (_, i) => (
            <div
              key={i}
              className="mb-6 flex justify-center"
            >
              <Page
                pageNumber={i + 1}
                width={800}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </div>
          )
        )}
      </Document>
    </div>
  );
}