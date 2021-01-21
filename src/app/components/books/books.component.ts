import {Component, OnInit} from '@angular/core';
import {BookService} from '../../Services/book.service';
import {BookDto} from '../../models/BookDto';
import {MatDialog} from '@angular/material/dialog';
import {BookDialogComponent} from './book-dialog/book-dialog.component';
import {RentService} from '../../Services/rent.service';
import {AccountService} from '../../Services/account.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface BookDialogData {
  book: BookDto;
  action: string;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  displayedColumns: string[] = ['title', 'authors', 'release date', 'status', 'actions'];
  dataSource: BookDto[] = [];
  author: string;
  title: string;
  role: string;

  constructor(private bookService: BookService, private rentService: RentService, public dialog: MatDialog,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
  }

  search() {
    if (this.title || this.author) {
      console.log(this.title, this.author);
      this.bookService.findBooks(this.title, this.author)
        .subscribe(response => this.dataSource = response,
          error => this.toast(error.error)
        );
    }
  }

  rent(bookId: number) {
    this.rentService.rentBook(bookId).subscribe(resp => this.search(), error => this.toast(error.error));
  }

  add() {
    const newBook: BookDto = {id: null, status: 1, authors: [], releaseDate: new Date(), title: ''};
    this.openDialog(newBook, 'add');
  }

  edit(book: BookDto) {
    console.log('EDIT');
    this.openDialog(book, 'edit');
  }

  delete(book: BookDto) {
    console.log('DELETE');
    this.openDialog(book, 'delete');
  }

  openDialog(book: BookDto, action: string): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '350px',
      data: {book: book, action: action}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.search();
    });
  }

  toast(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
