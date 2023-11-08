import React from "react";
import { useFieldArray } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";

export default ({
  nestIndex,
  control,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `loanBanks.${nestIndex}.payments`,
  });

  return (
    <div className="col-span-1 row-span-1 flex flex-wrap">
      {fields.map((item, k) => {
        return (
          <div
            key={item.id}
            className="w-16 relative flex flex-wrap mt-3 text-xs"
          >
            <label className="ml-2">
              第<b>{k + 1}</b>年
            </label>
            <input
              {...register(`loanBanks.${nestIndex}.payments.${k}.value`, {
                required: {
                  value: true,
                  message: "必填",
                },
                min: {
                  value: 0,
                  message: "0～100之间",
                },
                max: {
                  value: 100,
                  message: "0~100之间",
                },
              })}
              type="number"
              min="0"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-none border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3"
            />
            <ErrorMsg
              message={
                errors.loanBanks?.[nestIndex]?.payments?.[k]?.value?.message
              }
            />
          </div>
        );
      })}
    </div>
  );
};
