// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "../../../components/Navbar/page"; // Import Navbar Component


// const HrDashboard = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (!userData) {
//       router.push("/auth/login");
//       return;
//     }

//     const parsedUser = JSON.parse(userData);
//     if (parsedUser.role !== 2) {
//       router.push("/dashboard");
//       return;
//     }

//     setUser(parsedUser);
//   }, [router]);

//   return (
//     <Navbar />>
//     <div>
//       <h1>HR Dashboard</h1>
//       <p>Welcome, {user?.name}!</p>
//       <button onClick={() => router.push("/dashboard/create-user")}>Create Employee</button>
//     </div>
//   );
// };

// export default HrDashboard;
