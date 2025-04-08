"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar/page";

const Employee = () => {
  const [employees, setEmployees] = useState<
    { id: number; name: string; email: string; role: number }[]
  >([]);
  const [role, setRole] = useState<number | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: 3 });
  const [editUser, setEditUser] = useState<{ id: number; name: string; email: string; role: number } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Stored Role:", storedRole);
    if (storedRole) {
      const parsedRole = parseInt(storedRole);
      setRole(parsedRole);
      fetchEmployees(parsedRole);
    }
  }, []);

  const fetchEmployees = async (userRole: number) => {
    try {
      const res = await fetch(`http://localhost:9000/employees?role=${userRole}`);
      const data = await res.json();
      console.log("Fetched Employees:", data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

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
        alert("Employee added successfully!");
        setNewUser({ name: "", email: "", password: "", role: 3 });
        setShowAddUserForm(false);
        fetchEmployees(role as number);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error adding employee.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:9000/employees/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Employee deleted successfully!");
        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
      } else {
        alert("Error deleting employee.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user: { id: number; name: string; email: string; role: number }) => {
    setEditUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;

    try {
      const res = await fetch(`http://localhost:9000/employees/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editUser.name, email: editUser.email, role: editUser.role }),
      });

      if (res.ok) {
        alert("Employee updated successfully!");
        setEditUser(null);
        fetchEmployees(role as number);
      } else {
        alert("Error updating employee.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Employee List</h2>
          {role !== 3 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowAddUserForm(true)}
            >
              Add User
            </button>
          )}
        </div>

        {/* Edit User Form */}
        {editUser && (
          <div className="bg-gray-800 p-6 rounded shadow-lg mb-4">
            <h3 className="text-lg font-bold mb-4">Edit Employee</h3>
            <input
              type="text"
              className="w-full p-2 border mb-2 bg-gray-700 text-white"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <input
              type="email"
              className="w-full p-2 border mb-2 bg-gray-700 text-white"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <select
              className="w-full p-2 border mb-2 bg-gray-700 text-white"
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: parseInt(e.target.value) })}
            >
              <option value={2}>HR</option>
              <option value={3}>Employee</option>
            </select>
            <div className="flex space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleUpdateUser}>
                Save
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEditUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add User Form */}
        {showAddUserForm && (
          <div className="bg-gray-800 p-6 rounded shadow-lg mb-4">
            <h3 className="text-lg font-bold mb-4">Add Employee</h3>
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
              <option value={2}>HR</option>
              <option value={3}>Employee</option>
            </select>
            <div className="flex space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleAddUser}>
                Save
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowAddUserForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Employee List */}
        <table className="w-full bg-gray-900 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-t border-gray-700">
                <td className="p-2">{employee.name}</td>
                <td className="p-2">{employee.email}</td>
                <td className="p-2">{employee.role === 2 ? "HR" : "Employee"}</td>
                <td className="p-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteUser(employee.id)}>
                    Delete
                  </button>
                  <button className="bg-gray-500 text-white px-3 py-1 rounded ml-2" onClick={() => handleEditUser(employee)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
