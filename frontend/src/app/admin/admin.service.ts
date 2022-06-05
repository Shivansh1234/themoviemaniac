import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllUsers(page: number, limit: number, sortActive: string, sortDirection: SortDirection, search: string): Observable<any> {
    let adminToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminToken
    });

    console.log('getall users is getting called');

    return this.http.get<any>(`${environment.baseUrl}/admin/getUsers?page=${page}&limit=${limit}&sort=${sortActive}&order=${sortDirection}&search=${search}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(_id: string): Observable<Result> {
    let adminToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminToken
    });
    return this.http.delete<Result>(`${environment.baseUrl}/admin/deleteUser?id=${_id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  makeAdmin(id: string): Observable<Result> {
    const data = {
      id: id
    }
    let adminToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminToken
    });
    return this.http.put<Result>(`${environment.baseUrl}/admin/makeAdmin`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  removeAdmin(id: string): Observable<Result> {
    const data = {
      id: id
    }
    let adminToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminToken
    });
    return this.http.put<Result>(`${environment.baseUrl}/admin/removeAdmin`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    return throwError(() => err);
  }
}
