import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function FormProjectName({ preloadedValues }) {
  //   const basicArgsService = new BasicArgsService(FetchClient);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues,
  });

  const onSubmit = (data) => {
    // console.log(data);
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Customers
        </h2>
      </header>
      <div className="p-3">
        <form
          className="border-slate-200 dark:border-slate-700 flex flex-wrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative w-24 mr-6 mt-10">
            <label htmlFor="project_name" className="ml-1">
              项目名称
            </label>
            <input
              {...register("projectName")}
              id="project_name"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
            />
          </div>
          <div className="relative mr-6 w-24 mt-10">
            <label htmlFor="project_desc" className="ml-1">
              项目简介
            </label>
            <input
              {...register("description")}
              id="project_desc"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded-md border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
            />
          </div>
          <button>submit</button>
        </form>
      </div>
    </div>
  );
}

export default FormProjectName;
