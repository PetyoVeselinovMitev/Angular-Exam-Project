import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup
    currentUser$: Observable<any>
    role: string | null = null
    errorMsg: string | null = null;

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            rePass: ['', [Validators.required]]
        }, {validators: passwordMatchValidator})

        this.currentUser$ = this.authService.currentUser;
    }

    ngOnInit(): void {
        this.currentUser$.subscribe(userData => {
            this.role = userData?.role || null;
        })
    }

    onSubmit() {
        if (this.role === 'admin' && this.registerForm.valid) {
            this.authService.registerAdmin(this.registerForm.value)
        } else if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.errorMsg = null;
                },
                error: (error) => {
                    this.errorMsg = error
                }
            })
        }
    }
}
