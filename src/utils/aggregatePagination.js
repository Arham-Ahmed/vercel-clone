const mongoose = require("mongoose");

const aggregatePaginate = async ({ collection, aggregate, options }) => {
  options = {
    sort: options?.sort || { createdAt: -1 },
    page: +options?.page || 1,
    limit: +options?.perPage || 20,
  };

  const aggData = mongoose.model(collection).aggregate(aggregate);
  const aggregateData = await mongoose.model(collection).aggregatePaginate(aggData, options);
  return {
    [collection + "s"]: aggregateData.docs,
    totalPages: aggregateData.totalPages,
    totalRecords: aggregateData.totalDocs,
    perPage: aggregateData.limit,
    currentPage: aggregateData.page,
    hasNextPage: aggregateData.hasNextPage,
    hasPrevPage: aggregateData.hasPrevPage,
  };
};

module.exports = aggregatePaginate;
