import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

function FormOperationCost() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      insuranceCalMethod: "",
      operationYears: [
        {
          numOfPeople: 0,
          annualSalary: 0,
          othersWithWelfare: 0,
          repairExpense: 0,
          insuranceExpence: 0,
          materialExpence: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "operationYears",
    control,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      className="border-slate-200 dark:border-slate-700 flex flex-wrap"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-40 relative mr-6 mt-2">
        <label className="ml-1">
          保险费计算方式
          <select
            {...register("insuranceMethod")}
            className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
          >
            <option value="AssetOriginalCost">固定资产原值</option>
          </select>
        </label>
      </div>

      {/** 每一年的费用 */}
      {fields.map((field, index) => {
        return (
          <section key={field.id} className="w-full flex flex-wrap mt-5">
            <label className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2">
              第{index + 1}年
            </label>
            <div className="relative mr-6 w-24 mt-2">
              {index === 0 && <label className="ml-1">人员数量</label>}
              <input
                {...register(`operationYears.${index}.numOfPeople`, {
                  onChange: (e) => {
                    const value = e.target.value;
                    console.log(value);
                    foreach((field, index) => console.log(field, index));
                  },
                  required: "必填项",
                })}
                type="number"
                min="0"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
              />
              <span
                className={
                  "absolute inset-0 left-auto group pt-" +
                  (index === 0 ? 10 : 5) +
                  " pr-3"
                }
              >
                人
              </span>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              {index === 0 && <label className="ml-1">平均年工资</label>}
              <input
                {...register(`operationYears.${index}.annualSalary`)}
                type="number"
                min="0"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
              />
              <span
                className={
                  "absolute inset-0 left-auto group pt-" +
                  (index === 0 ? 10 : 5) +
                  " pr-3"
                }
              >
                万
              </span>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              {index === 0 && <label className="ml-1">福利费+</label>}
              <input
                {...register(`operationYears.${index}.othersWithWelfare`)}
                type="number"
                min="0"
                step="0.001"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
              />
              <span
                className={
                  "absolute inset-0 left-auto group pt-" +
                  (index === 0 ? 10 : 5) +
                  " pr-3"
                }
              >
                %
              </span>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              {index === 0 && <label className="ml-1">修理费</label>}
              <input
                {...register(`operationYears.${index}.repaireExpence`)}
                type="number"
                min="0"
                step="0.001"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
              />
              <span
                className={
                  "absolute inset-0 left-auto group pt-" +
                  (index === 0 ? 10 : 5) +
                  " pr-3"
                }
              >
                元/kw
              </span>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              {index === 0 && <label className="ml-1">保险费</label>}
              <input
                {...register(`operationYears.${index}.insuranceExpence`)}
                type="number"
                min="0"
                step="0.001"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
              />
              <span
                className={
                  "absolute inset-0 left-auto group pt-" +
                  (index === 0 ? 10 : 5) +
                  " pr-3"
                }
              >
                %
              </span>
            </div>
            <div className="relative mr-6 w-28 mt-2">
              {index === 0 && <label className="ml-1">材料费</label>}
              <input
                {...register(`operationYears.${index}.materialExpence`)}
                type="number"
                min="0"
                step="0.001"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-12"
              />
              <span
                className={
                  "absolute inset-0 left-auto group pt-" +
                  (index === 0 ? 10 : 5) +
                  " pr-3"
                }
              >
                元/kw
              </span>
            </div>
          </section>
        );
      })}
    </form>
  );
}

export default FormOperationCost;
