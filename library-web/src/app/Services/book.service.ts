import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BookDto} from '../models/BookDto';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  API_URL;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.API_URL = baseUrl + '/api/book';
  }

  findBook(id: number): Observable<BookDto[]> {
    return this.http.get<BookDto[]>(this.API_URL + '?id=' + id);
  }

  findBooks(title?: string, author?: string): Observable<BookDto[]> {
    let params: HttpParams = new HttpParams();
    if (!!title) {
      params = params.append('title', title);
    }
    if (!!author) {
      params = params.append('author', author.toString());
    }
    console.log('findBooks() params=', params);
    return this.http.get<BookDto[]>(this.API_URL, {params});
  }

  addBook(book: BookDto): Observable<any> {
    console.log('BOOK SERVICE -> addBook(): book', book);
    return this.http.post(this.API_URL + '/manage', book, {headers: {Authorization: 'JWT ' + localStorage.getItem('jwt')}});
  }

  updateBook(id: number, book: BookDto): Observable<any> {
    console.log('BOOK SERVICE -> addBook(): book', book);
    return this.http.put(this.API_URL + '/manage', book, {headers: {Authorization: 'JWT ' + localStorage.getItem('jwt')}});
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(this.API_URL + '/manage' + id, {headers: {Authorization: 'JWT ' + localStorage.getItem('jwt')}});
  }
}
