"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import Navbar from "../../components/Navbar/page";

const Dashboard = () => {
  const [role, setRole] = useState<number | null>(null);
  // const [showProfile, setShowProfile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}

      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-black shadow-lg rounded-lg p-6 w-96 text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            {role === 1 && "Super Admin Dashboard"}
            {role === 2 && "HR Dashboard"}
            {role === 3 && "Employee Dashboard"}
          </h2>
          <p className="text-lg text-white">Welcome</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




// export default Dashboard;
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "../../components/Navbar/page"; // ✅ Import Navbar Component

// const Dashboard = () => {
//   const [user, setUser] = useState<{ name: string; email: string } | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedRole = localStorage.getItem("role");

//     if (!token) {
//       alert("You must be logged in!");
//       router.push("/auth/login");
//       return;
//     }

//     if (storedRole) {
//       const roleNumber = parseInt(storedRole, 10);

//       // ✅ Redirect based on Role
//       // switch (roleNumber) {
//       //   case 1:
//       //     router.push("/dashboard/superadmin");
//       //     break;
//       //   case 2:
//       //     router.push("/dashboard/hr");
//       //     break;
//       //   case 3:
//       //     router.push("/dashboard/");
//       //     break;
//       //   default:
//       //     alert("Invalid role detected. Logging out.");
//       //     localStorage.removeItem("token");
//       //     localStorage.removeItem("role");
//       //     router.push("/auth/login");
//       //     return;
//       // }
//     }

//     // ✅ Fetch user data from backend
//     fetch("http://localhost:9000/dashboard", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.user) {
//           setUser(data.user);
//         } else {
//           alert("Session expired. Please log in again.");
//           localStorage.removeItem("token");
//           localStorage.removeItem("role");
//           router.push("/auth/login");
//         }
//       })
//       .catch(() => {
//         alert("Error fetching user data.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         router.push("/auth/login");
//       });
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     alert("Logged out successfully!");
//     router.push("/auth/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar /> {/* ✅ Navbar updates dynamically */}
      
//       <div className="flex flex-col items-center justify-center p-6">
//         <div className="bg-black shadow-lg rounded-lg p-6 w-96 text-center">
//           <h2 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h2>
//           {user ? (
//             <>
//               <p className="text-lg mb-2">Welcome, <strong>{user.name}</strong> 👋</p>
//               <p className="text-gray-700">Email: <strong>{user.email}</strong></p>
//               <button
//                 className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <p className="text-gray-500">Loading...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
