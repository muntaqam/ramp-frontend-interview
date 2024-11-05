import { Dispatch, SetStateAction } from "react";
import { Employee, PaginatedResponse, Transaction } from "../utils/types";

// Base types for common structure
type UseTypeBaseResult<TValue> = {
  data: TValue;
  loading: boolean;
  invalidateData: () => void;
};

type UseTypeBaseAllResult<TValue> = UseTypeBaseResult<TValue> & {
  fetchAll: () => Promise<void>;
};

type UseTypeBaseByIdResult<TValue> = UseTypeBaseResult<TValue> & {
  fetchById: (id: string) => Promise<void>;
};

// Define EmployeeResult and TransactionsByEmployeeResult using existing types
export type EmployeeResult = UseTypeBaseAllResult<Employee[] | null>;
export type TransactionsByEmployeeResult = UseTypeBaseByIdResult<Transaction[] | null>;

// Define a new type to include `setPaginatedTransactions`
export type PaginatedTransactionsResult = UseTypeBaseAllResult<PaginatedResponse<Transaction[]> | null> & {
  setPaginatedTransactions: Dispatch<SetStateAction<PaginatedResponse<Transaction[]> | null>>;
};
