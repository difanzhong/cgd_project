import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { useForm } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";
import AuthService from "../services/AuthService";
import FetchClient from "../clients/FetchClient";
import { useNavigate } from "react-router-dom";

function Login() {
  const cookies = new Cookies();
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const authService = new AuthService(FetchClient);
  const nav = useNavigate();

  const fetchAuthResult = async (data) => {
    try {
      const authResult = await authService.getToken(data);
      // console.log(authResult);
      cookies.set("access_token", authResult.access_token);
      // console.log("cookies", cookies.get("access_token"));
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    await fetchAuthResult(data);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-slate-200 dark:border-slate-700 flex-wrap"
      >
        <div className="relative w-72 ml-5 mt-5">
          <label htmlFor="email" className="ml-1 text-xs">
            邮箱
            <input
              id="email"
              name="email"
              type="email"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              {...register("username", {
                required: "请输入您的邮箱",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              onKeyUp={() => {
                trigger("username");
              }}
            />
            <ErrorMsg message={errors.username?.message} />
          </label>
        </div>
        <div className="relative w-72 ml-5 mt-5">
          <label htmlFor="password" className="ml-1 text-xs">
            密码
            <input
              name="password"
              id="password"
              type="password"
              autoComplete="off"
              className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
              {...register("password", {
                required: "请输入您的密码",
                pattern: {
                  value:
                    "^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[d]){1,})(?=.(.*.[W]){1,})(?!.*s).{8,}$",
                  message: "密码中至少有一个数字和一个特殊字符",
                },
                minLength: {
                  value: 8,
                  message: "密码要大于8位",
                },
                maxLength: {
                  value: 20,
                  message: "密码要小于20位",
                },
              })}
              onKeyUp={() => {
                trigger("password");
              }}
            />
            <ErrorMsg message={errors.password?.message} />
          </label>
        </div>
        <div className="relatived w-full ml-5 mt-10 mb-5 ">
          <button className="btn bg-indigo-500 enabled:hover:bg-indigo-600 text-white rounded disabled:opacity-75">
            <span className="hidden xs:block ml-3 mr-3">登陆</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default Login;
