"use client";
import { useState } from "react";

const AddUser = ({ onUserAdded }: { onUserAdded: () => void }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: 3, // Default role: Employee
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("User added successfully!");
        setNewUser({ name: "", email: "", password: "", role: 3 }); // Reset form
        onUserAdded(); // Refresh employee list
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded shadow-lg mb-4">
      <h3 className="text-lg font-bold mb-4">Add User</h3>
      <input
        type="text"
        placeholder="First Name"
        className="w-full p-2 border mb-2 bg-gray-700 text-white"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border mb-2 bg-gray-700 text-white"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-2 bg-gray-700 text-white"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <select
        className="w-full p-2 border mb-2 bg-gray-700 text-white"
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: parseInt(e.target.value) })}
      >
        <option value={3}>Employee</option>
      
      </select>
      <div className="flex space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddUser}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddUser;
