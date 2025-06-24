import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Message} from "../models/message";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

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
    this.baseUrl = 'http://localhost:8080/message';
  }

  public saveMessage(message: Message): Observable<Message> {
    console.log(message);
    return this.http.post<Message>(`${this.baseUrl}/save`, message);
  }

  public updateMessageReply(idMessage: number, idAdmin: number): Observable<Message> {
    return this.http.put<Message>(`${this.baseUrl}/update/${idMessage}/${idAdmin}`, {}, { headers: this.getHeaders() });
  }

  public deleteMessage(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  public getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/getAll`, { headers: this.getHeaders() });
  }

  public getAllMessagesByDate(date: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/getAllMessageByDate/${date}`,{ headers: this.getHeaders()});
  }

  public getAllMessagesReply(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/getAllMessageReply`,{ headers: this.getHeaders()});
  }

  public getAllMessagesNotReply(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/getAllMessageNotReply`,{ headers: this.getHeaders()});
  }

  public countMessagesNotReply(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/countMessage`,{ headers: this.getHeaders()});
  }

}
