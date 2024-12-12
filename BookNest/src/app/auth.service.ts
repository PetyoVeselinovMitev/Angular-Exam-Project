import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { User } from "../types/users";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, private router: Router) { }

    get isLoggedIn() {
        return this.loggedIn.asObservable()
    }

    login(user: User) {
        const url = '/api/login'
        return this.http.post<{ token: string }>(url, user).subscribe(response => {
            localStorage.setItem('token', response.token);
            this.loggedIn.next(true);
            this.router.navigate(['/']);
        });
    }

    register(user: User) {
        const url = '/api/register'
        return this.http.post(url, user)
    }

    logout() {
        localStorage.removeItem('token')
        this.loggedIn.next(false);
        this.router.navigate(['/'])
    }
}


