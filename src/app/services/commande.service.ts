import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Commande} from "../models/commande";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

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
    this.baseUrl = 'http://localhost:8080/commande';
  }

  public getAll(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/getAll`, { headers: this.getHeaders() });
  }

  public save(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.baseUrl}/save`, commande, { headers: this.getHeaders() });
  }

  public update(commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.baseUrl}/update`, commande, { headers: this.getHeaders() });
  }

  public delete(id: number): Observable<Commande> {
    return this.http.delete<Commande>(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  public countOrderDay(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/countOrderDay`, { headers: this.getHeaders() });
  }

  public getById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.baseUrl}/getById/${id}`, { headers: this.getHeaders() });
  }

  public getAllByDate(date: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/getAllByDate/${date}`, { headers: this.getHeaders() });
  }

  public getAllByStatut(statut: boolean): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/getAllByStatut/${statut}`, { headers: this.getHeaders() });
  }
}
