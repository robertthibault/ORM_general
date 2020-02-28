import { Model } from './model';

class Photo extends Model {
  id!: number | string;

  albumId!: string | number;

  static config = {
    endpoint: 'photos',
  };
}

export default Photo;
