import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Admin} from "../models/admin";
import {BehaviorSubject, map, Observable} from "rxjs";
import {AuthenticationRequest} from "../models/authentication-request";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl ;

  private idUser = new BehaviorSubject<number>(0);

  public getIdUser(): Observable<number> {
    return this.idUser.asObservable();
  }

  public setIdUser(id:number) {
    this.idUser.next(id);
  }

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('jwt'));

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public loginActive() {
    this.loggedIn.next(true);
  }

  public logout() {
    localStorage.removeItem('jwt');
    this.loggedIn.next(false);
  }

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
    this.baseUrl = 'http://localhost:8080/admin';
  }

  public registerAdmin(admin: Admin): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, admin, { headers: this.getHeaders() });
  }

  public deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  public getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.baseUrl}/getAllAdmin`, { headers: this.getHeaders() });
  }

  public login(authRequest: AuthenticationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, authRequest).pipe(
      map(response => {
        console.log(response);
        return response;
      })
    );
  }


  public getAdminByIdUser(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.baseUrl}/getAdminByIdUser/${id}`);
  }

  public countRegistredAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/countRegistredAdmin`, { headers: this.getHeaders() });
  }

  public findIdByUsername(username: String) {
    return this.http.get<any>(`${this.baseUrl}/getIdByUserName/${username}`, { headers: this.getHeaders() });
  }


}
