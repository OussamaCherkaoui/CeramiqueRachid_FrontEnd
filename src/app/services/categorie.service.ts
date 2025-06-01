import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Categorie} from "../models/categorie";

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private baseUrl;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No auth token found');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8080/categorie';
  }

  public getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.baseUrl}/getAll`);
  }

  public save(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.baseUrl}/save`, categorie, { headers: this.getHeaders() });
  }

  public update(categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.baseUrl}/update`, categorie, { headers: this.getHeaders() });
  }

  public delete(id: number): Observable<Categorie> {
    return this.http.delete<Categorie>(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

}
