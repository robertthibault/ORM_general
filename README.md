# TP - WIK-JS-302 - Introduction au Typescript (orienté WebService)

## Objectifs

### Sujet

Concevoir un ORM qui permet de communiquer avec le service externe https://jsonplaceholder.typicode.com

Cet ORM sera réalisé en TypeScript et typé au maximum.



### Compétences à acquérir

* Je sais communiquer avec une API externe

* Je sais restituer et aggréger des données de différentes sources

* Je sais écrire du code propre et corrigé par un linter

* Je sais utiliser le débuggeur de mon IDE

* Je sais typer mes variables et fonctions avec TypeScript

* Je sais utiliser les interfaces et enums avec TypeScript

* Je sais créér des générics avec TypeScript

* Je suis capable de concevoir un ORM qui me permet de communiquer avec un service externe ou micro-service

  

### Correction

Ce TP donnera lieu a une première note individuelle sur la majeure WebService. Cette note sera compléter par la note de projet de groupe.



### Durée

4 à 12h

### Rendu

Un lien de rendu sera partagé et épinglé sur le Slack.

Le rendu est individuel, et tout code identique sera fortement sanctionné. Il est OK de s'inspirer ou de demander des astuces, mais je ne cautionne pas le plagiat.

### Correction

Votre projet sera évaluer par un système de test automatisé, il est donc bien important de respecter la nomenclature que je donne. Tout ce qui est en dehors de la nomenclature est libre.

Une seconde passe de correction manuelle sera faite en ce qui concerne :

* La qualité du code
* La propreté
* L'originalité de la solution
* Si les différentes compétences à acquérir le sont



## Consigne

### Étapes

Implémentez un certain nombre de méthodes sur chaque model afin de pouvoir requêter facilement, à la manière d'un ORM, l'API json-placeholder.

Pour ce faire, je vous conseille de faire les choses dans un ordre :

1. Implémentez une première méthode sur un model : Album par exemple, de la manière la plus simple possible
2. Rendez cette méthode plus générique, et placez là dans une classe parente qui sera héritée par tous les models
3. Implémentez toutes les fonctions de manière simple (sans prendre en compte les options et arguments ou interfaces)
4. Écrivez la logique qui permet de gérer les filtre, les includes, etc... en sommes de façon à coller au reste du squelette proposé çi-dessous.

### Model

#### À implémenter

Vous devez implémenter à minima les models suivants :

* Album
* User
* Photo

#### Signature des méthodes

Voici les signatures que devront implémenter vos models

```typescript
import { NonFunctionKeys } from 'utility-types';
​
type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>
​
enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}
​
interface QueryFilter {
  where?: Record<string, any>
  limit?: number,
  page?: number,
  sort?: string,
  order?: QueryFilterOrder,
}
​
interface FindByIdOptions {
  includes: string[],
}
​
type ModelIdType = number | string;
​
enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}
​
/**
 * Define the configuration of a relation
 */
interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType,
​
  /** The target Model */
  model: any, // je vous donnerai une autre astuce plus tard pour faire marche `typeof Model`
​
  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string,
}
​
interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string,
​
  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>,
}
​
declare abstract class Model {
  protected static config: ModelConfig;
​
  id: string | number;
​
  constructor(data: SchemaOf<T>);

  static create<T extends Model>(dataOrModel: SchemaOf<T> | T): Promise<T>;
  
  static find<T extends Model>(filter?: QueryFilter): Promise<T[]>;
  
  static findById<T extends Model>(id: ModelIdType, options?: FindByIdOptions): Promise<T>;
  
  static updateById<T extends Model>(model: T): Promise<T>;
  static updateById<T extends Model>(id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T>;
​
  static deleteById(id: ModelIdType): Promise<boolean>;
​
  /**
   * Push changes that has occured on the instance
   */
  save<T extends Model>(): Promise<T>;
​
  /**
   * Push given changes, and update the instance
   */
  update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T>;
​
  /**
   * Remove the remote data
   */
  remove(): Promise<void>;
}
```

### Filtres et options

Pour aller plus loin, certaines fonctions ci-dessus possèdent des arguments supplémentaires.

#### Méthode `find()`

##### Argument `filter`

Permet de filtrer, trier, ou limiter les résultats.

### Méthode findById()

##### Argument `options.include`

Ce tableau de string permet de définir si on veut inclure des modèles liés dans la réponse finale.

Par exemple :

```typescript
const album = await Album.findById(1, { include: ['user', 'photos'] })
console.log(album)

// Retournera :
/*
{
    "id": 1,
    "title": 'quidfelkfjskdjf',
    "user": {
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {...},
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {...}
    },
    photos: [
      {
        "id": 1,
      }
      ...
    ]
}
*/
```

Pour ce faire vous aurez besoin de définir le mapping des relations dans la propriété static de chaque model : `config.relations`

Encore mieux : il est recommandé de conserver des instances, ainsi à terme il serait possible de faire :

```typescript
const album = await Album.findById(1, { include: ['user'] })
album.user.username = 'Toto'
await album.user.save() // Mettra le user à jour
```



### Structure

#### Indispensable

Bien entendu, un `.gitignore`, ainsi qu'un `package.json` sont indispensables.

Il me faudra également une configuration ESLint qui valide votre code.

#### Variables d'environnement

Votre application doit également utiliser une variable d'environnement : `API_BASE_URL`

Ainsi pour utiliser l'api typicode (pas de slash final), je dois pouvoir faire :

```
export API_BASE_URL=https://jsonplaceholder.typicode.com
ts-node main.tss
```

### Configuration Typescript

#### Mode Strict

