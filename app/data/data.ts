import resultsJSON from "./eslint-report.json" assert { type: "json" };
// import resultsJSON from "./eslint-report-simplified.json" assert { type: "json" };

export interface Fix {
  range: number[];
  text: string;
}

export interface Suggestion {
  messageId: string;
  fix: Fix;
  desc: string;
}

export interface Message {
  ruleId: string;
  severity: number;
  message: string;
  messageId: string;
  nodeType: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  suggestions?: Suggestion[];
  fix?: { range: [number, number]; text: string };
}

export interface SuppresedMessage {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  endLine: number;
  endColumn: number;
  fix: Fix;
  suppressions: Suppression[];
}

export interface Suppression {
  kind: string;
  justification: string;
}

export interface DeprecatedRule {
  ruleId: string;
  replacedBy: string[];
}

export interface Result {
  filePath: string;
  messages: Message[];
  suppressedMessages: SuppresedMessage[];
  errorCount: number;
  fatalErrorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  usedDeprecatedRules: DeprecatedRule[];
  source?: string;
}

export interface File {
  filePath: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  suggestions?: Suggestion[];
  source?: string;
  message: string;
  messageId: string;
}

export interface Rule {
  ruleId: string;
  severity: number;
  nodeType: string;
  files: File[];
}

export interface Docs {
  description: string;
  recommended: boolean | string;
  url: string;
}

export interface RuleMeta {
  type: string;
  docs: Docs;
  fixable?: "code" | "whitespace";
  hasSuggestions: boolean;
}

export const getResults = () => {
  const { results } = resultsJSON as { results: Result[] };

  const filteredResults = results.filter(
    (result) => result.errorCount > 0 || result.warningCount > 0
  );

  return filteredResults;
};

export const getRules = () => {
  const { results } = resultsJSON as { results: Result[] };

  const rules = results.reduce<Rule[]>((acc, result) => {
    if (result.errorCount === 0 && result.warningCount === 0) return acc;

    for (const message of result.messages) {
      const file: File = {
        filePath: result.filePath,
        line: message.line,
        column: message.column,
        endLine: message.endLine,
        endColumn: message.endColumn,
        suggestions: message?.suggestions,
        source: result?.source,
        message: message.message,
        messageId: message.messageId,
      };
      const ruleIndex = acc.findIndex((r) => r.ruleId === message.ruleId);

      if (ruleIndex === -1) {
        const rule: Rule = {
          ruleId: message.ruleId,
          severity: message.severity,
          nodeType: message.nodeType,
          files: [file],
        };

        acc.push(rule);
      } else {
        acc[ruleIndex] = {
          ...acc[ruleIndex],
          files: [...acc[ruleIndex].files, file],
        };
      }
    }

    return acc;
  }, []);

  return rules;
};

export const getRulesMetadata = () => {
  const { metadata } = resultsJSON as {
    metadata: { cwd: string; rulesMeta: Record<string, RuleMeta> };
  };

  return metadata;
};
