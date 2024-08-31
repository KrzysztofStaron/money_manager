import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react";
import { DataManager } from "../interfaces";

export const useCashe = <T>(
  id: string,
  defaultValue?: T
): [T | undefined, Dispatch<SetStateAction<T | any>>] => {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    const item = DataManager.getItem(id);
    if (item) {
      setState(JSON.parse(item));
    } else {
      setState(defaultValue);
    }
  }, []);

  if (state !== undefined) {
    DataManager.setItem(id, JSON.stringify(state));
  }

  return [state || (defaultValue as T), setState];
};
