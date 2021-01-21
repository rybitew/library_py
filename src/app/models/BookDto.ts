export interface BookDto {
  id: number;
  title: string;
  authors: string[];
  status: RentingStatus;
  releaseDate: Date;
}

export enum RentingStatus {
  RENTED,
  AVAILABLE
}
