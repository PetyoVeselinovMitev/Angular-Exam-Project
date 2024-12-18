import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../../types/users';
import { ApiService } from '../api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileData: User = {
    username: '',
    email: '',
    password: '',
  };
  currentUser$: Observable<any>;
  userId: string | null = null;
  isLoading = true;
  hasError = false;

  constructor(private authService: AuthService, private api: ApiService, private router: Router) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(userData => {
      this.userId = userData?._id || null;
      if (this.userId) {
        this.loadProfile(this.userId);
      } else {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  loadProfile(userId: string): void {
    this.authService.userProfile(userId).subscribe(
      (response: User) => {
        this.profileData = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading profile', error);
        this.isLoading = false;
        this.hasError = true;
      }
    );
  }

  onSubmit(bookId: string): void {
    this.api.returnBook(bookId).subscribe(() => {
      this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/profile']);
      });
    });
  }
}
