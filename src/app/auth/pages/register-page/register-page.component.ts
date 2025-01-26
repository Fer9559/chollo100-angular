import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
      ]
    ],
    fullName: ['', [Validators.required, Validators.minLength(6)]]
  });

  register() {
    const { email, password, fullName } = this.myForm.value;

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.authService.register(email, password, fullName)
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }


  isFieldInvalid(field: string): boolean {
    const control = this.myForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.myForm.get(field);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field === 'email' && control?.hasError('email')) {
      return 'Debe ingresar un correo válido';
    }
    if (field === 'password' && control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field === 'password' && control?.hasError('pattern')) {
      return 'Debe incluir mayúsculas, minúsculas y números';
    }
    if (field === 'fullName' && control?.hasError('minlength')) {
      return `El nombre debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
