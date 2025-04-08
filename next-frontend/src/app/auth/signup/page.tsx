"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  // const [loading,setLoading]=useState(true);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.push("/auth/dashboard"); 
  //   } else {
  //     setLoading(false);
  //   }
  // }, [router]);
  

  // if(loading){
  //   return <div>Loading</div>;
  // }
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:9000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Redirecting to Login...");
        router.push("/auth/login");
      } else {
        alert(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black-100">
      <div className="bg-wh p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Signup</h2>
        <input
          type="text"
          placeholder="Name"
          className="mb-2 p-2 border rounded w-full"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border rounded w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 border rounded w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-4">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
