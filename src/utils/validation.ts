export interface GetCustomersParams {
  page: number;
  limit: number;
  search?: string;
}

export interface GetCustomerByIdParams {
  id: number;
}

export function validateGetCustomersParams(query: any): GetCustomersParams {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const parsedLimit = parseInt(query.limit, 10);
  const limit = Math.min(
    100,
    Math.max(1, isNaN(parsedLimit) ? 10 : parsedLimit),
  );
  const search = query.search ? String(query.search).trim() : undefined;

  return { page, limit, search };
}

export function validateGetCustomerByIdParams(
  id: string,
): GetCustomerByIdParams {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId < 1) {
    throw new Error("Invalid customer ID");
  }
  return { id: parsedId };
}