Le tsconfig doit être configuré sur le mode `strict`, et le type de module doit être `commonjs`.

## Guidelines et astuces

### Serveur en local

Vous pouvez installer `json-server` et le démarrer en local, cf. la doc, mais cela vous permettra d'avoir une API identique en tout point à celle de jsonplaceholder, en local, qu'il est possible de modifier (notamment pour les opération destructives.

### Astuces TypeScript

#### Comment récupérer une variable statique exposée par des classes enfants

##### Depuis une méthode statique (méthode de classe)

Rien de compliqué, la variable est statique, et dans une méthode statique, `this` représente la classe, ainsi :

```typescript
class Parent {
  static test: string;
  
  static showTestStatic() {
    console.log(this.test)
  }
}

class Child extends Parent {
  static test = 'toto'
}

Child.showTestStatic()
```

##### Depuis une méthode d'instance

C'est un peu plus compliqué, dans une méthode d'instance, le `this` représente l'instance elle même, et l'instance n'a pas connaissance des variables de classe. Le seul moyen d'y accéder est donc de faire `Child.test`, sauf que `Child` peut être variable.

Une autre façon astucieuse, qui justifie ici l'emploi du mot clé `as`. En JavaScript, une classe est une simple fonction qui possède un prototype. Lorsqu'on écrit sous forme de classe, cette fonction est en fait le `constructor `. Ainsi, en javascript,  la variable constructeur est la classe elle même. Toutes les instances ont également accès à cette fonction `constructor` qui est une propriété non-énumérée et immutable.

Donc, `this.constructor` correspond à la classe, ici : `Child`, on a désormais un accès à la classe et donc aux variables de classes : `this.constructor.test`. Pour en simplifier l'accès et acquérir le typing, on peut faire un getter :

```typescript
class Parent {
  static test: string;
  
  showTest() {
    console.log(this.modelClass.test)
  }
  
  get modelClass(): typeof Model {
    return this.constructor as typeof Model // <= utilisation de `as`, car le constuctor est une simple Function pour TS
  }
}

class Child extends Parent {
  static test = 'toto'
}

const child = new Child()
child.showTest()
```



#### Generics et surcharger du this

##### Problématique

Un des problèmes auquel vous allez être confronté, est le fait d'instancier depuis une méthode statique, sans forcément connaitre le model de destination (les joies de l'héritage).

Exemple de la problématiquue :

```typescript
abstract class Vehicule {
  static findVehicule(firstArgument) { // <= Erreu: Pas de type de retour 
  	return new this({ test: firstArgument }); // <= Impossible car Vehicule est abstract
  }
}

class Voiture extends Vehicule {
  
}

const car = Voiture.findVehicule('le test');
```

##### Generics pour des types de retour dynamique

Le premier soucis est qu'on ne déclare pas de type de retour à `findVehicule`, en effet on s'attend à obtenir une voiture, une moto ou autre et cela dépend de l'instance.

Grâce aux generics, on peut fabriquer des "variables" de types :

```typescript
interface VehiculeClass<T extends Vehicule> {
  new(data: { test: string }): T;
}

abstract class Vehicule {
  static findVehicule<T extends Vehicule>(firstArgument: string): T {
    return new this({ test: firstArgument }); // <=== Impossible car Vehicule est abstract
  }
}

class Voiture extends Vehicule {

}

const car = Voiture.findVehicule<Voiture>('le test'); // <= Ici on doit passer explicitement la valeur à notre Generic (variable de type)
```

`<T extends Vehicule` permet de dire que la variable de type attendue ici devrait être quelque chose qui hérite de Vehicule.

Il est aussi possible de passer une valeur par défaut au générics : `<T = any>`

#### La surcharge de this

Notre second problème est le `new this()`, on essai d'instancier sans connaitre la classe, car la classe actuelle est abstraite.

Pour solutionner ce problème, il suffit de dire à TypeScript que le type de this doit posséder une certaine signature. Il suffit donc d'indiquer le type de `this`, juste avant le premier argument de la fonction :

```typescript
interface VehiculeClass<T extends Vehicule> {
  new(data: { test: string }): T;
}

abstract class Vehicule {
  static findVehicule<T extends Vehicule>(
    this: VehiculeClass<T>,
    firstArgument: string,
  ): T {
    return new this({ test: firstArgument });
  }
}

class Voiture extends Vehicule {

}

const car = Voiture.findVehicule('le test'); // <= Comme Typescript sait que T est dépendant du type de this, donc de l'instance, plus besoin de faire findVehicule<Voiture>, c'est implicite !!
```

Gold !



## Pour aller plus loin

### Utilisez les décorateurs

#### État actuel

À cette étape, vous devriez avoir une définition de model qui ressemble à cela :

```typescript
export default class Album extends Model {
  protected static config = {
    path: '/albums',
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

  public id!: number;

  public title!: string;

  public userId!: number;

  public readonly user?: User;

  public readonly photos?: Photo[];

  get titleCap() {
    return this.title.toUpperCase();
  }
}
```



#### Avec les décorateurs

Les décorateurs vont nous faciliter l'iimplémentation des albums :

```typescript

@Entity({ endpoint: '/albums' })
export default class Album extends Model {
  @Property()
  id!: number;

  @Property()
  title!: string;

  @Property()
  userId!: number;

  @BelongsTo(User, 'userId') // ou @BelongsTo(User) en déduisant userId
  readonly user?: User;

  @HasMany(Photo, 'albumId')
  readonly photos?: Photo[];

  get titleCap() {
    return this.title.toUpperCase();
  }
}
```

Joli, non ?

Il est ensuite possible de pouvoir spécifier des options aux propriétés, par exemple : valeurs par défaut, validations, etc...
