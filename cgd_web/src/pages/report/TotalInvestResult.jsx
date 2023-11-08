import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import Banner from "../../partials/Banner";
import ResultService from "../../services/ResultService";
import FetchClient from "../../clients/FetchClient";
import { useParams } from "react-router-dom";

const TotalInvestResult = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [investmentResult, setInvestmentResult] = useState([]);
  const { project_id } = useParams();

  const resultService = new ResultService(FetchClient);
  const fetchResult = async () => {
    try {
      const investResult = await resultService.getInvestResult(project_id);
      setInvestmentResult(investResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResult();
    console.log(investmentResult);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        project_id={project_id}
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          project_id={project_id}
        />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full overflow-x-auto">
            <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  ></th>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  ></th>
                  <th
                    colSpan={String(investmentResult.constructionYear)}
                    className="border px-6 py-4 dark:border-neutral-500"
                    key="jianshe"
                  >
                    建设期
                  </th>
                </tr>
                <tr>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    <span className="w-2 h-2">总计</span>
                  </th>

                  {Array.from(
                    Array(
                      investmentResult.constructionPeriodYearlyInvestmentList
                    ),
                    (e, i) => {
                      return (
                        <th
                          scope="col"
                          className="border-r px-6 py-4 dark:border-neutral-500"
                          key={i}
                        >
                          第 <span className="w-2 h-2">{i + 1}</span> 年
                        </th>
                      );
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    项目总投资
                  </td>
                  {investmentResult?.totalInvestment ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {investmentResult.totalInvestment
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {investmentResult?.totalInvestment?.map((e, i) => {
                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                      >
                        {e.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    建设投资
                  </td>
                  {investmentResult?.constructionPeriodCapital ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {investmentResult.constructionPeriodCapital
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {investmentResult?.constructionPeriodCapital?.map((e, i) => {
                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                      >
                        {e.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    建设期利息
                  </td>
                  {investmentResult?.constructionPeriodYearlyInvestmentList ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {investmentResult.constructionPeriodYearlyInvestmentList
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {investmentResult?.constructionPeriodYearlyInvestmentList?.map(
                    (e, i) => {
                      return (
                        <td
                          key={i}
                          className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                        >
                          {e.toFixed(2)}
                        </td>
                      );
                    }
                  )}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    资金筹措
                  </td>
                  {investmentResult?.constructionPeriodYearlyCapitalList ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {investmentResult.constructionPeriodYearlyCapitalList
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {investmentResult?.constructionPeriodYearlyCapitalList?.map(
                    (e, i) => {
                      return (
                        <td
                          key={i}
                          className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                        >
                          {e.toFixed(2)}
                        </td>
                      );
                    }
                  )}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    项目资本金
                  </td>
                  {investmentResult?.constructionPeriodYearlyCapitalList ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {investmentResult.constructionPeriodYearlyCapitalList
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}

                  {investmentResult?.constructionPeriodYearlyCapitalList?.map(
                    (e, i) => {
                      return (
                        <td
                          key={i}
                          className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                        >
                          {e.toFixed(2)}
                        </td>
                      );
                    }
                  )}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    用于建设投资
                  </td>
                  {investmentResult?.debtForConstruction ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {investmentResult.debtForConstruction
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}

                  {investmentResult?.debtForConstruction?.map((e, i) => {
                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                      >
                        {e.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    其中：投资方
                  </td>
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    债务资金
                  </td>

                  {investmentResult?.debtForConstruction?.map((e, i) => {
                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                      >
                        {e.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    用于建设投资
                  </td>

                  {investmentResult?.debtForConstruction?.map((e, i) => {
                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                      >
                        {e.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    用于建设期利息
                  </td>

                  {investmentResult?.debtForInterests?.map((e, i) => {
                    return (
                      <td
                        key={i}
                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                      >
                        {e.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
};

export default TotalInvestResult;
