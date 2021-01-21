import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BookDialogData} from '../books.component';
import {BookService} from '../../../Services/book.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.css']
})
export class BookDialogComponent {

  authors: string;

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookDialogData,
    private _snackBar: MatSnackBar,
    private bookService: BookService) {
    this.authors = data.book.authors.join(', ');
  }

  getTitle(): string {
    if (this.data.action === 'add') {
      return 'ADD';
    } else if (this.data.action === 'edit') {
      return 'EDIT';
    } else if (this.data.action === 'delete') {
      return 'DELETE';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.data.book.authors = this.authors.split(', ').map(a => a.trim());
    if (this.data.action === 'add') {
      this.addBook();
    } else if (this.data.action === 'edit') {
      this.updateBook();
    }
  }

  delete(): void {
    this.bookService.deleteBook(this.data.book.id).subscribe(() => this.dialogRef.close(), error => {
      this.toast(error.error);
      this.dialogRef.close();
    });
  }

  updateBook() {
    this.bookService.updateBook(this.data.book.id, this.data.book).subscribe(() => {
        console.log(this.data.book);
        this.dialogRef.close();
      },
      error => {
        this.toast(error.error);
        this.dialogRef.close();
      });
  }

  addBook() {
    this.bookService.addBook(this.data.book).subscribe(() => {
        console.log(this.data.book);
        this.dialogRef.close();
      },
      error => {
        this.toast(error.error);
        this.dialogRef.close();
      });
  }

  toast(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
