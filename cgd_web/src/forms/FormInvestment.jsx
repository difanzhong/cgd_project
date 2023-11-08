import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";

import InvestmentService from "../services/InvestmentService";
import FetchClient from "../clients/FetchClient";

function FormInvestment({ project_id }) {
  const {
    register,
    control,
    handleSubmit,
    setValues,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      progress: [
        {
          total: 0,
          assets: 0,
          others: 0,
          creditable: 0,
        },
      ],
    },
  });

  const investmentService = new InvestmentService(FetchClient);
  const [investment, setInvestment] = useState([]);

  const fetchInvestmentResult = async () => {
    try {
      const investmentResult = await investmentService.get(project_id);
      setInvestment(investmentResult);
    } catch (error) {
      console.log(error);
    }
  };

  const { fields, append, remove } = useFieldArray({
    name: "investmentProgress",
    control,
  });

  useEffect(() => {
    fetchInvestmentResult();
  }, []);

  useEffect(() => {
    if (investment) {
      reset(investment[0]);
    }
  }, [investment]);

  const onSubmit = (data) => {
    data.project_id = project_id;
    if (isDirty) {
      data.id ? investmentService.put(data) : investmentService.post(data);
    }
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 mt-10">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          投资
        </h2>
      </header>
      <div className="p-3">
        <form
          className="border-slate-200 dark:border-slate-700 flex flex-wrap ml-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative w-48 ml-5 mt-5">
            <label className="ml-1 text-xs">
              建设投资计算方式
              <select
                {...register("calculationMethod", {
                  required: {
                    value: true,
                    message: "必填",
                  },
                })}
                id="cal_period"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              >
                <option value="manual">手动输入投资</option>
              </select>
              <ErrorMsg message={errors.calculationMethod?.message} />
            </label>
          </div>
          <div className="relative w-48 ml-5 mt-5">
            <label className="ml-1 text-xs">
              资金投入方式
              <select
                {...register("investmentMethod", {
                  required: {
                    value: true,
                    message: "必填",
                  },
                })}
                id="cal_period"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              >
                <option value="by_ratio">按比例投入</option>
              </select>
              <ErrorMsg message={errors.investmentMethod?.message} />
            </label>
          </div>
          <div className="relative w-48 mt-5 ml-5">
            <label className="ml-1">
              {"\b"}
              <select
                {...register("ratioMethod", {
                  required: {
                    value: true,
                    message: "必填",
                  },
                })}
                id="cal_period"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              >
                <option value="dynamic_ratio">资金按动态投资比例</option>
              </select>{" "}
            </label>
            <ErrorMsg message={errors.ratioMethod?.message} />
          </div>
          <div className="relative w-20 mt-5 ml-5">
            <label className="ml-1 text-xs">
              {"\b"}
              <input
                {...register("ratioValue", {
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
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                type="number"
                min="0"
                max="10000"
                step=".0001"
              />
              <span className="absolute inset-0 text-base left-auto group pt-10 pr-3">
                %
              </span>
              <ErrorMsg message={errors.ratioValue?.message} />
            </label>
          </div>

          {/* 利息计算 */}
          <div className="w-full ml-5 mt-10">
            <label className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2 w-full">
              利息计算
            </label>
            <div className="relative mr-6 w-48 mt-5">
              <div className="ml-1 text-xs">建设期利息计算方式</div>
              <select
                {...register("interestsCalculationMethod", {
                  required: {
                    value: true,
                    message: "必填",
                  },
                })}
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              >
                <option value="auto">自动计算利息</option>
              </select>

              <ErrorMsg message={errors.interestsCalculationMethod?.message} />
            </div>
          </div>

          {/* 利息计算年度 */}
          {fields.map((field, index) => {
            return (
              <section
                key={field.id}
                className="w-full flex flex-wrap mt-10 ml-5"
              >
                <label className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2 w-full">
                  第 {index + 1} 年
                </label>

                <div className="relative mr-6 w-24 mt-2">
                  <label className="ml-1 text-xs">
                    年度投资
                    <input
                      {...register(`investmentProgress.${index}.total`, {
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
                      })}
                      type="number"
                      step=".0001"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    />
                    <span className="absolute inset-0 text-base left-auto group pt-10 pr-3">
                      万
                    </span>
                    <ErrorMsg
                      message={
                        errors.investmentProgress?.[index]?.total?.message
                      }
                    />
                  </label>
                </div>
                <div className="relative mr-6 w-24 mt-2">
                  <label className="ml-1 text-xs">
                    无形资产
                    <input
                      {...register(`investmentProgress.${index}.assets`, {
                        required: {
                          value: true,
                          message: "必填",
                        },
                        min: {
                          value: 0,
                          message: "1～10000之间",
                        },
                        max: {
                          value: 1000,
                          message: "1~10000之间",
                        },
                      })}
                      type="number"
                      step=".0001"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    />
                    <span className="absolute text-base inset-0 left-auto group pt-10 pr-3">
                      万
                    </span>
                    <ErrorMsg
                      message={
                        errors.investmentProgress?.[index]?.assets?.message
                      }
                    />
                  </label>
                </div>
                <div className="relative mr-6 w-24 mt-2">
                  <label className="ml-1 text-xs">
                    其他资产
                    <input
                      {...register(`investmentProgress.${index}.others`, {
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
                      })}
                      type="number"
                      step=".0001"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    />
                    <span className="absolute text-base inset-0 left-auto group pt-10 pr-3">
                      万
                    </span>
                    <ErrorMsg
                      message={
                        errors.investmentProgress?.[index]?.others?.message
                      }
                    />
                  </label>
                </div>
                <div className="relative mr-6 w-24 mt-2">
                  <label className="ml-1 text-xs">
                    可抵税金
                    <input
                      {...register(`investmentProgress.${index}.creditable`, {
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
                      step=".0001"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    />
                    <span className="absolute text-base inset-0 left-auto group pt-10 pr-3">
                      万
                    </span>
                    <ErrorMsg
                      message={
                        errors.investmentProgress?.[index]?.creditable?.message
                      }
                    />
                  </label>
                </div>
                <div className="relative mr-6 w-24 mt-2">
                  <label className="ml-1 text-xs">
                    所占比例
                    <input
                      {...register(`investmentProgress.${index}.ratio`, {
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
                      step=".00001"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    />
                    <span className="absolute text-base inset-0 left-auto group pt-10 pr-3">
                      %
                    </span>
                    <ErrorMsg
                      message={
                        errors.investmentProgress?.[index]?.ratio?.message
                      }
                    />
                  </label>
                </div>
                <div className="relative mr-6 w-24 mt-2">
                  <label className="ml-2 text-xs">
                    <div className="h-2"></div>
                    <button
                      className="btn bg-red-500 enabled:hover:bg-red-600 text-white rounded disabled:opacity-75 w-full"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      取消
                    </button>
                  </label>
                </div>
              </section>
            );
          })}
          <div className="relative w-full ml-10 mt-10">
            {getValues("investmentProgress")?.length > 2 ? (
              ""
            ) : (
              <button
                type="button"
                onClick={() => {
                  append();
                }}
                className="btn bg-emerald-500 enabled:hover:bg-emerald-600 text-white rounded disabled:opacity-75"
              >
                <span className="hidden xs:block ml-1 mr-1">新增一年</span>
              </button>
            )}
          </div>
          <div className="relatived w-full ml-5 mt-20 mb-5 ">
            <button className="btn bg-indigo-500 enabled:hover:bg-indigo-600 text-white rounded disabled:opacity-75">
              <span className="hidden xs:block ml-3 mr-3">提交</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormInvestment;
