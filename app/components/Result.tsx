import { CircleAlert, CircleX, File, ScrollText } from "lucide-react";
import type { Message, Result as ResultProps, RuleMeta } from "../data/data";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import type { HighlightRanges } from "@nozbe/microfuzz";
import { Highlight } from "@nozbe/microfuzz/react";
import { CodeIcon, Lightbulb } from "lucide-react";
import { useRef, useState } from "react";
import { shortenSource } from "~/lib/utils";
import Code from "./Code";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function ResultRule({
  line,
  column,
  ruleId,
  fix,
  suggestions,
  filePath,
  sourceCode,
  meta,
}: Message & {
  filePath: ResultProps["filePath"];
  sourceCode: ResultProps["source"];
  meta: RuleMeta;
}) {
  const [showSource, setShowSource] = useState(false);
  const keyRef = useRef("");
  const splitFile = filePath.split(".");
  const fileLink = `${filePath}:${line}:${column}`;
  const [source, firstLine] = shortenSource(line, sourceCode);

  if (keyRef.current === `${ruleId}:${fileLink}`) {
    console.log(keyRef.current);
  }
  keyRef.current = `${ruleId}:${fileLink}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {ruleId} {typeof fix !== "undefined" && "Fixable"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {typeof suggestions !== "undefined" && suggestions.length > 0 && (
          <>
            <h4 className="scroll-m-20 text-md font-semibold tracking-tight flex items-center">
              <Lightbulb className="mr-2" /> Suggestions:
            </h4>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              {suggestions?.map((suggestion) => (
                <li key={fileLink + suggestion.messageId}>
                  <i>{suggestion.desc}</i>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8 space-x-2">
          {source.length > 0 && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setShowSource((prev) => !prev);
              }}
            >
              <CodeIcon className="w-4 h-4 mr-2" />
              Toggle source
            </Button>
          )}
          {meta?.docs?.url && (
            <Button variant="outline" type="button" asChild>
              <a href={meta.docs.url} target="_blank" rel="noreferrer">
                <ScrollText className="w-4 h-4 mr-2" />
                Read docs
              </a>
            </Button>
          )}
        </div>

        {showSource && (
          <div className="mt-4">
            <Code
              code={source}
              firstLine={firstLine}
              fileExtension={splitFile[splitFile.length - 1]}
              highlightedLine={line}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Result(
  props: ResultProps & {
    metadata: Record<string, RuleMeta>;
    highlights: HighlightRanges | null;
  }
) {
  const {
    filePath,
    errorCount,
    warningCount,
    messages,
    source,
    metadata,
    highlights,
  } = props;
  console.log("🚀 ~ highlights:", highlights);

  return (
    <AccordionItem value={filePath}>
      <AccordionTrigger>
        <h2 className="flex gap-2 items-center text-left justify-between w-full">
          <span className="break-all">
            <Highlight text={filePath} ranges={highlights} />
          </span>
          {errorCount > 0 && (
            <div className="flex items-center mr-2 p-1 rounded-sm bg-[--red-9] text-white font-semibold tabular-nums">
              <CircleX className="mr-2" size={14} />
              {errorCount}
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center mr-2 p-1 rounded-sm bg-[--amber-9] text-black font-semibold tabular-nums">
              <CircleAlert className="mr-2" size={14} />
              {warningCount}
            </div>
          )}
        </h2>
      </AccordionTrigger>

      <AccordionContent>
        <div className="grid auto-rows-max items-start gap-2 lg:col-span-2 lg:gap-4">
          {messages.map((message) => (
            <ResultRule
              key={`${message.ruleId}:${filePath}`}
              filePath={filePath}
              sourceCode={source}
              {...message}
              meta={metadata[message.ruleId]}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
