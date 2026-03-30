"use client"

import { Pagination, PaginationContent, PaginationItem, PaginationEllipsis, PaginationNext, PaginationPrevious, PaginationLink } from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

type PaginatorClientProps = {
  currentPage: number;
  totalPages: number;
};

export default function PaginatorClient({ currentPage, totalPages: rawTotal }: PaginatorClientProps) {
  const MAX_PAGE_BY_TMDB = 500;
  const totalPages = Math.min(rawTotal, MAX_PAGE_BY_TMDB);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const visiblePages = 3;
  const half = Math.floor(visiblePages / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage - 1 < half) {
    end = Math.min(totalPages, visiblePages);
  }
  if (totalPages - currentPage < half) {
    start = Math.max(1, totalPages - visiblePages + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          {currentPage > 1 && (
            <PaginationPrevious href={getPageLink(currentPage - 1)} />
          )}
        </PaginationItem>

        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={getPageLink(1)}>1</PaginationLink>
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
            <PaginationLink href={getPageLink(num)} isActive={num === currentPage}>
              {num}
            </PaginationLink>
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
              <PaginationLink href={getPageLink(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          {currentPage < totalPages && (
            <PaginationNext href={getPageLink(currentPage + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
