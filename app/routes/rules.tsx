import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import pluralize from "pluralize";
import { Rule } from "../components/Rule";
import { Accordion } from "../components/ui/accordion";

import { useEffect } from "react";
import { DEFAULT_PAGE_SIZE, Pagination } from "~/components/Pagination";
import { Input } from "~/components/ui/input";
import { getRules, getRulesMetadata } from "../data/data";
export const meta: MetaFunction = () => {
  return [{ title: "Rules - ESLint Viewer" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const $top = Number(url.searchParams.get("top") || DEFAULT_PAGE_SIZE);
  const $skip = Number(url.searchParams.get("skip") || 0);
  const $q = url.searchParams.get("q") || "";

  const rules = await getRules();
  const metadata = await getRulesMetadata();

  return json({
    total: rules.length,
    entries: rules.slice($skip, $skip + $top),
    metadata,
    q: $q,
  });
};

export default function Rules() {
  const { total, entries, metadata, q } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const filteredList = useFuzzySearchList({
    list: entries,
    queryText: q,
    getText: (item) => [item.ruleId],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      rule: item,
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
          {total} {pluralize("rules", total)}
        </p>
        <Form
          id="search-form"
          role="search"
          onChange={(event) => submit(event.currentTarget)}
          className="w-full max-w-60"
        >
          <Input
            aria-label="Search rules"
            defaultValue={q}
            id="q"
            name="q"
            type="search"
            placeholder="Search rules..."
          />
        </Form>
      </div>
      <Accordion type="single" collapsible>
        {filteredList.map(({ rule, highlightRanges }) => (
          <Rule
            key={rule.ruleId}
            {...rule}
            meta={metadata.rulesMeta[rule.ruleId]}
            highlights={highlightRanges}
          />
        ))}
      </Accordion>
      <Pagination total={total} />
    </div>
  );
}
