import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;

  error = '';
  isRegisterMode = false;
  private returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    const q = route.snapshot.queryParamMap.get('returnUrl');
    if (q) {
      this.returnUrl = q;
    }

    this.authService.user$
      .pipe(
        filter((user) => user !== undefined),
        take(1)
      )
      .subscribe((user) => {
        if (user) {
          this.router.navigateByUrl('/dashboard');
        }
      });
  }

  async submit() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    try {
      if (this.isRegisterMode) {
        await this.authService.register(email!, password!);
      } else {
        await this.authService.login(email!, password!);
      }

      await this.router.navigateByUrl(this.returnUrl);
    } catch (err: any) {
      this.error = this.mapFirebaseError(err);
    }
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
  }

  private mapFirebaseError(error: any): string {
    const code = error?.code ?? '';

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email ou mot de passe incorrect.';
      case 'auth/weak-password':
        return 'Mot de passe trop faible (min. 6 caractères).';
      case 'auth/email-already-in-use':
        return 'Un compte existe déjà avec cet email.';
      default:
        return "Une erreur d'authentification est survenue.";
    }
  }
}