"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginatorClientProps = {
  currentPage: number;
  totalPages: number;
};

export default function PaginatorClient({
  currentPage,
  totalPages: rawTotal,
}: PaginatorClientProps) {
  const MAX_PAGE_BY_TMDB = 500;
  const totalPages = Math.min(Math.max(rawTotal, 1), MAX_PAGE_BY_TMDB);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const getPageLink = React.useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const goToPage = React.useCallback(
    (page: number) => {
      if (isPending) return;
      if (page === safeCurrentPage) return;
      if (page < 1 || page > totalPages) return;

      const href = getPageLink(page);

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [getPageLink, isPending, router, safeCurrentPage, totalPages]
  );

  const visiblePages = 3;
  const half = Math.floor(visiblePages / 2);

  let start = Math.max(1, safeCurrentPage - half);
  let end = Math.min(totalPages, safeCurrentPage + half);

  if (safeCurrentPage - 1 < half) {
    end = Math.min(totalPages, visiblePages);
  }

  if (totalPages - safeCurrentPage < half) {
    start = Math.max(1, totalPages - visiblePages + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  function PageButton({
    page,
    active = false,
    children,
  }: {
    page: number;
    active?: boolean;
    children: React.ReactNode;
  }) {
    const href = getPageLink(page);

    return (
      <PaginationLink
        href={href}
        isActive={active}
        aria-current={active ? "page" : undefined}
        aria-disabled={isPending}
        onClick={(e) => {
          e.preventDefault();
          goToPage(page);
        }}
      >
        {children}
      </PaginationLink>
    );
  }

  return (
    <div className={isPending ? "opacity-70" : ""}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {safeCurrentPage > 1 && (
              <PaginationPrevious
                href={getPageLink(safeCurrentPage - 1)}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(safeCurrentPage - 1);
                }}
              />
            )}
          </PaginationItem>

          {start > 1 && (
            <>
              <PaginationItem>
                <PageButton page={1}>1</PageButton>
              </PaginationItem>

              {start > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pageNumbers.map((num) => (
            <PaginationItem key={num}>
              <PageButton page={num} active={num === safeCurrentPage}>
                {num}
              </PageButton>
            </PaginationItem>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PageButton page={totalPages}>{totalPages}</PageButton>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            {safeCurrentPage < totalPages && (
              <PaginationNext
                href={getPageLink(safeCurrentPage + 1)}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(safeCurrentPage + 1);
                }}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}