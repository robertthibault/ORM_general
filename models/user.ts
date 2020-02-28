import { Model } from './model';

class User extends Model {
  static config = {
    endpoint: 'users',
  };
}

export default User;
