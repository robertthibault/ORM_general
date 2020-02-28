import { QueryFilterOrder } from '../models/model';
import Album from '../models/album';
// import User from 'models/user';
import Photo from '../models/photo';
import User from '../models/user';

async function run(): Promise<any> {
  /**
   * Fonction find
   */
  // const request = await Photo.find(
  //   {
  //     where: { albumId: 1 },
  //     page: 2,
  //     limit: 5,
  //     sort: 'id',
  //     order: QueryFilterOrder.Desc,
  //   },
  // );

  // ------------------------------------------------------------------------------------------------------

  /**
   * Fonction find by id d'un album
   */
  // const request = await Album.findById<Album>(1, { includes: ['user', 'photos'] });

  // ------------------------------------------------------------------------------------------------------

  /**
   * Fonction find by id d'un user
   */
  // const request = await User.findById(5);

  // ------------------------------------------------------------------------------------------------------

  /**
   * Fonction delete d'une photo
   */
  // const request = await Photo.deleteById(60);

  // ------------------------------------------------------------------------------------------------------

  /**
   * Fonction update by id d'une photo
   */
  const request = await Photo.updateById(1, {
    "albumId": "60",
    "title": "HEY OH!!!",
    "url": "https://via.placeholder.com/600/30b8ca",
    "thumbnailUrl": "https://via.placeholder.com/150/30b8ca"
  });

  // ------------------------------------------------------------------------------------------------------

  /**
   * Fonction create d'une photo
   */
  //   const request = await Album.create(
  //     {
  //       userId: 1,
  //       title: 'test',
  //     },
  //   ).catch(
  //     (err: any) => console.log(err),
  //   );
  //   console.log('album :', request);
  // }

  // .catch((error) => {
  //   console.log(error);
  // });
  console.log(request);
  // console.log(album.titleCap);
  debugger;
}

run().catch((err) => {
  console.error(err);
});
