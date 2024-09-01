import React, { useEffect, useMemo, useState } from "react";
import TransactionGrop from "./components/TransactionGrop";
import { DataManager, Mode, TransactionManager } from "./interfaces";
import TransactionCreation from "./components/TransactionCreation";

const App = () => {
  const [screen, setScreen] = useState<Mode>("expenses");
  const [total, setTotal] = useState(0);

  const recalc = () => {
    const e = DataManager.getData("transactions_expenses") ?? [];
    const i = DataManager.getData("transactions_income") ?? [];

    const eSum = e.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const iSum = i.reduce((acc: number, curr: any) => acc + curr.amount, 0);

    setTotal(iSum - eSum);
  };

  useEffect(() => {
    recalc();
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-3">
        <div>
          <div className={`w-full text-center font-light text-sm pt-2`}>
            <span className={`${total < 0 && "text-red-400"}`}>
              {total.toFixed(2)}$
            </span>
          </div>

          <div className="flex items-center justify-around">
            <button
              className={`font-semibold px-8 py-1 ${
                screen === "expenses" ? "underline" : "text-gray-400"
              }`}
              onClick={() => setScreen("expenses")}
            >
              Expenses
            </button>
            <button
              className={`font-semibold px-8 py-1 ${
                screen === "income" ? "underline" : "text-gray-400"
              }`}
              onClick={() => setScreen("income")}
            >
              Income
            </button>
          </div>
        </div>
        <div className="w-screen grow">
          {screen === "expenses" ? (
            <TransactionGrop mode="expenses" key={1} recalc={recalc} />
          ) : (
            <TransactionGrop mode="income" key={2} recalc={recalc} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
