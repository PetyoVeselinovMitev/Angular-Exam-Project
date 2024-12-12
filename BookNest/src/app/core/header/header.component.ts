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
    constructor (private authService: AuthService) {}

    ngOnInit(): void {
        this.isLoggedIn$ = this.authService.isLoggedIn
    }

}
