import {Component, OnInit} from '@angular/core';
import {BookDto} from '../../models/BookDto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor() {
  }

  ngOnInit() {
  }
}
