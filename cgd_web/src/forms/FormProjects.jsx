import React from "react";
import { Cookies } from "react-cookie";
import { useForm } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";
import ProjectService from "../services/ProjectService";
import FetchClient from "../clients/FetchClient";

function FormProjects() {
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const projectService = new ProjectService(FetchClient);

  const fetchProjectResult = async (data) => {
    try {
      const projectResult = await projectService.post(data);
      console.log(projectResult);
      if (projectResult.status_code >= 400) setError(authResult.detail);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    await fetchProjectResult(data);
  };

  return (
    <div className="flex-wrap rounded border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-lg">新建一个项目</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-slate-500 dark:border-slate-700"
      >
        <div className="w-96 ml-5 mt-5">
          <label className="ml-1 text-xs">
            名称：
            <input
              id="p_name"
              name="project_name"
              type="text"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              {...register("name", {
                required: "请填写项目名称",
                maxLength: {
                  value: 20,
                  message: "项目名称不能超过20个字符",
                },
              })}
              onKeyUp={() => {
                trigger("name");
              }}
            />
            <ErrorMsg message={errors.name?.message} />
          </label>
        </div>
        <div className="w-96 ml-5 mt-5">
          <label htmlFor="description" className="ml-1 text-xs">
            项目简介：
            <textarea
              name="p_desc"
              id="project_description"
              type="text"
              autoComplete="off"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              {...register("description", {
                maxLength: {
                  value: 300,
                  message: "项目简介不能超过300个字符",
                },
              })}
            />
            <ErrorMsg message={errors.description?.description} />
          </label>
        </div>
        <div className="w-96 ml-5 mt-5 mb-5 ">
          <button className="btn bg-indigo-500 enabled:hover:bg-indigo-600 text-white rounded disabled:opacity-75 w-96">
            <span className="hidden xs:block ml-3 mr-3">新建</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default FormProjects;
