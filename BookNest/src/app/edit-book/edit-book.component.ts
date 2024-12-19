import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-edit-book',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './edit-book.component.html',
    styleUrl: './edit-book.component.css'
})
export class EditBookComponent implements OnInit {
    editBookForm: FormGroup
    bookId: string | null = null;
    errorMsg: string | null = null;

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.editBookForm = this.fb.group({
            title: ['', [Validators.required]],
            author: ['', [Validators.required]],
            imageUrl: ['', [Validators.required]],
            ISBN: ['', [Validators.required]],
            publicationDate: ['', [Validators.required]],
            genre: ['', [Validators.required]],
            summary: ['', [Validators.required]],
            language: ['', [Validators.required]],
            numberOfPages: [0, [Validators.required]],
            publisher: ['', [Validators.required]],
            availableCopies: [0, [Validators.required]],
        })
    }

    ngOnInit(): void {
        this.bookId = this.route.snapshot.paramMap.get('id')
        if (this.bookId) {
            this.loadBookDetails(this.bookId)
        }
    }

    loadBookDetails(bookId: string): void {
        this.api.getBookDetails(bookId).subscribe((response) => {
            this.editBookForm.patchValue(response);
        })
    }

    onSubmit() {
        if (this.editBookForm.valid) {
            if (this.bookId) {
                this.api.editBook(this.bookId, this.editBookForm.value).subscribe({
                    next: () => {
                        this.router.navigate(['/catalog'])
                    },
                    error: (error) => {
                        this.errorMsg = error
                    }
                })
            }
        }
    }
}

