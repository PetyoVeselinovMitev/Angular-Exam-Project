import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { CatalogPagination } from '../../types/catalogPagination';
import { NgIf, ViewportScroller } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [RouterLink, NgIf],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
    catalogPagination: CatalogPagination = {
        books: [],
        totalPages: 0,
        currentPage: 1
    };
    currentUser$: Observable<any>
    role: string | null = null

    constructor(
        private Api: ApiService,
        private viewportScroller: ViewportScroller,
        private authService: AuthService
    ) {
        this.currentUser$ = this.authService.currentUser
    }

    ngOnInit(): void {
        this.loadBooks(this.catalogPagination.currentPage);
        this.currentUser$.subscribe(userData => {
            this.role = userData.role
        })
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
