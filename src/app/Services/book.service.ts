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
    this.API_URL = baseUrl + 'api/Book/';
  }

  findBook(id: number): Observable<BookDto> {
    return this.http.get<BookDto>(this.API_URL + '/' + id, {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
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
    return this.http.get<BookDto[]>(this.API_URL + 'find', {params: params});
  }

  addBook(book: BookDto): Observable<any> {
    return this.http.post(this.API_URL + 'add', {
      title: book.title,
      authors: book.authors,
      status: book.status,
      releaseDate: book.releaseDate
    }, {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
  }

  updateBook(id: number, book: BookDto): Observable<any> {
    return this.http.put(this.API_URL + 'update/' + id, book, {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(this.API_URL + 'delete/' + id, {headers: {Authorization: 'Bearer ' + localStorage.getItem('jwt')}});
  }
}
