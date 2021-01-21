import {Component, OnInit} from '@angular/core';
import {BookDto} from '../../models/BookDto';
import {RentService} from '../../Services/rent.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.css']
})
export class MyBooksComponent implements OnInit {
  isLoggedIn = false;
  dueBooks: BookDto[] = [];
  rentedBooks: BookDto[] = [];
  returnedBooks: BookDto[] = [];
  displayedColumns: string[] = ['title', 'authors', 'release date', 'renting date', 'return date', 'actions'];
  displayedColumnsHist: string[] = ['title', 'authors', 'release date', 'renting date', 'return date'];

  constructor(private rentService: RentService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (localStorage.getItem('jwt')) {
      this.isLoggedIn = true;
      if (localStorage.getItem('role') === 'USER') {
        this.getBooks();
      }
    }
  }

  getBooks() {
    this.rentService.getUserBooks().subscribe(resp => {
      this.dueBooks = resp.dueBooks;
      this.rentedBooks = resp.rentedBooks;
      this.returnedBooks = resp.returnedBooks;
    });
  }

  returnBook(bookId: number) {
    this.rentService.returnBook(bookId).subscribe(resp => this.getBooks(), error => this.toast(error.error));
  }

  toast(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
