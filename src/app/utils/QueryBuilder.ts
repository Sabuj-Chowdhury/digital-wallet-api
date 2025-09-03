import { Query } from "mongoose";
import { excludeFields } from "../constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //   methods
  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchConst: string[]): this {
    const searchTerm = this.query.search || "";

    const search = {
      $or: searchConst.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(search);

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields(): this {
    const fieldFiltering = this.query.field?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fieldFiltering);

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return { currentPage: page, limit, total: totalDocuments, totalPage };
  }
}
