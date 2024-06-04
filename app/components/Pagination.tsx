import { useSearchParams } from "@remix-run/react";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from "~/components/ui/pagination";

export const DEFAULT_PAGE_SIZE = 20;

function setSearchParamsString(
  searchParams: URLSearchParams,
  changes: Record<string, string | number | undefined>
) {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key);
      continue;
    }
    newSearchParams.set(key, String(value));
  }
  return Array.from(newSearchParams.entries())
    .map(([key, value]) =>
      value ? `${key}=${encodeURIComponent(value)}` : key
    )
    .join("&");
}
export function Pagination({ total }: { total: number }) {
  const [searchParams] = useSearchParams();
  const $top = Number(searchParams.get("top")) || DEFAULT_PAGE_SIZE;
  const $skip = Number(searchParams.get("skip")) || 0;
  const currentPage = Math.floor($skip / $top) + 1;
  const maxPages = 7;
  const canPageBackwards = $skip > 0;
  const canPageForwards = $skip + $top < total;

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={{
              search: setSearchParamsString(searchParams, {
                skip: Math.max($skip - $top, 0),
              }),
            }}
            prefetch="intent"
            aria-disabled={!canPageBackwards}
            tabIndex={canPageBackwards ? undefined : -1}
            className={
              canPageBackwards ? undefined : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            to={{
              search: setSearchParamsString(searchParams, {}),
            }}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            to={{
              search: setSearchParamsString(searchParams, {
                skip: $skip + $top,
              }),
            }}
            prefetch="intent"
            aria-disabled={!canPageForwards}
            tabIndex={canPageForwards ? undefined : -1}
            className={
              canPageForwards ? undefined : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
