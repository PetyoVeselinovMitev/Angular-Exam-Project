import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../../types/users';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    profileData: User = {
        username: '',
        email: '',
        password: ''
    }
    currentUser$: Observable<any>

    userId: string | null = null;

    constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser
    }

    ngOnInit(): void {
        this.currentUser$.subscribe(userData => {
            this.userId = userData?._id || null;
            if (this.userId) {
                this.loadProfile(this.userId)
            }
        })
    }

    loadProfile(userId: string): void {
        this.authService.userProfile(userId).subscribe(
            (response: User) => {
                console.log(response);
                this.profileData = response
            }
        )
    }

}
