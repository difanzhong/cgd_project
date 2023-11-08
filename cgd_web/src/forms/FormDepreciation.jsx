import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";

import BasicArgsService from "../services/BasicArgsService";
import ExpenseService from "../services/ExpenseService";
import FetchClient from "../clients/FetchClient";

function FormDepreciation({ project_id }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({});

  const { fields, append, remove } = useFieldArray({
    name: "operations",
    control,
  });

  const basicArgsService = new BasicArgsService(FetchClient);
  const expenseService = new ExpenseService(FetchClient);

  const [basicArgs, setBasicArgs] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [constructionYear, setConstructionYear] = useState([]);

  const fetchBasicArgsResult = async () => {
    try {
      const basicArgsResult = await basicArgsService.get(project_id);
      setBasicArgs(basicArgsResult);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchExpenseResult = async () => {
    try {
      const expenseResult = await expenseService.get(project_id);
      setExpenses(expenseResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBasicArgsResult();
    fetchExpenseResult();
  }, []);

  useEffect(() => {
    let period = basicArgs[0]?.calculationYear ?? 10;
    setConstructionYear(basicArgs[0]?.constructionYear);
    if (expenses.length > 0) {
      reset(expenses[0]);
    } else {
      if (period) {
        reset({
          salvageRate: 0,
          depreciationMethod: "",
          depreciationPeriod: 0,
          amortizationPeriod: 0,
          otherAmortizationPeriod: 0,
          operations: Array(period).fill({
            numOfPeople: 0,
            annualSalary: 0,
            othersWithWelfare: 0,
            repairExpense: 0,
            insuranceExpense: 0,
            materialExpense: 0,
            otherExpense: 0,
            otherExpense2: 0,
            otherFinanceExpense: 0,
            otherFinanceExpense2: 0,
          }),
        });
      }
    }
  }, [expenses]);

  const onSubmit = (data) => {
    data.project_id = project_id;
    if (isDirty) {
      data.id ? expenseService.put(data) : expenseService.post(data);
    }
  };

  const repeatValue = (fields, current_index, value, property) => {
    fields.forEach((field, i) => {
      if (i > current_index) {
        setValue(`operations.${i}` + property, value);
      }
    });
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          折旧
        </h2>
      </header>
      <div className="p-3">
        <form
          className="border-slate-200 dark:border-slate-700 flex flex-wrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-row-4 grid-col-flow gap-2">
            <div className="col-span-2 row-span-1 flex flex-wrap ml-5 mt-5">
              <div className="relative w-20 mr-6">
                <label htmlFor="salvageRate" className="ml-1 text-xs">
                  残值率
                  <input
                    {...register("salvageRate", {
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
                    id="salvageRate"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-6"
                    type="number"
                    max="100"
                    min="0"
                    step="0.001"
                  />
                  <span className="absolute inset-0 left-auto text-base group pt-10 pr-3">
                    %
                  </span>
                  <ErrorMsg message={errors.salvageRate?.message} />
                </label>
              </div>
              <div className="relative mr-6 w-48 ">
                <label className="ml-1 text-xs">
                  折旧计算方式
                  <select
                    {...register("depreciationMethod", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                    })}
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                  >
                    <option value="depreciate_by_year">折旧年限</option>
                  </select>
                  <ErrorMsg message={errors.depreciationMethod?.message} />
                </label>
              </div>
              <div className="relative mr-6 w-20">
                <label htmlFor="depreciationPeriod" className="ml-1 text-xs">
                  折旧年限
                  <input
                    {...register("depreciationPeriod", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 0,
                        message: "0～30之间",
                      },
                      max: {
                        value: 30,
                        message: "0~30之间",
                      },
                    })}
                    id="depreciationPeriod"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-7"
                    type="number"
                    max="100"
                    min="0"
                  />
                  <span className="absolute text-base inset-0 left-auto group pt-10 pr-3">
                    年
                  </span>
                  <ErrorMsg message={errors.depreciationPeriod?.message} />
                </label>
              </div>
              <div className="relative mr-6 w-28">
                <label htmlFor="amortizationPeriod" className="text-xs ml-1">
                  无形资产摊销
                  <input
                    {...register("amortizationPeriod", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 0,
                        message: "0～30之间",
                      },
                      max: {
                        value: 30,
                        message: "0~30之间",
                      },
                    })}
                    id="amortizationPeriod"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    max="50"
                    min="0"
                  />
                  <span className="absolute text-base inset-0 left-auto group pt-10 pr-3">
                    年
                  </span>
                  <ErrorMsg message={errors.amortizationPeriod?.message} />
                </label>
              </div>
              <div className="relative mr-6 w-28">
                <label
                  htmlFor="otherAmortizationPeriod"
                  className="ml-1 text-xs"
                >
                  其他资产摊销
                  <input
                    {...register("otherAmortizationPeriod", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 0,
                        message: "0～30之间",
                      },
                      max: {
                        value: 30,
                        message: "0~30之间",
                      },
                    })}
                    id="otherAmortizationPeriod"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    min="0"
                    max="50"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    年
                  </span>
                  <ErrorMsg message={errors.otherAmortizationPeriod?.message} />
                </label>
              </div>
            </div>
            <div className="col-span-2 row-span-1 flex flex-wrap ml-5 mt-5">
              <div className="w-40 relative mr-6">
                <label className="ml-1 text-xs">
                  保险费计算方式
                  <select
                    {...register("insuranceFeeMethod")}
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                  >
                    <option value="AssetOriginalCost">固定资产原值</option>
                  </select>
                  {/* <button
                    className="bg-slate-200 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded p-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      append({});
                    }}
                  >
                    加一年
                  </button> */}
                </label>
              </div>
            </div>
            <div className="col-span-1 row-span-1 text-xs">
              <div className="w-24 h-16"></div>
              <div className="h-16 mt-3 text-right p-3">
                <label className="ml-1 ">人员数量</label>
              </div>
              <div className="h-16 mt-1 text-right p-3">
                <label className="ml-1">年工资</label>
              </div>
              <div className="mt-3 h-16 text-right p-3">
                <label className="ml-1">福利费+</label>
              </div>
              <div className=" mt-1 h-16 text-right p-3">
                <label className="ml-1">修理费</label>
              </div>
              <div className="mt-2 h-16 text-right p-3">
                <label className="ml-1">保险费</label>
              </div>
              <div className="mt-2 h-16 text-right p-3">
                <label className="ml-1"> 材料费</label>
              </div>
              <div className="mt-1 h-16 text-right p-3">
                <label className="ml-1"> 其他费用</label>
              </div>
              <div className=" mt-1 h-16 text-right p-3">
                <label className="ml-1"> 其他费用2</label>
              </div>
              <div className="mt-2 h-16 text-right p-3">
                <label className="ml-1"> 其他财务费用</label>
              </div>
              <div className=" mt-1 h-14 text-right p-3">
                <label className="ml-1"> 其他财务费用2</label>
              </div>
            </div>
            <div className="col-span-1 row-span-1 flex flex-wrap mt-5 overflow-x-auto">
              {/** 每一年的费用 */}
              <div className="grid grid-rows-6 grid-flow-col gap-1 flex flex-wrap">
                {fields.map((field, index) => {
                  return (
                    <section
                      key={field.id}
                      className="col-span-1 row-span-6 mt-5 flow-shrink-0"
                    >
                      <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2">
                        第{index + 1}年{" "}
                        {index < constructionYear ? "(建设)" : "(运营)"}
                      </label>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.numOfPeople`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(fields, index, value, ".numOfPeople");
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "1～100之间",
                            },
                            max: {
                              value: 100,
                              message: "1~100之间",
                            },
                          })}
                          type="number"
                          min="0"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3"
                          }
                        >
                          人
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.numOfPeople?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.annualSalary`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(
                                fields,
                                index,
                                value,
                                ".annualSalary"
                              );
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "1～100之间",
                            },
                            max: {
                              value: 100,
                              message: "1~100之间",
                            },
                          })}
                          type="number"
                          min="0"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3"
                          }
                        >
                          万
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.annualSalary?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(
                            `operations.${index}.othersWithWelfare`,
                            {
                              onChange: (e) => {
                                const value = e.target.value;
                                repeatValue(
                                  fields,
                                  index,
                                  value,
                                  ".othersWithWelfare"
                                );
                              },
                              required: {
                                value: true,
                                message: "必填",
                              },
                              min: {
                                value: 0,
                                message: "1～100之间",
                              },
                              max: {
                                value: 100,
                                message: "1~100之间",
                              },
                            }
                          )}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3"
                          }
                        >
                          %
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.othersWithWelfare
                              ?.message
                          }
                        />
                      </div>
                      <div className="relative  w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.repairExpense`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(
                                fields,
                                index,
                                value,
                                ".repairExpense"
                              );
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "0～10000之间",
                            },
                            max: {
                              value: 10000,
                              message: "0~10000之间",
                            },
                          })}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3"
                          }
                        >
                          元/kw
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.repairExpense?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.insuranceExpense`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(
                                fields,
                                index,
                                value,
                                ".insuranceExpense"
                              );
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "1～100之间",
                            },
                            max: {
                              value: 100,
                              message: "1~100之间",
                            },
                          })}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3"
                          }
                        >
                          %
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.insuranceExpense
                              ?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.materialExpense`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(
                                fields,
                                index,
                                value,
                                ".materialExpense"
                              );
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "0～10000之间",
                            },
                            max: {
                              value: 10000,
                              message: "0~10000之间",
                            },
                          })}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3 text-xs"
                          }
                        >
                          元/kw
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.materialExpense?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.otherExpense`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(
                                fields,
                                index,
                                value,
                                ".otherExpense"
                              );
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "0～10000之间",
                            },
                            max: {
                              value: 10000,
                              message: "0~10000之间",
                            },
                          })}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3 text-xs"
                          }
                        >
                          元/kw
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.otherExpense?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(`operations.${index}.otherExpense2`, {
                            onChange: (e) => {
                              const value = e.target.value;
                              repeatValue(
                                fields,
                                index,
                                value,
                                ".otherExpense2"
                              );
                            },
                            required: {
                              value: true,
                              message: "必填",
                            },
                            min: {
                              value: 0,
                              message: "0～10000之间",
                            },
                            max: {
                              value: 10000,
                              message: "1~10000之间",
                            },
                          })}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3 text-xs"
                          }
                        >
                          元/kw
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.otherExpense2?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 text-xs">
                        <input
                          {...register(
                            `operations.${index}.otherFinanceExpense`,
                            {
                              onChange: (e) => {
                                const value = e.target.value;
                                repeatValue(
                                  fields,
                                  index,
                                  value,
                                  ".otherFinanceExpense"
                                );
                              },
                              required: {
                                value: true,
                                message: "必填",
                              },
                              min: {
                                value: 0,
                                message: "1～10000之间",
                              },
                              max: {
                                value: 10000,
                                message: "1~10000之间",
                              },
                            }
                          )}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3 text-xs"
                          }
                        >
                          万
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.otherFinanceExpense
                              ?.message
                          }
                        />
                      </div>
                      <div className="relative w-24 mt-2 pb-4 text-xs">
                        <input
                          {...register(
                            `operations.${index}.otherFinanceExpense2`,
                            {
                              onChange: (e) => {
                                const value = e.target.value;
                                repeatValue(
                                  fields,
                                  index,
                                  value,
                                  ".otherFinanceExpense2"
                                );
                              },
                              required: {
                                value: true,
                                message: "必填",
                              },
                              min: {
                                value: 0,
                                message: "1～10000之间",
                              },
                              max: {
                                value: 10000,
                                message: "1~10000之间",
                              },
                            }
                          )}
                          type="number"
                          min="0"
                          step="0.001"
                          className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                        />
                        <span
                          className={
                            "absolute inset-0 left-auto group pt-5 pr-3 text-xs"
                          }
                        >
                          万
                        </span>
                        <ErrorMsg
                          message={
                            errors.operations?.[index]?.otherFinanceExpense2
                              ?.message
                          }
                        />
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
            <div className="col-span-2 row-span-1 flex flex-wrap ml-5 mt-20 mb-5 ">
              <button className="btn bg-indigo-500 enabled:hover:bg-indigo-600 text-white rounded disabled:opacity-75">
                <span className="hidden xs:block ml-3 mr-3">提交</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormDepreciation;
