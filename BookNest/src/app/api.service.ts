import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Books } from "../types/books";
import { CatalogPagination } from "../types/catalogPagination";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    getRecentBooks(){
        let url = `/api/books-recent`
        return this.http.get<Books[]>(url);
    }

    getBooksShorts(page: number) {
        let url = `/api/books-short/?page=${page}`
        return this.http.get<CatalogPagination>(url);
    }

    getBookDetails(bookId: string) {
        let url = `/api/books/${bookId}`;
        return this.http.get<Books>(url)
    }

    reserveBook(bookId: string) {
        let url =`/api/books/${bookId}/reserve`;
        return this.http.post(url, null)
    }

    returnBook(bookId: string) {
        let url =`/api/books/${bookId}/return`;
        return this.http.post(url, null)
    }

    postNewBook(book: object) {
        let url = '/api/books'
        return this.http.post(url, book)
    }

    editBook(bookId: string, book: object) {
        let url = `/api/books/${bookId}`;
        return this.http.patch(url, book)
    }

    deleteBook(bookId: string) {
        let url = `/api/books/${bookId}`
        return this.http.delete(url)
    }
}