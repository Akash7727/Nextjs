import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Custom hook to check authentication and role
const useAuth = (requiredRole: number) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (!token) {
      // If no token is found, redirect to login page
      router.push("/login");
      return;
    }

    if (role && parseInt(role) !== requiredRole) {
      // If the role doesn't match the required role, redirect to an error page or other route
      router.push("/unauthorized");
      return;
    }

    setUserRole(parseInt(role));
    setIsAuthenticated(true);
  }, [router, requiredRole]);

  return { isAuthenticated, userRole };
};

export default useAuth;
