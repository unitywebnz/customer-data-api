import { Request, Response, NextFunction } from "express";
import { database, Customer } from "../models/database";
import {
  validateGetCustomersParams,
  validateGetCustomerByIdParams,
} from "../utils/validation";

export async function getCustomers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = validateGetCustomersParams(req.query);
    const result = await database.getCustomers(
      params.page,
      params.limit,
      params.search,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = validateGetCustomerByIdParams(req.params.id);
    const customer = await database.getCustomerById(params.id);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.json(customer);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid customer ID") {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
}
