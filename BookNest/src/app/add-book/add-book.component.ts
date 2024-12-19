import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-book',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-book.component.html',
    styleUrl: './add-book.component.css'
})
export class AddBookComponent {
    addBookForm: FormGroup;
    errorMsg: string | null = null;

    constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
        this.addBookForm = this.fb.group({
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

    onSubmit() {
        if (this.addBookForm.valid) {
            this.api.postNewBook(this.addBookForm.value).subscribe( {
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
