"use client";

import LatexEditor from "@/components/LatexEditor";
import PDFViewer from "@/components/PDFViewer";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full p-2">
        <ResizablePanel className="flex flex-col p-2 gap-y-1">
          <LatexEditor setText={setText} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-2">
          <PDFViewer text={text} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
