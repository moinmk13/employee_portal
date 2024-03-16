import { Model, Document } from 'mongoose';

interface PaginationOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

const paginate = (schema: Model<any>) => {
  // @ts-ignore
  schema.statics.paginate = async function (filter: any, options: PaginationOptions): Promise<QueryResult> {
    try {
      let sort = options.sortBy ? options.sortBy : '-createdAt';
      const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : null;
      const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
      const skip = (page - 1) * (limit || 0);

      Object.keys(filter).forEach(field => {
        if (filter[field] && typeof filter[field] === 'string') {
          filter[field] = { $regex: new RegExp(filter[field], 'i') };
        }
      });

      const countPromise = this.countDocuments(filter).exec();
      let docsPromise = this.find(filter || {}).sort(sort).skip(skip).limit(limit || 0);

      if (options.populate) {
        options.populate.split(',').forEach((populateOption: string) => {
          docsPromise = docsPromise.populate(
            populateOption
              .split('.')
              .reverse()
              // @ts-ignore
              .reduce((a: any, b: any) => ({ path: b, populate: a }))
          );
        });
      }

      docsPromise = docsPromise.exec();

      const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
      const totalPages = limit == 0 ? 1 : Math.ceil(totalResults / (limit || 1));
      const recordsPresent = results?.length;

      return {
        results,
        // @ts-ignore
        recordsPresent,
        totalResults,
        totalPages,
        limit: limit || 0,
        page,
      };
    } catch (error) {
      console.error("Error paginating:", error);
      throw error;
    }
  };
};

export = paginate;
