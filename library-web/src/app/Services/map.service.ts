import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LibraryLocationDto} from '../models/LibraryLocationDto';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  URL = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q=';

  constructor(private http: HttpClient, @Inject('BASE_URL') private readonly API_URL: string) {
    this.API_URL += '/api/location';
  }

  getCoordinatesFromAddress(address: string) {
    return this.http.get<any[]>(this.URL + address);
  }

  addLibraryLocation(locationData: LibraryLocationDto) {
    return this.http.post(this.API_URL, locationData, {headers: {Authorization: 'JWT ' + localStorage.getItem('jwt')}});
  }

  getAllLibraryLocations() {
    return this.http.get<LibraryLocationDto[]>(this.API_URL + '/all');
  }
}
