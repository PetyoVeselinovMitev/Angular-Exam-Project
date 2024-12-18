import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "../types/users";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    private currentUserData = new BehaviorSubject<any>(null);
    private isInitialized = false;

    userFromCookie: User = {
        username: '',
        email: '',
        role: '',
        _id: ''
    }

    constructor(private http: HttpClient, private router: Router) {
       this.checkLoginStatus() 
     }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    get currentUser() {
        return this.currentUserData.asObservable();
    }

    guardData(): Observable<boolean> {
        this.userFromCookie = this.getUserFromCookie();
        if (!this.userFromCookie || !this.userFromCookie._id) {
            this.loggedIn.next(false);
            this.currentUserData.next(null);
            return new Observable<boolean>(observer => observer.next(false));
        }
    
        const url = `/api/profile/?userId=${this.userFromCookie._id}`;
        return this.http.get<User>(url).pipe(
            map((response: User) => {
                if (response) {
                    this.loggedIn.next(true);
                    this.currentUserData.next(response);
                    return true;
                } else {
                    this.loggedIn.next(false);
                    this.currentUserData.next(null);
                    return false;
                }
            })
        );
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

        return decodedPayload
    }

    checkLoginStatus() {
        if(this.isInitialized) {
            return
        }

        const url = '/api/check-auth'
        this.http.get(url, { withCredentials: true }).subscribe(
            (userData: any) => {
                this.loggedIn.next(true);
                this.currentUserData.next(userData);
                this.isInitialized = true;
            },
            () => {
                this.loggedIn.next(false);
                this.currentUserData.next(null)
            }
        )
    }
}
