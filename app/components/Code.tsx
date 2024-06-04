import { useEffect, useState } from "react";
import { bundledLanguages, getHighlighter } from "shiki/bundle/web";
import { Skeleton } from "./ui/skeleton";

const getLangFromExt = (extension: string) => {
  switch (extension) {
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    default:
      return "text";
  }
};

const codeToHtml = async ({
  code,
  language,
  highlightedLine,
  firstLine,
}: {
  code: string[];
  language: ReturnType<typeof getLangFromExt>;
  highlightedLine: number;
  firstLine: number;
}) => {
  const highlighter = await getHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...Object.keys(bundledLanguages)],
  });

  return highlighter.codeToHtml(code.join("\n"), {
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },

    transformers: [
      {
        line(node, line) {
          node.properties["data-line"] = firstLine + line;
          if (firstLine + line === highlightedLine)
            this.addClassToHast(node, "highlight");
        },
      },
    ],
  });
};

function CodeSkeleton({ linesCount }: { linesCount: number }) {
  return (
    <div className="shiki">
      <div className="flex flex-col gap-[0.125em]">
        {linesCount >= 1 && <Skeleton className="h-5 w-[600px]" />}
        {linesCount >= 2 && <Skeleton className="h-5 w-[260px]" />}
        {linesCount >= 3 && <Skeleton className="h-5 w-[175px]" />}
        {linesCount >= 4 && <Skeleton className="h-5 w-[395px]" />}
        {linesCount >= 5 && <Skeleton className="h-5 w-[190px]" />}
        {linesCount >= 6 && <Skeleton className="h-5 w-[345px]" />}
        {linesCount >= 7 && <Skeleton className="h-5 w-[140px]" />}
        {linesCount >= 8 && <Skeleton className="h-5 w-[115px]" />}
        {linesCount >= 9 && <Skeleton className="h-5 w-[0]" />}
        {linesCount >= 10 && <Skeleton className="h-6 w-[335px]" />}
        {linesCount >= 11 && <Skeleton className="h-5 w-[435px]" />}
        {linesCount >= 12 && <Skeleton className="h-5 w-[75px]" />}
        {linesCount >= 13 && <Skeleton className="h-5 w-[0]" />}
        {linesCount >= 14 && <Skeleton className="h-5 w-[320px]" />}
        {linesCount >= 15 && <Skeleton className="h-5 w-[380px]" />}
        {linesCount >= 16 && <Skeleton className="h-5 w-[380px]" />}
        {linesCount >= 17 && <Skeleton className="h-5 w-[335px]" />}
        {linesCount >= 18 && <Skeleton className="h-5 w-[480px]" />}
        {linesCount >= 19 && <Skeleton className="h-5 w-[115px]" />}
        {linesCount >= 20 && <Skeleton className="h-5 w-[220px]" />}
      </div>
    </div>
  );
}
export default function Code({
  code,
  fileExtension,
  highlightedLine,
  firstLine,
}: {
  code: string[];
  fileExtension: string;
  highlightedLine: number;
  firstLine: number;
}) {
  const language = getLangFromExt(fileExtension);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    codeToHtml({ code, language, highlightedLine, firstLine }).then((code) => {
      setHtml(code);
    });
  });

  if (html.length === 0) {
    return <CodeSkeleton linesCount={code.length} />;
  }

  // biome-ignore lint/security/noDangerouslySetInnerHtml: this is source from eslint
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
