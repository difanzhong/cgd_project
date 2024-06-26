import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import Banner from "../../partials/Banner";
import FormBasicArgs from "../../forms/FormBasicArgs";
import FormInvestment from "../../forms/FormInvestment";

function BasicArgs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { project_id } = useParams();

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
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <FormBasicArgs project_id={project_id} />
            <FormInvestment project_id={project_id} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default BasicArgs;
