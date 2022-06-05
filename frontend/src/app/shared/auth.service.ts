import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  isLoginSubject = new BehaviorSubject(localStorage.getItem('token') !== null);

  storeUserData(token: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
    this.isLoginSubject.next(true);
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token') !== null) {
      this.isLoginSubject.next(true);
      return true;
    } else {
      this.isLoginSubject.next(false);
      return false;
    }
  }

  isUserAdmin(): boolean {
    let value = localStorage.getItem('isAdmin');
    return Boolean(JSON.parse(value as string));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.clear();
    this.isLoginSubject.next(false);
    this.router.navigate(['common/login']);
  }
}
