import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import NestedArray from "./NestedFormFinancing";
import ErrorMsg from "../errors/ErrorMsg";
import FinanceService from "../services/FinanceService";
import FetchClient from "../clients/FetchClient";

function FormFinancing({ project_id }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty },
    dirtyFields,
  } = useForm({});

  const financeService = new FinanceService(FetchClient);

  const [financeList, setFinanceList] = useState([]);

  const fetchFinanceResult = async () => {
    try {
      const financeResult = await financeService.get(project_id);
      setFinanceList(financeResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFinanceResult();
  }, []);

  useEffect(() => {
    if (financeList) {
      reset(financeList[0]);
    }
  }, [financeList]);

  const { fields, append, remove } = useFieldArray({
    name: "loanBanks",
    control,
  });

  const onSubmit = (data) => {
    data.project_id = project_id;
    if (isDirty) {
      data.id ? financeService.put(data) : financeService.post(data);
    }
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          资金
        </h2>
      </header>
      <div className="p-3">
        <form
          className="border-slate-200 dark:border-slate-700 flex flex-wrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-flow-row gap-2">
            <div className="col-span-2 row-span-1 flex flex-wrap ml-5 mt-5">
              <div className="w-28 relative mr-6">
                <label className="ml-1 text-xs">
                  单位指标
                  <input
                    {...register("unitKilowattIndex", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 1,
                        message: "1～10000之间",
                      },
                      max: {
                        value: 10000,
                        message: "1~10000之间",
                      },
                    })}
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-14"
                    type="number"
                    min="0"
                    step="0.001"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    元/kW
                  </span>
                  <ErrorMsg message={errors.unitKilowattIndex?.message} />
                </label>
              </div>
              <div className="w-28 relative mr-6">
                <label className="ml-1 text-xs">
                  流动资金比例
                  <input
                    {...register("workingCapitalRatio", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 0,
                        message: "0～100之间",
                      },
                      max: {
                        value: 10000,
                        message: "0~100之间",
                      },
                    })}
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    min="0"
                    step="0.001"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    %
                  </span>
                  <ErrorMsg message={errors.workingCapitalRatio?.message} />
                </label>
              </div>
              <div className="w-28 relative mr-6">
                <label className="ml-1 text-xs">
                  贷款利率
                  <input
                    {...register("workingCapitalLoanInterests", {
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
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    min="0"
                    step="0.001"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    %
                  </span>
                  <ErrorMsg
                    message={errors.workingCapitalLoanInterests?.message}
                  />
                </label>
              </div>
              <div className="w-28 relative mr-6">
                <label className="ml-1 text-xs">
                  短期贷款利率
                  <input
                    {...register("shortTermLoanInterests", {
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
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    min="0"
                    step="0.001"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    %
                  </span>
                  <ErrorMsg message={errors.shortTermLoanInterests?.message} />
                </label>
              </div>
            </div>

            {/* 贷款银行们 */}

            {fields.map((field, index) => {
              // const [numberOfYears, setNumberOfYears] = useState([]);

              // field[index].yearArray(numberOfYears).fill(0);
              return (
                <div
                  key={field.id}
                  className="col-span-2 row-span-1 flex flex-wrap m-5 p-5 border-t border-t-slate-200 dark:border-t-slate-700"
                >
                  <label className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2 w-full">
                    银行{index + 1}
                  </label>

                  <div className="relative mr-6 w-24 mt-2">
                    <label className="ml-1 text-xs">
                      预定还款期
                      <input
                        {...register(`loanBanks.${index}.expectYears`, {
                          required: {
                            value: true,
                            message: "必填",
                          },
                          min: {
                            value: 1,
                            message: "1～20之间",
                          },
                          max: {
                            value: 20,
                            message: "1~20之间",
                          },
                          onChange: (e) => {
                            console.log(field.payments);
                            console.log(e.target.value);
                            // console.log(getValues(`loanBanks.${index}.year`));
                            let numOfYears =
                              e.target.value && parseInt(e.target.value) < 21
                                ? parseInt(e.target.value)
                                : 0;
                            reset({
                              [`loanBanks.${index}.payments`]: Array.apply(
                                { value: "" },
                                Array(numOfYears)
                              ),
                            });
                          },
                        })}
                        type="number"
                        min="0"
                        className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                      />
                      <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                        年
                      </span>
                      <ErrorMsg
                        message={
                          errors.loanBanks?.[index]?.expectYears?.message
                        }
                      />
                    </label>
                  </div>
                  <div className="relative mr-6 w-24 mt-2">
                    <label className="ml-1 text-xs">
                      宽限期
                      <input
                        {...register(`loanBanks.${index}.grace`, {
                          required: {
                            value: true,
                            message: "必填",
                          },
                          min: {
                            value: 0,
                            message: "0～15之间",
                          },
                          max: {
                            value: 15,
                            message: "0~15之间",
                          },
                        })}
                        type="number"
                        min="0"
                        className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                      />
                      <span className="absolute inset-0 text-base left-auto group pt-10 pr-3">
                        年
                      </span>
                      <ErrorMsg
                        message={errors.loanBanks?.[index]?.grace?.message}
                      />
                    </label>
                  </div>
                  <div className="relative mr-6 w-24 mt-2">
                    <label className="ml-1 text-xs">
                      计息次数
                      <input
                        {...register(`loanBanks.${index}.frequency`, {
                          required: {
                            value: true,
                            message: "必填",
                          },
                          min: {
                            value: 1,
                            message: "1～52之间",
                          },
                          max: {
                            value: 52,
                            message: "1~52之间",
                          },
                        })}
                        type="number"
                        className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                      />
                      <span className="absolute inset-0 left-auto group text-base pt-10 pr-3">
                        次
                      </span>
                      <ErrorMsg
                        message={errors.loanBanks?.[index]?.frequency?.message}
                      />
                    </label>
                  </div>
                  <div className="w-40 relative mr-6 mt-2">
                    <label className="ml-1 text-xs">
                      还本付息方式
                      <select
                        {...register(`loanBanks.${index}.paymentMethod`)}
                        className="w-full text-base dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                      >
                        <option value="Annuity">等额本息</option>
                        <option value="Linear">等额本金</option>
                        <option value="Mannual">约定还款</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-flow-row gap-1 w-full">
                    <NestedArray
                      nestIndex={index}
                      {...{
                        control,
                        register,
                        setValue,
                        getValues,
                        errors,
                      }}
                    />
                  </div>
                  <div className="relative mt-10">
                    <button
                      className="btn bg-red-500 enabled:hover:bg-red-600 text-white rounded disabled:opacity-75"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      取消此银行
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="col-span-2 row-span-1 flex flex-wrap ml-10 mt-1">
              {getValues("loanBanks")?.length > 2 ? (
                ""
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // index != loanBanks.length ?? append();
                    append();
                  }}
                  className="btn bg-emerald-500 enabled:hover:bg-emerald-600 text-white rounded disabled:opacity-75"
                >
                  <span className="hidden xs:block ml-1 mr-1">
                    新增一个银行
                  </span>
                </button>
              )}
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

export default FormFinancing;
