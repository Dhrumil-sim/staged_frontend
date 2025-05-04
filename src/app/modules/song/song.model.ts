export interface Song {
  _id?: string;
  title: string;
  genre: string[]; // multiple genres
  album?: string;
  artist?: string;
  coverPicture?: string;
  filePath?: string;
  duration?: number;
  createdAt?: Date;
}
