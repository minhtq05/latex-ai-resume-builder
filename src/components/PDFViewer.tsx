"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Document } from "react-pdf";

export default function PDFViewer({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleCompilePDF = async () => {
    setIsLoading(true);
    await axios
      .post("/api/compile-pdf", {
        texContent: text,
      })
      .then(async (res) => {
        const blob = await res.data.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsLoading(false);
        toast.success("PDF compiled successfully!");
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (text) {
      handleCompilePDF();
    }
  });

  return (
    <div className="w-full h-full overflow-y-auto">
      {isLoading ? (
        <p>Loading PDF...</p>
      ) : pdfUrl ? (
        <Document file={pdfUrl} />
      ) : (
        <p className="text-red-500">Error, URL is empty</p>
      )}
    </div>
  );
}
