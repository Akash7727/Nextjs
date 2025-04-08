"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaTasks, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const [role, setRole] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(parseInt(storedRole));
    }
  }, []);

  const getDashboardTitle = () => {
    switch (role) {
      case 1:
        return "Super Admin Dashboard";
      case 2:
        return "HR Dashboard";
      case 3:
        return "Employee Dashboard";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-gray-900 h-screen p-4 w-64 fixed text-white">
      <h1 className="text-xl font-bold mb-6">{getDashboardTitle()}</h1>

      <ul className="space-y-4">
        <li>
          <Link href="/auth/dashboard/Profile" className="flex items-center p-2 rounded hover:bg-gray-700">
            <FaUser className="mr-2" /> Profile
          </Link>
        </li>

        {/* Show "Employees" only for Super Admin (Role 1) & HR (Role 2) */}
        {role !== 3 && (
          <li>
            <Link href="/auth/dashboard/employee" className="flex items-center p-2 rounded hover:bg-gray-700">
              <FaUser className="mr-2" /> Employees
            </Link>
          </li>
        )}

        {/* Show "Projects" only for Super Admin (Role 1) & Employee (Role 3) */}
       
          <li>
            <Link href="/auth/project" className="flex items-center p-2 rounded hover:bg-gray-700">
              <FaTasks className="mr-2" /> Projects
            </Link>
          </li>
      
        


    

        <li>
          <Link href="/auth/dashboard/attendance" className="flex items-center p-2 rounded hover:bg-gray-700">
            <FaCog className="mr-2" /> Attendance
          </Link>
        </li>
  
        <li>
          <button
            className="flex items-center w-full text-left p-2 rounded hover:bg-red-600 mt-4"
            onClick={() => {
              localStorage.clear();
                document.cookie="token = ;"  
              router.push("/auth/login");
            }}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
