import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";

import BasicArgsService from "../services/BasicArgsService";
import FetchClient from "../clients/FetchClient";

function FormBasicArgs({ project_id }) {
  const basicArgsService = new BasicArgsService(FetchClient);
  const [basicArgs, setBasicArgs] = useState([]);

  const fetchBasicArgsResult = async () => {
    try {
      const basicArgsResult = await basicArgsService.get(project_id);

      console.log(basicArgsResult);

      setBasicArgs(basicArgsResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBasicArgsResult();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({});

  useEffect(() => {
    if (basicArgs) {
      reset(basicArgs[0]);
    }
  }, [basicArgs]);

  const onSubmit = (data) => {
    data.project_id = project_id;
    // console.log();
    if (isDirty) {
      data.id ? basicArgsService.put(data) : basicArgsService.post(data);
    }
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          参数
        </h2>
      </header>
      <div className="p-3">
        <form
          className="border-slate-200 dark:border-slate-700 flex flex-wrap ml-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-rows-2 grid-flow-col gap-4">
            <div className="col-span-2 row-span-1 flex flex-wrap">
              <div className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase mb-5 mt-5 w-full">
                基础信息
              </div>
              <div className="relative mr-6 w-24">
                <label htmlFor="con_period" className="ml-1 text-xs">
                  建设期
                  <input
                    {...register("constructionYear", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 1,
                        message: "1～3之间",
                      },
                      max: {
                        value: 3,
                        message: "1~3之间",
                      },
                    })}
                    id="con_period"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    max="100"
                    min="0"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    年
                  </span>
                  <ErrorMsg message={errors.constructionYear?.message} />
                </label>
              </div>
              <div className="relative w-24 mr-6">
                <label htmlFor="cal_period" className="ml-1 text-xs">
                  计算期
                  <input
                    {...register("calculationYear", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 1,
                        message: "1～30之间",
                      },
                      max: {
                        value: 30,
                        message: "1~30之间",
                      },
                    })}
                    id="cal_period"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    max="100"
                    min="0"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    年
                  </span>
                  <ErrorMsg message={errors.calculationYear?.message} />
                </label>
              </div>

              <div className="relative mr-6 w-40">
                <label htmlFor="capacity" className="ml-1 text-xs">
                  装机容量
                  <input
                    {...register("installationCapacity", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 0.0,
                        message: "不能小于零",
                      },
                    })}
                    id="capacity"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                    type="number"
                    step=".000001"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    MW
                  </span>
                  <ErrorMsg message={errors.installationCapacity?.message} />
                </label>
              </div>
            </div>
            <div className="col-span-2 row-span-1 flex flex-wrap">
              <div className="relative mr-6 w-40">
                <label htmlFor="start_date" className="ml-1 text-xs">
                  起始日期
                  <input
                    {...register("startDate", {
                      onChange: (e) => {
                        const startDate = new Date(e.target.value);
                        const NoOfMonth = 12 - startDate.getMonth();
                        setValue("monthsInStartYear", NoOfMonth);
                      },
                      required: "必填",
                    })}
                    id="start_date"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-3"
                    type="date"
                    min="2020-01-02"
                  />
                  <ErrorMsg message={errors.startDate?.message} />
                </label>
              </div>
              <div className="relative mr-6 w-24">
                <label htmlFor="monthsInStartYear" className="ml-1 text-xs">
                  始年施工
                  <input
                    {...register("monthsInStartYear", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 1,
                        message: "1~12之间",
                      },
                      max: {
                        value: 12,
                        message: "1~12之间",
                      },
                    })}
                    id="num_of_month_first"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                    type="number"
                    min="1"
                    max="12"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    个月
                  </span>
                  <ErrorMsg message={errors.monthsInStartYear?.message} />
                </label>
              </div>
              <div className="relative mr-6 w-24">
                <label htmlFor="num_of_month_last" className="ml-1 text-xs">
                  末年施工
                  <input
                    {...register("monthsInEndYear", {
                      required: {
                        value: true,
                        message: "必填",
                      },
                      min: {
                        value: 1,
                        message: "1~12之间",
                      },
                      max: {
                        value: 12,
                        message: "1~12之间",
                      },
                    })}
                    id="num_of_month_last"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-10"
                    type="number"
                    min="1"
                    max="12"
                  />
                  <span className="text-base absolute inset-0 left-auto group pt-10 pr-3">
                    个月
                  </span>
                  <ErrorMsg message={errors.monthsInEndYear?.message} />
                </label>
              </div>
            </div>
            <div className="col-span-1 row-span-2">
              <div className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase mt-5 mb-5 w-full">
                基准收益率
              </div>
              <div className="relative mr-6 w-42 mt-2">
                <label htmlFor="capital_profit" className="ml-1 text-xs">
                  资本金
                  <input
                    {...register("capital", {
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
                    id="capital_profit"
                    className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                    type="number"
                    step=".00001"
                    min="0"
                    max="100"
                  />
                  <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                    %
                  </span>
                  <ErrorMsg message={errors.capital?.message} />
                </label>
              </div>
              <div className="col-span-1 row-span-2 flex flex-wrap mt-2">
                <div className="relative mr-6 w-20 mt-2">
                  <label htmlFor="before_tax_profit" className="ml-1 text-xs">
                    所得税前
                    <input
                      {...register("profitBeforeTax", {
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
                      id="before_tax_profit"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                      type="number"
                      min="1"
                      max="12"
                    />
                    <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                      %
                    </span>
                    <ErrorMsg message={errors.profitBeforeTax?.message} />
                  </label>
                </div>
                <div className="relative mr-6 w-20 mt-2">
                  <label htmlFor="after_tax_profit" className="ml-1 text-xs">
                    所得税后
                    <input
                      {...register("profitAfterTax", {
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
                      id="after_tax_profit"
                      className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                      type="number"
                      min="1"
                      max="12"
                    />
                    <span className="absolute inset-0 left-auto group pt-10 pr-3 text-base">
                      %
                    </span>
                    <ErrorMsg message={errors.profitAfterTax?.message} />
                  </label>
                </div>
              </div>
            </div>
            {/* 装机进度  to developer later
      {fields.map((field, index) => {
        return (
          <section key={field.id} className="w-full flex flex-wrap mt-5">
            <label className="text-l font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2 w-full">
              第 {index + 1} 年
            </label>

            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                一月
                <input
                  {...register(`progressYear.${index}.jan`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                二月
                <input
                  {...register(`progressYear.${index}.feb`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                三月
                <input
                  {...register(`progressYear.${index}.mar`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                四月
                <input
                  {...register(`progressYear.${index}.apr`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                五月
                <input
                  {...register(`progressYear.${index}.may`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                六月
                <input
                  {...register(`progressYear.${index}.jun`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                七月
                <input
                  {...register(`progressYear.${index}.jul`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                八月
                <input
                  {...register(`progressYear.${index}.aug`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                九月
                <input
                  {...register(`progressYear.${index}.sep`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                十月
                <input
                  {...register(`progressYear.${index}.oct`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                十一月
                <input
                  {...register(`progressYear.${index}.nov`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <div className="relative mr-6 w-24 mt-2">
              <label className="ml-1">
                十二月
                <input
                  {...register(`progressYear.${index}.dec`)}
                  type="number"
                  className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-11"
                />
                <span className="absolute inset-0 left-auto group pt-10 pr-3">
                  MW
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                append();
              }}
            >
              append
            </button>
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </section>
        );
      })}
*/}{" "}
          </div>
          <div className="w-full mt-20 mb-5">
            <button
              disabled={!isDirty}
              className="btn bg-indigo-500 enabled:hover:bg-indigo-600 text-white rounded disabled:opacity-75"
            >
              <span className="hidden xs:block ml-3 mr-3">提交</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormBasicArgs;
