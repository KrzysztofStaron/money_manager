import { getRandomColor } from "./talwindToHex";

export class DataManager {
  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static getItem(key: string): string {
    return localStorage.getItem(key)!;
  }

  static getData(key: string): any | undefined {
    return JSON.parse(localStorage.getItem(key)!);
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

export type Mode = "expenses" | "income";

export class TransactionManager {
  mode: Mode;

  constructor(mode:Mode) {
    this.mode = mode;
  }

  static TransactionObject(
    name: string,
    category: number,
    mode:Mode,
    amount: number,
    currency: string
  ): Transaction {
    if (category === undefined) {
      throw new Error("Category not found");
    }

    return {
      name: name,
      category: category,
      amount: amount,
      currency: currency,
      date: Date.now(),
    };
  }
}

export type Category = {
  name: string;
  color: string;
  parent: string;
  removed?: boolean;
};

export type Transaction = {
  name: string;
  category: number;
  amount: number;
  currency: string;
  date: number;
};

export const Settings =  {
  currency: "$",
}