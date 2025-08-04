import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7034/api';
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Account/GetAllUsers`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Account/GetById/${id}`);
  }

  create(item: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Account/Register`, item);
  }

  update(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Account/Update/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Account/Delete/${id}`);
  }

  setPassword(data: {password: string, confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Account/setpass`, data , {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  login(data: {email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Account/login`, data);
  }

}
