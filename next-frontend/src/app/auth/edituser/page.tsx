// components/EditEmployeeForm.tsx
import React, { useState, useEffect } from 'react';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: number;
}

interface EditEmployeeFormProps {
  employee: Employee;
  onClose: () => void;
  onEmployeeUpdated: (updatedEmployee: Employee) => void;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employee, onClose, onEmployeeUpdated }) => {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [role, setRole] = useState(employee.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:9000/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role }),
      });

      if (res.ok) {
        const updatedEmployee = await res.json();
        onEmployeeUpdated(updatedEmployee.updatedEmployee);
        onClose();
      } else {
        alert("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl mb-4">Edit Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value={2}>HR</option>
              <option value={3}>Employee</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
