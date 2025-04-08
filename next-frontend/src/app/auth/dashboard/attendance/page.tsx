"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

interface Attendance {
  id: number;
  date: string;
  timeIn: string;
  timeOut: string;
  user: {
    name: string;
    email: string;
  };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: number;
}

const AttendancePage = () => {
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [records, setRecords] = useState<Attendance[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [showAbsent, setShowAbsent] = useState<boolean>(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (!storedUserId || !storedRole) {
      alert("User info missing. Please login again.");
      return;
    }

    setUserId(storedUserId);
    setRole(storedRole);

    if (storedRole === "3") {
      getAttendance(storedUserId, storedRole);
    }

    if (storedRole === "1" || storedRole === "2") {
      fetchEmployees(storedRole);
    }
  }, []);

  const fetchEmployees = async (role: string) => {
    try {
      const res = await axios.get(`http://localhost:9000/employees?role=${role}`);
      setEmployees(res.data);
      
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const getAttendance = async (uid: string, role: string, targetId?: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9000/api/attendance`, {
        headers: {
          userId: uid,
          role,
          ...(targetId && { targetUserId: targetId }),
        },
      });

      const allRecords = response.data || [];
      setRecords(allRecords);

      const today = new Date().toISOString().split("T")[0];
      const hasTodayRecord = allRecords.some((record: Attendance) => {
        return record.date.startsWith(today);
      });

      setAlreadySubmitted(hasTodayRecord);
      setShowAbsent(!hasTodayRecord);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Failed to fetch attendance:", error);
      alert(error?.response?.data?.message || "Error loading attendance records");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = e.target.value;
    setSelectedEmployeeId(empId);
    if (empId && userId && role) {
      getAttendance(userId, role, empId);
    }
  };

  const handleSubmit = async () => {
    if (alreadySubmitted) {
      alert("You have already submitted attendance for today.");
      return;
    }

    if (!timeIn || !timeOut) {
      alert("Please fill both time fields");
      return;
    }

    if (timeIn >= timeOut) {
      alert("Time Out must be after Time In");
      return;
    }

    if (!userId || !role) {
      alert("Missing user ID or role. Please log in again.");
      return;
    }

    if (role !== "3") {
      alert("Only employees (Role 3) can submit attendance.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:9000/attendance`,
        { timeIn, timeOut },
        { headers: { userId, role } }
      );

      alert("Attendance submitted!");
      setTimeIn("");
      setTimeOut("");
      getAttendance(userId, role);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error submitting attendance:", error);
      alert(error?.response?.data?.message || "Error saving attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Employee Attendance</h1>

      {role === "3" && (
        <div className="bg-gray-800 p-6 rounded-lg shadow w-full max-w-md mb-6">
          {alreadySubmitted ? (
            <p className="text-green-500 font-semibold mb-4">
              ✅ You have already submitted attendance for today.
            </p>
          ) : (
            <>
              <label className="block mb-2">Time In:</label>
              <input
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                className="w-full p-2 text-black rounded mb-4"
              />

              <label className="block mb-2">Time Out:</label>
              <input
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                className="w-full p-2 text-black rounded mb-4"
              />

              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Attendance"}
              </button>
            </>
          )}
        </div>
      )}

      {(role === "1" || role === "2") && (
        <div className="w-full max-w-md mb-6">
          <label className="block mb-2 text-sm">Select Employee to View Attendance:</label>
          <select
            onChange={handleEmployeeSelect}
            value={selectedEmployeeId}
            className="w-full p-2 text-gray rounded"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-black text-white">
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Attendance Records</h2>

        {loading ? (
          <p className="text-gray-400">Loading records...</p>
        ) : records.length === 0 && showAbsent ? (
          <p className="text-red-500 font-bold">❌ Absent Today</p>
        ) : records.length === 0 ? (
          <p className="text-gray-400">No attendance records found.</p>
        ) : role !== "3" && (!selectedEmployeeId || selectedEmployeeId === userId) ? (
          <p className="text-yellow-500 font-semibold">You cannot view your own attendance.</p>
        ) : (
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-left">
                {(role === "1" || role === "2") && <th className="p-2">Employee</th>}
                <th className="p-2">Date</th>
                <th className="p-2">Time In</th>
                <th className="p-2">Time Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-gray-700">
                  {(role === "1" || role === "2") && (
                    <td className="p-2">
                      {record.user?.name}
                      <br />
                      <span className="text-sm text-gray-400">{record.user?.email}</span>
                    </td>
                  )}
                  <td className="p-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-2">{record.timeIn}</td>
                  <td className="p-2">{record.timeOut}</td>
                </tr> 
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
  