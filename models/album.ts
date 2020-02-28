import { Model, RelationType } from './model';
import User from './user';
import Photo from './photo';

class Album extends Model {
  static config = {
    endpoint: 'albums',
    relations: {
      user: {
        type: RelationType.BelongsTo,
        model: User,
        foreignKey: 'userId',
      },
      photos: {
        type: RelationType.HasMany,
        model: Photo,
        foreignKey: 'albumId',
      },
    },
  };

  userId!: number | string;

  title!: string;

  id!: number | string;

  get titleCap(): string {
    return this.title.toUpperCase();
  }
}

export default Album;
