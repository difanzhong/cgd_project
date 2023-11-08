import { React, useEffect } from "react";
import AuthService from "../services/AuthService";
import FetchClient from "../clients/FetchClient";
import { useNavigate, Navigate } from "react-router-dom";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const PrivateRoute = ({ children }) => {
  // Add your own authentication on the below line.
  const goLogin = () => {
    nav("/login");
  };
  const nav = useNavigate();
  const cookie = cookies.get("access_token");
  const authService = new AuthService(FetchClient);
  const user = authService.getUser();
  console.log(user);

  if (cookie && user) {
    return children;
  }

  if (!cookie) {
    return <Navigate to="/login" />;
  }

  if (user.detail && user.detail === "Invalid Credentials") {
    return <Navigate to="/login" />;
  }
  return <Navigate to="/login" />;

  // useEffect(() => {

  //   console.log(cookie);

  //   if (!cookie) {
  //     console.log("no cooke");
  //     nav("/login");
  //   }

  //   if (!user) goLogin();
  // });

  // return children;
};

export default PrivateRoute;
