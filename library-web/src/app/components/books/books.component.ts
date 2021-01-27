import {Component, OnInit} from '@angular/core';
import {BookService} from '../../Services/book.service';
import {BookDto} from '../../models/BookDto';
import {MatDialog} from '@angular/material/dialog';
import {BookDialogComponent} from './book-dialog/book-dialog.component';
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

  displayedColumns: string[] = ['id', 'title', 'authors', 'release date', 'status'];
  dataSource: BookDto[] = [];
  author: string;
  title: string;
  authenticated: boolean;

  constructor(private bookService: BookService, public dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.authenticated = !!localStorage.getItem('jwt');
    if (this.authenticated) {
      this.displayedColumns.push('actions');
    }
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

  add() {
    const newBook: BookDto = {id: null, genre: '', authors: [], published: new Date(), title: ''};
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
      data: {book, action}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.search();
    });
  }

  toast(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
