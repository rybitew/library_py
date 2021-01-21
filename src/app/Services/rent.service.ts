import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
// @ts-ignore
import {UserBooks} from '../models/UserBooks';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  API_URL;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.API_URL = baseUrl + 'api/rent/';
  }

  rentBook(bookId: number): Observable<any> {
    return this.http.put(this.API_URL + bookId, null, {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
  }

  returnBook(bookId: number): Observable<any> {
    return this.http.put(this.API_URL + 'return/' + bookId, null, {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
  }

  getUserBooks(): Observable<UserBooks> {
    return this.http.get(this.API_URL + 'books', {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
  }
}
