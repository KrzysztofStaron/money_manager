import React, { useEffect, useState } from "react";
import { Category, Settings, Transaction } from "../interfaces";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { getRandomColor, talwindToHex } from "../talwindToHex";

const formatAmount = (amount: string): string => {
  let value = amount.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const dotIndex = value.indexOf(".");
  if (dotIndex !== -1) {
    value =
      value.slice(0, dotIndex + 1) +
      value.slice(dotIndex + 1).replace(/\./g, "");
    const decimalPart = value.slice(dotIndex + 1);
    if (decimalPart.length > 2) {
      value = value.slice(0, dotIndex + 3);
    }
  }

  return value;
};

// TODO: separate the structure to separated component
const TransactionCreation = ({
  returnTransaction,
  categories,
  addCategory,
  editCategory,
}: {
  returnTransaction: (transaction: Transaction) => void;
  categories: Category[];
  addCategory: () => void;
  editCategory: (cat: Category, id:number) => void;
}) => {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<number>(0);
  const [name, setName] = useState("");

  return (
    <div className="absolute bg-black/90 w-screen h-screen top-0 left-0 flex items-center justify-center p-5 rounded">
      <div className="w-full bg-gray-900 h-full flex-grow rounded-sm flex flex-col justify-between">
        <div>
          <div className="text-xl flex justify-center pt-5">
            <input
              type="text"
              className="bg-transparent focus:outline-none border-b-2 px-2 text-center w-32"
              placeholder="0.00"
              onChange={(e) => {
                setAmount(formatAmount(e.target.value));
              }}
              value={amount}
              autoFocus
            />
            <span>{Settings.currency}</span>
          </div>
          <input
            type="text"
            className="bg-transparent focus:outline-none border-b-2 px-2 border-gray-200 w-full text-lg mt-10"
            placeholder="Transaction name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <CategoryDisplay
            categories={categories}
            category={category}
            setCategory={setCategory}
            addCategory={addCategory}
            editCategory={editCategory}
          />
        </div>

        <button
          className="bg-gray-300 text-gray-950 py-1 px-8 m-12 rounded-xl font-semibold"
          onClick={() => {
            returnTransaction({
              name: name,
              category: category,
              amount: parseFloat(amount) || 0,
              currency: Settings.currency,
              date: Date.now(),
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export const TransactionEdit = ({
  addCategory,
  returnTransaction,
  transaction,
  remove,
  categories,
  cat,
  editCategory,
}: {
  addCategory: () => void;
  returnTransaction: (transaction: Transaction) => void;
  transaction: Transaction;
  remove: () => void;
  categories: Category[];
  cat: number;
  editCategory: (cat: Category, id:number) => void;
}) => {
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [category, setCategory] = useState<number>(cat);
  const [name, setName] = useState(transaction.name);

  return (
    <div className="absolute bg-black/90 w-screen h-screen top-0 left-0 flex items-center justify-center p-5 rounded">
      <div className="w-full bg-gray-900 h-full flex-grow rounded-sm flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="text-xl flex justify-center pt-5">
            <input
              type="text"
              className="bg-transparent focus:outline-none border-b-2 px-2 text-center w-32"
              placeholder="0.00"
              onChange={(e) => {
                setAmount(formatAmount(e.target.value));
              }}
              value={amount}
              autoFocus
            />
            <span>{Settings.currency}</span>
          </div>
          <input
            type="text"
            className="bg-transparent focus:outline-none border-b-2 px-2 border-gray-200 w-full text-lg mt-10"
            placeholder="Transaction name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CategoryDisplay
            categories={categories}
            category={category}
            setCategory={setCategory}
            addCategory={addCategory}
            editCategory={editCategory}
          />
        </div>
        <div className="flex justify-center gap-8 mb-10">
          <button
            className="bg-gray-300 text-gray-950 py-1 px-8 rounded-xl font-semibold h-10 min-w-28"
            onClick={() => {
              returnTransaction({
                name: name,
                category: category,
                amount: parseFloat(amount) || 0,
                currency: Settings.currency,
                date: Date.now(),
              });
            }}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-gray-950 py-1 px-8 rounded-xl font-semibold h-10 min-w-28 flex items-center justify-center"
            onClick={() => remove()}
          >
            <FaRegTrashAlt size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryDisplay = ({
  categories,
  category,
  setCategory,
  addCategory,
  editCategory,
}: {
  categories: Category[];
  category: number;
  setCategory: (cat: number) => void;
  addCategory: () => void;
  editCategory: (cat: Category, id:number) => void;
}) => {
  const [editing, setEditing] = useState(-1);
  const [name, setName] = useState("");

  return (
    <div className="mt-10">
      <label>
        Category:
        <div className="bg-gray-900/90 w-full cursor-pointer">
          {categories.map((el, index) => (
            <div
              key={el.name}
              className={`option pl-5 hover:bg-gray-600 py-1 flex items-center justify-between pr-2 ${
                categories[category].name === el.name ? "bg-gray-700" : ""
              }`}
              onClick={() => setCategory(index)}
              onDoubleClick={() => {
                setEditing(e => index)
                setName(el.name)
              }}
            >
              {editing === index ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent name_editing" onBlur={() => setEditing(-1)} onClick={(e) => e.preventDefault()} autoFocus/>
              ) : (<div>{el.name}</div>)}
              
              <div
                className={`w-4 h-4 rounded-full`}
                style={{ backgroundColor: talwindToHex(el.color) }}
                onDoubleClick={(event) => {
                  console.log("regen")
                  editCategory({
                    ...el,
                    color: getRandomColor(),
                  }, index);
                }}
              ></div>
            </div>
          ))}
        </div>
      </label>
      <button
        className="flex w-full items-center justify-center add"
        onClick={(event) => {
          addCategory();
        }}
      >
        <AiOutlinePlus fontSize={24} />
      </button>
    </div>
  );
};

export default TransactionCreation;
