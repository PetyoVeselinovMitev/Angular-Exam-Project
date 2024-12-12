import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (contorl: AbstractControl): ValidationErrors | null => {
    const password = contorl.get('password');
    const rePass = contorl.get('rePass')

    return password && rePass && password.value !== rePass.value ? { passwordMismatch: true } : null;
}