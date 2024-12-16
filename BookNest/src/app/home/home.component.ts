import { Component, OnInit } from '@angular/core';
import { Books } from '../../types/books';
import { ApiService } from '../api.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    books: Books[] = [];

    constructor(private Api: ApiService) {}

    ngOnInit(): void {
        this.Api.getRecentBooks().subscribe((books: Books[]) => {
            this.books = books
        })
    }
}
