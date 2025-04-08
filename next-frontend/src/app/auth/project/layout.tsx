"use client";

import Sidebar from "../../components/Sidebar/page";
import { ReactNode } from "react";

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
   
      <Sidebar />

  
      <div className="ml-64 w-full p-6">{children}</div>
    </div>
  );
};

export default ProjectLayout;
