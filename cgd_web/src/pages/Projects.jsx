import React from "react";
import { useEffect, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";

import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import FormProjects from "../forms/FormProjects";
import ProjectService from "../services/ProjectService";
import FetchClient from "../clients/FetchClient";

function Projects() {
  const [projects, setProjects] = useState([]);
  const projectsService = new ProjectService(FetchClient);
  const nav = useNavigate();

  const fetchProjectsResult = async () => {
    try {
      const projectsResult = await projectsService.get_all();
      setProjects(projectsResult);
      if (
        !projectsResult ||
        (projectsResult.detail && projectsResult.detail === "Token expired")
      )
        nav("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjectsResult();
  }, []);

  const ProjectListItem = projects.map((project) => (
    <li
      key={project.id}
      className="box-border border-b-2 pt-0.5 pb-3 px-3 mt-3"
    >
      <Link
        className=" font-medium text-m text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
        to={`/projects/${project.id}/basic-args`}
      >
        <span className="font-medium w-full">{project.name}</span>
      </Link>
      <span className="w-full ml-auto text-xs font-normal text-gray-500 dark:text-gray-400">
        {project.description}
      </span>
    </li>
  ));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner />
            <div className="grid grid-rows-2 grid-flow-col gap-4">
              {ProjectListItem.length > 0 ? (
                <div className="row-span-2">
                  <h2 className="text-xl">现有项目</h2>
                  <ul className="mt-10">{ProjectListItem}</ul>
                </div>
              ) : (
                <div className="row-span-2">
                  <h2 className="text">请新建一个项目</h2>
                </div>
              )}
              <div className="row-span-2"></div>
              <div className="row-span-2">
                <FormProjects />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Projects;
