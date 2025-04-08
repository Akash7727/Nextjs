"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar/page";


const Profile = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Extract and decode token payload
        setUser({ name: payload.name, email: payload.email });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleClose = () => {
    router.push("/auth/dashboard"); // Redirects to /auth/dashboard
  };

  return (
    <>
      <Sidebar />
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-black p-6 rounded-lg w-96 text-center text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          {user ? (
            <>
              <p className="text-lg mb-2"><strong>Name:</strong> {user.name}</p>
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
