"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
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
        return "Dashboard"; // Fallback title
    }
  };

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">{getDashboardTitle()}</h1>

      
    
    
    </nav>
  );
};

export default Navbar;
