import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Produit} from "../models/produit";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

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
    this.baseUrl= 'http://localhost:8080/produit';
  }


  public getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/getAll`);
  }


  public getProduitsByCategorieId(id: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/getAllByCategorieId/${id}`);
  }


  public getProduitsByCategorieName(name: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/getAllByCategorieName/${name}`);
  }

  public getProduitsByName(name: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/getAllByName/${name}`);
  }

  public saveProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.baseUrl}/save`, produit,{ headers: this.getHeaders()});
  }


  public updateProduit(produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.baseUrl}/update`, produit,{ headers: this.getHeaders()});
  }


  public deleteProduit(id: number): Observable<Produit> {
    return this.http.delete<Produit>(`${this.baseUrl}/delete/${id}`,{ headers: this.getHeaders()});
  }

  public getProduitsNearingTheEnd(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/getAllProductNearingTheEnd`,{ headers: this.getHeaders()});
  }

}
