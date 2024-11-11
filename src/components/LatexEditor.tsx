"use client";

import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import localforage from "localforage";

export default function LatexEditor({
  setText,
}: {
  setText: (text: string) => void;
}) {
  const [editorHeight, setEditorHeight] = useState<number>(300);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const latexFileRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [fileSaved, setFileSaved] = useState<boolean>(true);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    localforage.getItem("latex-file").then((value) => {
      if (value && editorRef.current?.view) {
        setText(value as string);
        editorRef.current.view.dispatch({
          changes: {
            from: 0,
            to: editorRef.current.view.state.doc.length,
            insert: value as string,
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setEditorHeight(editorContainerRef.current?.clientHeight ?? 500);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const triggerImportLatexFile = () => {
    latexFileRef.current?.click();
  };

  const handleImportLatexFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file && (file.name.endsWith(".tex") || file.name.endsWith(".txt"))) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (editorRef.current?.view) {
            editorRef.current.view.dispatch({
              changes: {
                from: 0,
                to: editorRef.current.view.state.doc.length,
                insert: content as string,
              },
            });
          }
        };
        reader.readAsText(file);
      } else {
        toast.error("Invalid file format");
      }
    }
  };

  const handleOnChange = () => {
    if (firstRender) setFirstRender(false);
    else if (fileSaved) setFileSaved(false);
  };

  const handleSaveFile = () => {
    if (editorRef.current?.view) {
      setText(editorRef.current?.view.state.doc.toString());
      localforage
        .setItem("latex-file", editorRef.current?.view.state.doc.toString())
        .then(() => {
          setFileSaved(true);
        });
    } else {
      toast.error("No content to save");
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-y-2">
      <div className="w-full flex flex-row gap-x-2">
        <Button onClick={triggerImportLatexFile} className="w-fit">
          Import Latex file
        </Button>
        <Button onClick={() => handleSaveFile()}>Save</Button>
      </div>
      <input
        type="file"
        accept=".tex,.txt"
        ref={latexFileRef}
        style={{ display: "none" }}
        onChange={handleImportLatexFile}
      />
      {fileSaved ? (
        <p className="text-green-500 text-md">File saved</p>
      ) : (
        <p className="text-red-500 text-md">File not saved</p>
      )}
      <div className="flex flex-col w-full h-full" ref={editorContainerRef}>
        <CodeMirror
          height={editorHeight.toString() + "px"}
          extensions={[StreamLanguage.define(stex)]}
          ref={editorRef}
          onChange={() => handleOnChange()}
        />
      </div>
    </div>
  );
}
