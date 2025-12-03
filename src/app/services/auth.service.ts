import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  readonly user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    onAuthStateChanged(auth, (user) => {
      this.userSubject.next(user);
    });
  }

  get currentUser(): User | null {
    const value = this.userSubject.value;
    if (!value) {
      return null;
    }
    return value;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async logout() {
    await signOut(auth);
    await this.router.navigate(['/login']);
  }
}