"use client";

import React, { useEffect } from "react";
// Remove react-syntax-highlighter import
import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js";

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  useEffect(() => {
    // Highlight all code blocks after component mounts
    hljs.highlightAll();
  }, [code, language]);

  return (
    <pre className="hljs">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
