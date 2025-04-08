"use client"; 

import {  useState } from "react";
import { useRouter } from "next/navigation"; 

const Login = () => {
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
//   return <div>Loading...</div>;
// }
const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("role", data.role); 
      localStorage.setItem("userId", data.userId); // ✅ Store user ID
      document.cookie = `token = ${data.token}`;

      // Redirect based on role
      if (data.role === 1) {
        router.push("/auth/dashboard/");
      } else if (data.role === 2) {
        router.push("/auth/dashboard/");
      } else if (data.role === 3) {
        router.push("/auth/dashboard/");
      }
    } else {
      alert(data.message || "Invalid login credentials");
    }
  } catch  {
    alert("Error logging in. Please try again.");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-black p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Login</h2>
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
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4">
          Donot have an account?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
