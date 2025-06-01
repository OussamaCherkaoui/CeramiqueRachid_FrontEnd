import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommandeProduit} from "../models/commande-produit";
import {Commande} from "../models/commande";

@Injectable({
  providedIn: 'root'
})
export class CommandeProduitService {

  private baseUrl ;

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
    this.baseUrl = 'http://localhost:8080/commandeProduit';
  }

  public getAllByCommandeId(commandeId: number): Observable<CommandeProduit[]> {
    return this.http.get<CommandeProduit[]>(`${this.baseUrl}/getAll/${commandeId}`, { headers: this.getHeaders() });
  }

  public saveCommandeProduit(commandeProduit: CommandeProduit): Observable<CommandeProduit> {
    return this.http.post<CommandeProduit>(`${this.baseUrl}/save`, commandeProduit, { headers: this.getHeaders() });
  }

  public updateCommandeProduit(commandeProduit: CommandeProduit): Observable<CommandeProduit> {
    return this.http.put<CommandeProduit>(`${this.baseUrl}/update`, commandeProduit, { headers: this.getHeaders() });
  }

  public deleteCommandeProduit(id: number): Observable<CommandeProduit> {
    return this.http.delete<CommandeProduit>(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  public deleteAllByCommandeId(commandeId: number): Observable<Commande> {
    return this.http.delete<Commande>(`${this.baseUrl}/deleteAllByCommandeId/${commandeId}`, { headers: this.getHeaders() });
  }

}
