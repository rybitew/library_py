import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BookDialogData} from '../books.component';
import {BookService} from '../../../Services/book.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../../Services/map.service';
import {LibraryLocationDto} from '../../../models/LibraryLocationDto';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.css']
})
export class BookDialogComponent implements OnInit {

  authors: string;
  options: LibraryLocationDto[];


  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookDialogData,
    private _snackBar: MatSnackBar,
    private mapService: MapService,
    private bookService: BookService) {
    this.authors = data.book.authors.join(', ');
  }

  ngOnInit(): void {
    this.mapService.getAllLibraryLocations()
      .subscribe(response => this.options = response,
        error => this.toast(error));
  }

  isDisabled(): boolean {
    return !(this.data.book.title && this.data.book.published && this.data.book.genre && this.data.book.library && this.authors);
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
      this.toast(error);
      this.dialogRef.close();
    });
  }

  updateBook() {
    this.bookService.updateBook(this.data.book.id, this.data.book).subscribe(() => {
        console.log(this.data.book);
        this.dialogRef.close();
      },
      error => {
        this.toast(error);
        this.dialogRef.close();
      });
  }

  addBook() {
    // this.data.book.library = this.selected;
    this.bookService.addBook(this.data.book).subscribe(() => {
        console.log(this.data.book);
        this.dialogRef.close();
      },
      error => {
        this.toast(error);
        this.dialogRef.close();
      });
  }

  toast(error) {
    if (error.status === 401) {
      error.error = 'Unauthorized, log in to proceed';
    }
    this._snackBar.open(error.error, 'OK', {
      duration: 2000,
    });
  }
}
