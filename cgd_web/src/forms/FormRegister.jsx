import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { useForm } from "react-hook-form";
import ErrorMsg from "../errors/ErrorMsg";
import AuthService from "../services/AuthService";
import FetchClient from "../clients/FetchClient";
import { redirect } from "react-router-dom";

function Register() {
  const cookies = new Cookies();

  const {
    handleSubmit,
    formState: { errors },
    trigger,
    register,
    watch,
  } = useForm();

  const authService = new AuthService(FetchClient);
  const [error, setError] = useState([]);

  const fetchAuthResult = async (data) => {
    try {
      const authResult = await authService.register(data);
      console.log(authResult);
      if (authResult.status_code >= 400) setError(authResult.detail);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(fetchAuthResult)}
        className="border-slate-200 dark:border-slate-700 flex flex-wrap"
      >
        <h5>{error ?? error}</h5>
        <div>
          <div className="relative w-72 ml-5 mt-5">
            <label className="ml-1 text-xs">
              请输入您的邮箱:
              <input
                id="email"
                name="email"
                type="email"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                required={true}
                {...register("username", {
                  required: "邮箱不能为空",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "邮箱格式不正确",
                  },
                })}
                onKeyUp={() => {
                  trigger("username");
                }}
              ></input>
              <ErrorMsg message={errors.username?.message} />
            </label>
          </div>
          <div className="relative w-72 ml-5 mt-5">
            <label className="ml-1 text-xs">
              请输入您的密码：
              <input
                name="password"
                id="password"
                type="password"
                autoComplete="off"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                required={true}
                {...register("password", {
                  required: "密码不能为空",
                  pattern: {
                    value:
                      "^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[d]){1,})(?=(.*[W]){    1,})(?!.*s).{8,}$",
                    message:
                      "密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符",
                  },
                  minLength: {
                    value: 8,
                    message: "密码必须大于8个字符",
                  },
                  maxLength: {
                    value: 20,
                    message: "密码必须小于20个字符",
                  },
                })}
                onKeyUp={() => {
                  trigger("password");
                }}
              />
              <ErrorMsg message={errors.password?.message} />
            </label>
          </div>
          <div className="relative w-72 ml-5 mt-5">
            <label className="ml-1 text-xs">
              请再次输入密码：
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("password", "") || "两次输入的密码不一致",
                })}
                autoComplete="off"
                onPaste={(e) => {
                  e.preventDefault();
                  return false;
                }}
                required={true}
                onKeyUp={() => {
                  trigger("confirmPassowrd");
                }}
              />
              <ErrorMsg message={errors.confirmPassword?.message} />
            </label>
          </div>
          <div className="relative w-72 ml-5 mt-5">
            <label className="ml-1 text-xs">
              请输入您的姓名：
              <input
                name="name"
                type="name"
                required={true}
                defaultValue=""
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 rounded border-slate-200 dark:border-slate-700 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none mt-1 py-3 pl-3 pr-8"
                {...register("name", { required: "姓名不能为空" })}
                onKeyUp={() => {
                  trigger("name");
                }}
              />
              <ErrorMsg message={errors.name?.message} />
            </label>
          </div>
          <div className="relatived w-full ml-5 mt-20 mb-5 ">
            <button className="btn bg-emerald-500 enabled:hover:bg-emerald-600 text-white rounded disabled:opacity-75">
              <span className="hidden xs:block ml-3 mr-3">提交注册</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Register;
