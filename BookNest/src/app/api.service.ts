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
}