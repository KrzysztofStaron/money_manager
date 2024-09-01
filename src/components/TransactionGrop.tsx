import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useCashe } from "../hooks/useCashe";
import {
  Category,
  DataManager,
  Transaction,
  TransactionManager,
} from "../interfaces";
import { AiFillAlert, AiOutlinePlus } from "react-icons/ai";
import TransactionCreation, { TransactionEdit } from "./TransactionCreation";
import { getRandomColor, talwindToHex } from "../talwindToHex";

// Register the necessary components
Chart.register(ArcElement, Tooltip, Legend);

// Custom plugin to add text in the center
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart: { ctx: any; width: any; height: any; config: any }) => {
    const { ctx, width, height, config } = chart;
    ctx.restore();
    const fontSize = (height / 130).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    let text = "";
    const value = Number(config.options.plugins.centerText.text);
    if (value > 1e10) {
      text = value.toExponential(2);
    } else if (value > 1e6) {
      text =
        value >= 1e9
          ? `${(value / 1e9).toFixed(2)}B`
          : `${(value / 1e6).toFixed(2)}M`;
    } else if (value > 1e5) {
      text = value.toFixed(0);
    } else if (value > 1e4) {
      text = value.toFixed(1);
    } else {
      text = value.toFixed(2);
    }
    text = `${config.options.plugins.centerText.currency}${text}`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

// Register the custom plugin
Chart.register(centerTextPlugin);

var defCategories: { [key: string]: Category[] } = {
  expenses: [
    { name: "Food", color: "bg-red-500", parent: "expenses" },
    { name: "Transport", color: "bg-blue-500", parent: "expenses" },
    { name: "Clothes", color: "bg-yellow-400", parent: "expenses" },
    { name: "Health", color: "bg-green-500", parent: "expenses" },
    { name: "Entertainment", color: "bg-purple-500", parent: "expenses" },
    { name: "Education", color: "bg-pink-500", parent: "expenses" },
    { name: "Housing", color: "bg-orange-600", parent: "expenses" },
    { name: "Other", color: "bg-gray-400", parent: "expenses" },
  ],
  income: [
    { name: "Salary", color: "bg-cyan-500", parent: "income" },
    { name: "Investments", color: "bg-teal-500", parent: "income" },
    { name: "Gifts", color: "bg-lime-500", parent: "income" },
    { name: "Other", color: "bg-indigo-500", parent: "income" },
  ],
};

const TransactionGrop = ({
  mode,
  recalc,
}: {
  mode: "expenses" | "income";
  recalc: () => void;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState(defCategories[mode]);

  const getCategory = (name: string) => {
    return categories?.find((el) => el.name === name);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [creation, setCreation] = useState(false);
  const [editing, setEditing] = useState(-1);

  useEffect(() => {
    setTransactions(
      JSON.parse(DataManager.getItem(`transactions_${mode}`)) || []
    );
    setCategories(
      JSON.parse(DataManager.getItem(`categories_${mode}`)) ||
        defCategories[mode]
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    DataManager.setItem(`transactions_${mode}`, JSON.stringify(transactions));
    console.log("save");

    recalc();
  }, [transactions]);

  useEffect(() => {
    if (isLoading) return;
    DataManager.setItem(`categories_${mode}`, JSON.stringify(categories));
    console.log("save");
  }, [categories]);

  const labels = Array.from(
    new Set(
      transactions?.map((transaction) => categories[transaction.category].name)
    )
  );

  let values: number[] | any = [];
  labels?.forEach((label) => {
    values.push(
      transactions
        ?.filter(
          (transaction: Transaction) =>
            categories[transaction.category].name === label
        )
        .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0)
    );
  });

  var dataColors: string[] = labels?.map((label) => {
    return talwindToHex(getCategory(label)?.color);
  });

  const data = {
    labels: labels || [],
    datasets: [
      {
        data: values || [],
        backgroundColor: dataColors.map((color) => color),
        borderColor: ["rgb(3 7 18)"],
        borderWidth: 4,
      },
    ],
  };

  const options = {
    cutout: "70%",
    devicePixelRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            let label = context.label || "";
            let value = context.parsed || 0;
            return `${label}: ${value}`;
          },
        },
      },
      centerText: {
        text: transactions?.reduce((acc, curr) => acc + curr.amount, 0),
        currency: "$",
      },
    },
  };

  const editCategory = (cat: Category, id: number) => {
    console.log(id);
    console.log(cat);
    console.log(categories[id]);

    setCategories((prev) => {
      return prev.map((el, index) => {
        if (index === id) {
          return cat;
        }
        return el;
      });
    });
  };

  if (editing >= 0) {
    return (
      <TransactionEdit
        editCategory={editCategory}
        cat={transactions[editing].category}
        addCategory={() => {
          setCategories((prev) => [
            ...prev,
            {
              name: "New Category",
              color: getRandomColor(),
              parent: mode,
              removed: false,
            },
          ]);
        }}
        returnTransaction={(tr: Transaction) => {
          setTransactions((prev) => {
            return prev.map((el, i) => {
              if (i === editing) {
                return tr;
              }
              return el;
            });
          });
          setEditing(-1);
        }}
        transaction={transactions[editing]}
        remove={() => {
          setTransactions((prev) => {
            return prev.filter((el, index) => index !== editing);
          });
          setEditing(-1);
        }}
        categories={categories}
      />
    );
  }

  if (creation) {
    return (
      <TransactionCreation
        editCategory={editCategory}
        addCategory={() => {
          setCategories((prev) => [
            ...prev,
            {
              name: "New Category",
              color: getRandomColor(),
              parent: mode,
              removed: false,
            },
          ]);
        }}
        returnTransaction={(tr) => {
          setTransactions((prev) => [...prev, tr]);
          setCreation(false);
        }}
        categories={categories}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center w-screen">
        <div className="w-5/7 ml-10">
          {isLoading ? null : <Doughnut data={data} options={options} />}
        </div>
        <button
          className="min-w-10 h-10 relative bg-lime-400 rounded-full flex items-center justify-center text-black self-end right-10"
          onClick={() => setCreation(true)}
        >
          <AiOutlinePlus />
        </button>
      </div>

      <div className="mt-4 overflow-x-hidden grow">
        {transactions && transactions.length > 0
          ? transactions.map((transaction, index) => (
              <TransactionDisplay
                key={index}
                data={transaction}
                catData={{
                  color: categories[transaction.category].color,
                  name: categories[transaction.category].name,
                }}
                onClick={() => {
                  setEditing(index);
                }}
              />
            ))
          : null}
      </div>
    </div>
  );
};

const TransactionDisplay = ({
  data,
  onClick,
  catData,
}: {
  data: Transaction;
  onClick: MouseEventHandler<HTMLDivElement>;
  catData: any;
}) => {
  return (
    <div
      className="flex h-10 pl-2 border-b-2 border-gray-900 hover:bg-gray-900"
      onClick={onClick}
    >
      <div className="flex gap-3 items-center">
        <div
          className={`w-6 h-6 rounded-full shadow-2x`}
          style={{ backgroundColor: talwindToHex(catData.color) }}
        ></div>
        <div>{catData.name}</div>

        <div className="font-extralight">
          {data.amount}
          {data.currency}
        </div>
      </div>
    </div>
  );
};

export default TransactionGrop;
