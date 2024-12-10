import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Books } from '../../types/books';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-catalog',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit{
    books: Books[] = [];

    constructor (private Api: ApiService) {}

    ngOnInit(): void {
        this.Api.getBooks().subscribe((books) => {
            this.books = books
        })
    }
}
