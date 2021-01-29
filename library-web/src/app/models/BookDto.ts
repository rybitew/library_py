import {LibraryLocationDto} from './LibraryLocationDto';

export interface BookDto {
  id: number;
  title: string;
  genre: string;
  authors: string[];
  published: Date;
  library?: LibraryLocationDto;
}
