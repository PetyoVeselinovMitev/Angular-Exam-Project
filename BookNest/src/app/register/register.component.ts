import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm: FormGroup

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            rePass: ['', [Validators.required]]
        }, {validators: passwordMatchValidator})
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value)
        }
    }
}
