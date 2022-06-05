import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePassword } from '../models/changePasswordData';
import { LoginData } from '../models/loginData';
import { Notif } from '../models/notif';
import { RegisterData } from '../models/registerData';
import { Result } from '../models/result';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  private readonly notifSubject: BehaviorSubject<Notif[]> = new BehaviorSubject<Notif[]>([]);
  public readonly notifObservable: Observable<any> = this.notifSubject.asObservable();

  public setNotif(notifData: Notif[]): void {
    this.notifSubject.next(notifData);
  }

  snackbarConfig = new MatSnackBarConfig();

  // Common snackbar to be used
  successSnackbar(message: string, action: string) {
    this.snackbarConfig.duration = 5000;
    this.snackbarConfig.panelClass = ['successSnackbar'] // global panel style
    this.snackBar.open(message, action, this.snackbarConfig);
  }

  failureSnackbar(message: string, action: string) {
    this.snackbarConfig.duration = 5000;
    this.snackbarConfig.panelClass = ['failureSnackbar']; // global panel style
    this.snackBar.open(message, action, this.snackbarConfig);
  }

  registerUser(data: RegisterData): Observable<Result> {
    return this.http.post<Result>(`${environment.baseUrl}/users/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(data: LoginData): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/users/login`, data).pipe(
      catchError(this.handleError)
    );
  }

  getUserData(): Observable<User> {
    let userToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    });

    return this.http.get<User>(`${environment.baseUrl}/users/me`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(data: ChangePassword): Observable<Result> {
    let userToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    });
    return this.http.put<Result>(`${environment.baseUrl}/users/changePassword`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllAdmins(): Observable<User[]> {
    let userToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    });
    return this.http.get<User[]>(`${environment.baseUrl}/users/getAllAdmins`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUserNotifs(): Observable<Notif[]> {
    let userToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    });
    return this.http.get<Notif[]>(`${environment.baseUrl}/users/getUserNotifs`, { headers });
  }

  markAsRead(notifId: string): Observable<Result> {
    let data = {
      notifId: notifId
    };
    let userToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    });
    return this.http.put<Result>(`${environment.baseUrl}/users/markAsRead`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(() => err);
  }
}
