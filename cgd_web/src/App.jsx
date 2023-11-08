import React, { useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Login from "./pages/userAuth/Login";
import Register from "./pages/userAuth/Register";
import Projects from "./pages/Projects";
import BasicArgs from "./pages/basic_data/BasicArgs";
import CapitalSource from "./pages/basic_data/CapitalSource";
import TotalCost from "./pages/basic_data/TotalCost";
import TotalExpenseResult from "./pages/report/TotalExpenseResult";
import TotalInvestResult from "./pages/report/TotalInvestResult";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          exact
          path="/projects/:project_id/basic-args"
          element={
            <PrivateRoute>
              {" "}
              <BasicArgs />{" "}
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/projects/:project_id/capital-source"
          element={
            <PrivateRoute>
              <CapitalSource />{" "}
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/projects/:project_id/total-cost"
          element={
            <PrivateRoute>
              <TotalCost />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/projects/:project_id/expense-result"
          element={
            <PrivateRoute>
              <TotalExpenseResult />
            </PrivateRoute>
          }
        />
        <Route
          exact
          path="/projects/:project_id/invest-result"
          element={
            <PrivateRoute>
              <TotalInvestResult />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
