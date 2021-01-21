import {Component, OnInit} from '@angular/core';
import {RentService} from '../../Services/rent.service';
import {BookDto} from '../../models/BookDto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  dueBookAmount = 0;

  constructor(private rentService: RentService) {
  }

  ngOnInit() {
    if (localStorage.getItem('jwt')) {
      this.isLoggedIn = true;
      if (localStorage.getItem('role') === 'USER') {
        this.rentService.getUserBooks().subscribe(resp => {
          this.dueBookAmount = resp.dueBooks.length;
        });
      }
    }
  }
}
