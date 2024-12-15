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

    constructor(private http: HttpClient, private router: Router) {
       this.checkLoginStatus() 
     }

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

    registerAdmin(user: User) {
        const url = '/api/register-admin'
        console.log(document.cookie);

        return this.http.post(url, user, { withCredentials: true }).subscribe(() => {
            this.router.navigate(['/'])
        })
    }

    logout() {
        const url = '/api/logout'
        return this.http.post(url, null, { withCredentials: true }).subscribe(() => {
            this.loggedIn.next(false);
            this.currentUserData.next(null);
            this.router.navigate(['/'])
        })
    }

    userProfile(userId: string) {
        const url = `/api/profile/?userId=${userId}`
        return this.http.get<User>(url)
    }

    private getUserFromCookie(): any {
        const decodedCookie = decodeURIComponent(document.cookie).split('.')
        const decodedPayload = JSON.parse(atob(decodedCookie[1]))
        console.log(decodedPayload);
        

        return decodedPayload
    }

    checkLoginStatus() {
        const url = '/api/check-auth'
        this.http.get(url, { withCredentials: true }).subscribe(
            (userData: any) => {
                this.loggedIn.next(true);
                this.currentUserData.next(userData)
            },
            () => {
                this.loggedIn.next(false);
                this.currentUserData.next(null)
            }
        )
    }
}
