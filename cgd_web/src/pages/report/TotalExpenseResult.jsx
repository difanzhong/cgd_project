import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";

import Banner from "../../partials/Banner";
import ResultService from "../../services/ResultService";
import FetchClient from "../../clients/FetchClient";
import { useParams } from "react-router-dom";

const TotalExpenseResult = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenseResult, setExpenseResult] = useState([]);
  const { project_id } = useParams();

  const expenseResultService = new ResultService(FetchClient);
  const fetchExpenseResult = async () => {
    try {
      const expenseResult = await expenseResultService.getExpenseResult(
        project_id
      );
      setExpenseResult(expenseResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenseResult();
    console.log(expenseResult);
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
                    colSpan={String(expenseResult.constructionYear)}
                    className="border px-6 py-4 dark:border-neutral-500"
                    key="jianshe"
                  >
                    建设期
                  </th>
                  <th
                    colSpan={String(
                      expenseResult.calculationYear -
                        expenseResult.constructionYear
                    )}
                    className="border px-6 py-4 dark:border-neutral-500"
                    key="yunxing"
                  >
                    运行期
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

                  {Array.from(Array(expenseResult.calculationYear), (e, i) => {
                    return (
                      <th
                        scope="col"
                        className="border-r px-6 py-4 dark:border-neutral-500"
                        key={i}
                      >
                        第 <span className="w-2 h-2">{i + 1}</span> 年
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    材料费
                  </td>
                  {expenseResult?.material ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {expenseResult.material
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {expenseResult?.material?.map((e, i) => {
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
                    人工工资及福利
                  </td>
                  {expenseResult?.salaryWithWelfare ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {expenseResult.salaryWithWelfare
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {expenseResult?.salaryWithWelfare?.map((e, i) => {
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
                    修理费
                  </td>
                  {expenseResult?.repair ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {expenseResult.repair
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {expenseResult?.repair?.map((e, i) => {
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
                    保险费
                  </td>
                  {expenseResult?.insurance ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {expenseResult.insurance
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}
                  {expenseResult?.insurance?.map((e, i) => {
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
                    其他费用1
                  </td>
                  {expenseResult?.other1 ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {expenseResult.other1
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}

                  {expenseResult?.other1?.map((e, i) => {
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
                    其他费用2
                  </td>
                  {expenseResult?.other2 ? (
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      {expenseResult.other2
                        .reduce((acc, cur) => acc + cur, 0)
                        .toFixed(2)}
                    </td>
                  ) : (
                    <td>0</td>
                  )}

                  {expenseResult?.other2?.map((e, i) => {
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
                    折旧费
                  </td>
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    摊销费
                  </td>

                  {expenseResult?.depreciation?.map((e, i) => {
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
                {expenseResult?.loan?.map((e, i) => {
                  return (
                    <tr
                      className="border-b dark:border-neutral-500"
                      key={i + 1}
                    >
                      <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                        借贷{i + 1}
                      </td>
                      {e.map((value, index) => {
                        return (
                          <td
                            key={index}
                            className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                          >
                            {value.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
};

export default TotalExpenseResult;
