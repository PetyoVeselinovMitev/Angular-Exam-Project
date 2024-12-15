import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, NgIf, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    isLoggedIn$: Observable<boolean> = new BehaviorSubject<boolean>(false).asObservable();
    currentUser$: Observable<any>

    username: string | null = null;
    role: string | null = null;

    constructor(private authService: AuthService) {
        this.isLoggedIn$ = this.authService.isLoggedIn
        this.currentUser$ = this.authService.currentUser
    }

    ngOnInit(): void {
        this.currentUser$.subscribe(userData => {
            this.username = userData?.username || null
            this.role = userData?.role || null
        })
    }

    logout(): void {
        this.authService.logout()
    }
}
