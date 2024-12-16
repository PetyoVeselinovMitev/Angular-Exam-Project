import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Books } from '../../types/books';
import { User } from '../../types/users';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './details.component.html',
    styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
    bookId: string | null = null;
    bookData: Books = {
        title: '',
        author: '',
        imageUrl: '',
        ISBN: '',
        publicationDate: '',
        genre: '',
        summary: '',
        language: '',
        numberOfPages: 0,
        publisher: '',
        availableCopies: 0,
        _id: ''
    };

    currentUser$: Observable<User>
    username: string | null = null

    constructor(private route: ActivatedRoute, private api: ApiService, private auth: AuthService, private router: Router) {
        this.currentUser$ = this.auth.currentUser
     }

    ngOnInit(): void {
        this.currentUser$.subscribe(userData => {
            this.username = userData?.username || null
        })
        this.route.paramMap.subscribe(params => {
            this.bookId = params.get('id')
            if (this.bookId) {
                this.loadBookDetails(this.bookId)
            }
        })
    }

    loadBookDetails(bookId: string): void {
        this.api.getBookDetails(bookId).subscribe(
            response => {
                this.bookData = response
            },
            error => {
                console.error('Error fetching book data.', error);
            }
        )
    }

    onSubmit(bookId: string) {
        this.api.reserveBook(bookId).subscribe(() => {
            this.router.navigate(['/profile'])
        })
    }
}
