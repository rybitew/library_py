import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginDto} from '../models/LoginDto';
// @ts-ignore
import {RegisterDto} from '../models/RegisterDto';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  API_URL;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.API_URL = baseUrl + 'api/account/';
  }

  register(user: RegisterDto): Observable<any> {
    return this.http.post(this.API_URL + 'register', user);
  }
  login(user: LoginDto): Observable<any> {
    return this.http.post(this.API_URL + 'login', user);
  }
}
