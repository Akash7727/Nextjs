"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Navbar from "@/app/components/Navbar/page"; // Import Navbar Component



const SuperAdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 1) {
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  return (
    <div>
      {/* <Navbar /> */}
      <h1>Super Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <button onClick={() => router.push("/dashboard/create-user")}>Create User</button>
    </div>
  );
};

export default SuperAdminDashboard;
