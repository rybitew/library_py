import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {BookService} from '../../../Services/book.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../../Services/map.service';
import {noop} from 'rxjs';
import {LibraryLocationDto} from '../../../models/LibraryLocationDto';

@Component({
  selector: 'app-add-library-dialog',
  templateUrl: './add-library-dialog.component.html',
  styleUrls: ['./add-library-dialog.component.css']
})
export class AddLibraryDialogComponent {

  authors: string;
  address: string;
  isValid: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddLibraryDialogComponent>,
    private _snackBar: MatSnackBar,
    private mapService: MapService) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    this.mapService.getCoordinatesFromAddress(this.address).subscribe(response => {
      if (response.length > 0) {
        this.isValid = true;
        const result = {lat: response[0].lat, lon: response[0].lon, name: response[0].display_name, placeId: response[0].place_id};
        return this.mapService.addLibraryLocation(result).subscribe(this.onCancel, error => this.toast(error));
      }
      this.toast('Could not find given address');
    }, error => this.toast(error));
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
