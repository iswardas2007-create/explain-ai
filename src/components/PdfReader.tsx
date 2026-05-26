"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

interface PdfReaderProps {
  file: File;
  onTextSelected: (text: string) => void;
}

export function PdfReader({
  file,
  onTextSelected,
}: PdfReaderProps) {
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const handleSelection = () => {
      const selected =
        window.getSelection()?.toString().trim();

      if (selected) {
        onTextSelected(selected);
      }
    };

    document.addEventListener(
      "mouseup",
      handleSelection
    );

    return () => {
      document.removeEventListener(
        "mouseup",
        handleSelection
      );
    };
  }, [onTextSelected]);

  return (
    <div className="h-full overflow-y-auto">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) =>
          setNumPages(numPages)
        }
      >
        {Array.from(
          { length: numPages },
          (_, i) => (
            <div
              key={i}
              className="flex justify-center mb-4"
            >
              <Page
                pageNumber={i + 1}
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