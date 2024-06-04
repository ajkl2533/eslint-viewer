import type { HighlightRanges } from "@nozbe/microfuzz";
import { Highlight } from "@nozbe/microfuzz/react";
import {
  CircleAlert,
  CircleX,
  CodeIcon,
  Lightbulb,
  ScrollText,
} from "lucide-react";
import { useState } from "react";
import { shortenSource } from "~/lib/utils";
import type { File, RuleMeta, Rule as RuleProps } from "../data/data";
import Code from "./Code";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function RuleFile({ file, meta }: { file: File; meta: RuleMeta }) {
  const [showSource, setShowSource] = useState(false);
  const splitFile = file.filePath.split(".");
  const fileLink = `${file.filePath}:${file.line}:${file.column}`;
  const [source, firstLine] = shortenSource(file.line, file.source);

  return (
    <Card key={fileLink}>
      <CardHeader>
        <CardTitle>
          <a href={`vscode://file/${fileLink}`}>{fileLink}</a>
        </CardTitle>
        <CardDescription>{file.message}</CardDescription>
      </CardHeader>
      <CardContent>
        {typeof file.suggestions !== "undefined" &&
          file.suggestions.length > 0 && (
            <>
              <h4 className="scroll-m-20 text-md font-semibold tracking-tight flex items-center">
                <Lightbulb className="mr-2" /> Suggestions:
              </h4>
              <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
                {file.suggestions?.map((suggestion) => (
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
              highlightedLine={file.line}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Rule(
  props: RuleProps & { meta: RuleMeta; highlights: HighlightRanges | null }
) {
  const { ruleId, files, severity, meta, highlights } = props;

  return (
    <AccordionItem value={ruleId}>
      <AccordionTrigger>
        <h2 className="flex items-center justify-between w-full text-left">
          <span>
            <Highlight text={ruleId} ranges={highlights} />
          </span>
          {severity === 1 ? (
            <div className="flex items-center mr-2 p-1 rounded-sm bg-[--amber-9] text-black font-semibold tabular-nums">
              <CircleAlert className="mr-2" size={14} />
              <span className="no-underline">{files.length}</span>
            </div>
          ) : (
            <div className="flex items-center mr-2 p-1 rounded-sm bg-[--red-9] text-white font-semibold tabular-nums">
              <CircleX className="mr-2" size={14} />
              {files.length}
            </div>
          )}
        </h2>
      </AccordionTrigger>

      <AccordionContent>
        <div className="grid auto-rows-max items-start gap-2 lg:col-span-2 lg:gap-4">
          {files.map((file) => (
            <RuleFile
              key={`${ruleId}:${file.filePath}:${file.line}:${file.column}`}
              file={file}
              meta={meta}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
