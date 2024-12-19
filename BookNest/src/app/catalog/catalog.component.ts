import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
    selectedBook: string | null = null;
    isModalOpen: boolean = false

    constructor(
        private Api: ApiService,
        private viewportScroller: ViewportScroller,
        private authService: AuthService,
        private router: Router
    ) {
        this.currentUser$ = this.authService.currentUser
    }

    ngOnInit(): void {
        this.loadBooks(this.catalogPagination.currentPage);
        this.currentUser$.subscribe(userData => {
            this.role = userData?.role || null
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

    deleteBook(bookId: string) {
        this.selectedBook = bookId;
        this.isModalOpen = true;
    }

    confirmDelete(): void {
        if (this.selectedBook) {
            this.Api.deleteBook(this.selectedBook).subscribe(() => {
                this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() => {
                    this.router.navigate(['/catalog'])
                })
          });
        }
      }
    
      closeModal(): void {
        this.isModalOpen = false;
        this.selectedBook = null;
      }
}
