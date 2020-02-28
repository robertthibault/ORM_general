import { NonFunctionKeys } from 'utility-types';
import { json, Response } from 'express';
import fetch from 'node-fetch';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

export enum QueryFilterOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: string;
  order?: QueryFilterOrder;
}

interface FindByIdOptions {
  includes: string[];
}

type ModelIdType = number | string;

export enum RelationType {
  BelongsTo = 'belongsTo',
  HasMany = 'hasMany',
}

/**
 * Define the configuration of a relation
 */
interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  // model: typeof Model;
  model: any;

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}

interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string;

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>;
}

export abstract class Model {
  protected static config: ModelConfig;

  static id: string | number;

  // data: any;

  constructor(data: Record<string, any>) {
    Object.assign(this, data);
  }

  static async create<T extends Model>(
    this: {
      new(data: Record<string, any>): T; config: ModelConfig;
    }, dataOrModel: Omit<SchemaOf<T>, 'id'> | T,
  ): Promise<T[]> {
    const result = await fetch(`https://localhost:3000/${this.config.endpoint}`,
      {
        method: 'POST',
        body: JSON.stringify(dataOrModel),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
    return result.json();
  }

  static async find<T extends Model>(filter?: QueryFilter): Promise<T[]> {
    let url = `https://jsonplaceholder.typicode.com/${this.config.endpoint}`;
    if (filter) {
      url = url.concat('?');
      if (filter.where) {
        const arrayWhere = Object.keys(filter.where);
        arrayWhere.forEach((element) => {
          // if (filter.where) {
          //   url = url.concat(`${element}=${filter.where[element]}`, '&');
          // }
          filter.where ? url = url.concat(`${element}=${filter.where[element]}`, '&') : undefined;
        });
      }
      if (filter.page) {
        url = url.concat(`_page=${filter.page}&`);
      }
      if (filter.limit) {
        url = url.concat(`_limit=${filter.limit}&`);
      }
      if (filter.sort) {
        url = url.concat(`_sort=${filter.sort}&`);
        if (filter.order) {
          url = url.concat(`_order=${filter.order}`);
        }
      }
    }
    console.log(url);
    const result = await fetch(url);
    return result.json();
  }

  static async findById<T extends Model>(
    this: {
      new(data: Record<string, any>): T; config: ModelConfig;
    }, id: ModelIdType, options?: FindByIdOptions,
  ): Promise<T> {
    const result = await fetch(`https://jsonplaceholder.typicode.com/${this.config.endpoint}/${id}`)
      .then(async (res) => {
        const response = await res.json();
        const model: T = new this(response);
        if (options) {
          await Promise.all(options.includes.map(async (element) => {
            if (this.config.relations) {
              if (Object.prototype.hasOwnProperty.call(this.config.relations, element)) {
                const relationsData = this.config.relations[element];
                if (relationsData.type === RelationType.BelongsTo) {
                  const option = await relationsData.model.findById(
                    (model as any)[relationsData.foreignKey],
                  );
                  (model as any)[element] = option;
                } else if (relationsData.type === RelationType.HasMany) {
                  const option = await relationsData.model.findById(
                    `?${relationsData.foreignKey}=${id}`,
                  );
                  (model as any)[element] = option;
                }
              }
            }
          }));
        }
        return model; // on retourne le model
      });
    return result;
  }

  static updateById<T extends Model>(model: T): Promise<T[]>;

  static updateById<T extends Model>(id: ModelIdType, data: Partial<SchemaOf<T>>): Promise<T[]>;

  static async updateById<T extends Model>(
    param: T | ModelIdType, objet?: Partial<SchemaOf<T>>,
  ): Promise<T[]> {
    if (objet) {
      const promiseModel = await fetch(`http://localhost:3000/${this.config.endpoint}/${param}`, {
        method: 'PUT',
        body: JSON.stringify(objet),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      return promiseModel.json();
    }
    const promiseModel = await fetch(
      `http://localhost:3000/${this.config.endpoint}/${param}`, {
        method: 'PUT',
        body: JSON.stringify(param),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
    return promiseModel.json();
  }

  static async deleteById(id: ModelIdType): Promise<boolean> {
    const promiseModel = await fetch(`http://localhost:3000/${this.config.endpoint}/${id}`, {
      method: 'DELETE',
    });
    return promiseModel.json();
  }

  // /**
  //  * Push changes that has occured on the instance
  //  */
  async save<T extends Model>(): Promise<T> {
    const { endpoint } = (this.constructor as typeof Model).config;
    if (Model.id) {
      const promiseModel = await fetch(`http://localhost:3000/${endpoint}/${Model.id}`, {
        method: 'PUT',
        body: JSON.stringify(this),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      return promiseModel.json();
    }
    const promiseModel = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(this),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    return promiseModel.json();
  }

  // /**
  //  * Push given changes, and update the instance
  //  */
  async update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T> {
    const { endpoint } = (this.constructor as typeof Model).config;
    const promiseModel = await fetch(`http://localhost:3000/${endpoint}/${Model.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    return promiseModel.json();
  }

  // /**
  //  * Remove the remote data of the instance
  //  */
  async remove(): Promise<void> {
    const { endpoint } = (this.constructor as typeof Model).config;
    const promiseModel = await fetch(`http://localhost:3000/${endpoint}/${Model.id}`, {
      method: 'DELETE',
    });
    return promiseModel.json();
  }
}
