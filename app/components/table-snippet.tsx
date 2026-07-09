"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TableSnippetProps {
  markdown: string;
}

export function TableSnippet({ markdown }: TableSnippetProps) {
  return (
    <div className="snippet-card min-w-[420px] max-w-[900px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <table className="snippet-table">{children}</table>
          ),
          p: ({ children }) => <>{children}</>,
        }}
      >
        {markdown || "| coluna |\n|---|\n| cole seu markdown |"}
      </ReactMarkdown>
    </div>
  );
}