import { ShortBooks } from "./shortBooks";

export interface CatalogPagination {
    books: ShortBooks[],
    totalPages: number,
    currentPage: number
}