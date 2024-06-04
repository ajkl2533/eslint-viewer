import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";

import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import pluralize from "pluralize";
import { useEffect } from "react";
import { DEFAULT_PAGE_SIZE, Pagination } from "~/components/Pagination";
import { Input } from "~/components/ui/input";
import { Result } from "../components/Result";
import { Accordion } from "../components/ui/accordion";
import { getResults, getRulesMetadata } from "../data/data";

export const meta: MetaFunction = () => {
  return [{ title: "Files result - ESLint Viewer" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const $top = Number(url.searchParams.get("top") || DEFAULT_PAGE_SIZE);
  const $skip = Number(url.searchParams.get("skip") || 0);
  const $q = url.searchParams.get("q") || "";

  const results = await getResults();
  const metadata = await getRulesMetadata();

  return json({
    total: results.length,
    entries: results.slice($skip, $skip + $top),
    metadata,
    q: $q,
  });
};

export default function Files() {
  const { total, entries, metadata, q } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const filteredList = useFuzzySearchList({
    list: entries,
    queryText: q,
    getText: (item) => [item.filePath],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      result: item,
      highlightRanges,
    }),
  });

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between">
        <p className="text-xl text-muted-foreground">
          {total} {pluralize("file", total)}
        </p>
        <Form
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
          className="w-full max-w-60"
        >
          <Input
            aria-label="Search files"
            defaultValue={q}
            id="q"
            name="q"
            type="search"
            placeholder="Search files..."
          />
        </Form>
      </div>
      <Accordion type="single" collapsible>
        {filteredList.map(({ result, highlightRanges }) => (
          <Result
            key={result.filePath}
            {...result}
            metadata={metadata.rulesMeta}
            highlights={highlightRanges}
          />
        ))}
      </Accordion>
      <Pagination total={total} />
    </div>
  );
}
