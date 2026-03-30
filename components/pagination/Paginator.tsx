
type PaginatorClientProps = {
    currentPage: Promise<number>,
    totalPages: Promise<number>,
};

import PaginatorClient from './PaginatorClient';

export default async function Paginator(props: PaginatorClientProps) {

    const currentPage = await props.currentPage;
    const totalPages = await props.totalPages;

    return (
        <PaginatorClient currentPage={currentPage} totalPages={totalPages}></PaginatorClient>
    );
}
