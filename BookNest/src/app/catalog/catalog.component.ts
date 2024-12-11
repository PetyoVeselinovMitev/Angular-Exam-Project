import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { CatalogPagination } from '../../types/catalogPagination';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
    catalogPagination: CatalogPagination = {
        books: [],
        totalPages: 0,
        currentPage: 1
    };

    constructor(private Api: ApiService, private viewportScroller: ViewportScroller) { }

    ngOnInit(): void {
        this.loadBooks(this.catalogPagination.currentPage)
    }

    loadBooks(page: number): void {
        this.Api.getBooksShorts(page).subscribe(
            (response: CatalogPagination) => {
                this.catalogPagination = response
                this.scrollToTop()
            }
        )
    }

    goToPage(page: number) {
        if (page > 0 && page <= this.catalogPagination.totalPages) {
            this.loadBooks(page)
        }
    }

    scrollToTop(): void {
        this.viewportScroller.scrollToPosition([0, 0])
    }
}
