import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ApiService {
  cache: {[url: string]: {
    time: Date,
    data: any,
  }} = {};
  constructor(
    private http: HttpClient,
  ) { 
    
  }

  idQuery(id:string, postal:string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post('/api/query', {id:id, postal:postal}, httpOptions) as Observable<any>;
  }

  sendRSVP(id: number, rsvps: number, transport: number, note: string, email: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post('/api/rsvp', {id:id, rsvps:rsvps, transport:transport, note:note, email:email}, httpOptions) as Observable<any>;
  }
}