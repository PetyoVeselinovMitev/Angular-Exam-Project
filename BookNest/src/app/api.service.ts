import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Books } from "../types/books";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    getRecentBooks(){
        let url = `/api/books-recent`
        return this.http.get<Books[]>(url);
    }

    getBooks() {
        let url = `/api/books`
        return this.http.get<Books[]>(url);
    }
}