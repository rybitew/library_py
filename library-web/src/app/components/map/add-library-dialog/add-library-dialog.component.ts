import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../../Services/map.service';
import {LibraryLocationDto} from '../../../models/LibraryLocationDto';

@Component({
  selector: 'app-add-library-dialog',
  templateUrl: './add-library-dialog.component.html',
  styleUrls: ['./add-library-dialog.component.css']
})
export class AddLibraryDialogComponent {

  address: string;
  displayedAddress: string;

  constructor(
    public dialogRef: MatDialogRef<AddLibraryDialogComponent>,
    private _snackBar: MatSnackBar,
    private mapService: MapService) {
  }

  isDisabled(): boolean {
    return !(this.address && this.displayedAddress);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save() {
    this.mapService.getCoordinatesFromAddress(this.address).subscribe(response => {
      if (response.length > 0) {
        const result: LibraryLocationDto = {
          latitude: response[0].lat, longitude: response[0].lon,
          name: response[0].display_name, placeId: response[0].place_id,
          displayedAddress: this.displayedAddress
        };
        return this.mapService.addLibraryLocation(result).subscribe(() => {
          this.toast({error: 'Library added.'});
          this.onCancel();
        }, error => this.toast(error));
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
