import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Promotion} from "../models/promotion";

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

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
  this.baseUrl = 'http://localhost:8080/promotion';
  }

  public getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.baseUrl}/getAll`);
  }

  public savePromotion(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.baseUrl}/save`, promotion,{ headers: this.getHeaders()});
  }

  public updatePromotion(promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.baseUrl}/update`, promotion,{ headers: this.getHeaders()});
  }

  public deletePromotion(id: number): Observable<Promotion> {
    return this.http.delete<Promotion>(`${this.baseUrl}/delete/${id}`,{ headers: this.getHeaders()});
  }

  public getPromotionsByProductName(name: string): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.baseUrl}/getAll/${name}`,{ headers: this.getHeaders()});
  }

  public countPromotionActive(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/countPromotionActive`,{ headers: this.getHeaders()});
  }

}
