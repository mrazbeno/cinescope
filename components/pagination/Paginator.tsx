import PaginatorClient from "./PaginatorClient";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
};

export default function Paginator({
  currentPage,
  totalPages,
}: PaginatorProps) {
  return (
    <PaginatorClient
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}