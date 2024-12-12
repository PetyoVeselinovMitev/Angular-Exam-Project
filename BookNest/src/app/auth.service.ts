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
    private currentUserData = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient, private router: Router) { }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    get currentUser() {
        return this.currentUserData.asObservable();
    }

    login(user: User) {
        const url = '/api/login'
        return this.http.post(url, user, { withCredentials: true }).subscribe(() => {
            this.loggedIn.next(true);
            
            const userData = this.getUserFromCookie()
            this.currentUserData.next(userData)
            
            this.router.navigate(['/']);
        });
    }

    register(user: User) {
        const url = '/api/register'
        return this.http.post(url, user, { withCredentials: true }).subscribe(() => {
            this.loggedIn.next(true);
            
            const userData = this.getUserFromCookie()
            this.currentUserData.next(userData)
            
            this.router.navigate(['/'])
        })
    }

    logout() {
        const url = '/api/logout'
        const dummyPayload = {data: 1337}
        return this.http.post(url, dummyPayload, { withCredentials: true }).subscribe(() => {
            this.loggedIn.next(false);
        })
    }

    private getUserFromCookie(): any {
        const decodedCookie = decodeURIComponent(document.cookie).split('.')
        const decodedPayload = JSON.parse(atob(decodedCookie[1]))

        return decodedPayload
    }
}
