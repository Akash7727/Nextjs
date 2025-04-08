"use client";
import { useState, useEffect } from "react";

const ProjectPage = () => {
  const [role, setRole] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [projectData, setProjectData] = useState({
    projectName: "",
    description: "",
    assignedTo: "",
    clientName: "",
    status: "In Progress",
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");
    if (storedRole) setRole(parseInt(storedRole));
    if (storedUserId) setUserId(parseInt(storedUserId));
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:9000/assign-to");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    if (role === 1 || role === 2) fetchEmployees();
  }, [role]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:9000/projects?role=${role}&userId=${userId}`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (role !== null && userId !== null) fetchProjects();
  }, [role, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!userId) {
      setMessage("Error: No user ID found. Please log in again.");
      return;
    }

    const url = editProjectId
      ? `http://localhost:9000/projects/${editProjectId}`
      : "http://localhost:9000/projects";
    const method = editProjectId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectData,
          assignedTo: projectData.assignedTo ? parseInt(projectData.assignedTo) : null,
          assignedBy: userId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(editProjectId ? "Project updated successfully!" : "Project assigned successfully!");
        setProjectData({ projectName: "", description: "", assignedTo: "", clientName: "", status: "In Progress" });
        setEditProjectId(null);
      } else {
        setMessage(result.message || "Error saving project");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error saving project");
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:9000/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Project deleted successfully!");
        setProjects(projects.filter((project) => project.id !== projectId));
      } else {
        setMessage("Error deleting project");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error deleting project");
    }
  };

  const handleEdit = (project: any) => {
    setEditProjectId(project.id);
    setProjectData({
      projectName: project.projectName,
      description: project.description,
      assignedTo: project.assignedTo || "",
      clientName: project.clientName,
      status: project.status,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>

      {role === 1 || role === 2 ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block font-semibold">Project Name:</label>
            <input
              type="text"
              value={projectData.projectName}
              onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
              className="w-full p-2 text-white border rounded"
              required
            />
          </div>

          <div>
            <label className="block  font-semibold  text-white">Project Description:</label>
            <textarea
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              className="w-full p-2 text-white border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Assign to Employee:</label>
            <select
              value={projectData.assignedTo}
              onChange={(e) => setProjectData({ ...projectData, assignedTo: e.target.value })}
              className="w-full p-2 text-white border rounded"
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id} className="bg-black text-white">
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Client Name:</label>
            <input
              type="text"
              value={projectData.clientName}
              onChange={(e) => setProjectData({ ...projectData, clientName: e.target.value })}
              className="w-full p-2 text-white border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Project Status:</label>
            <select
              value={projectData.status}
              onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
              className="w-full p-2 text-white border rounded"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editProjectId ? "Update Project" : "Assign Project"}
          </button>
        </form>
      ) : null}

      {/* Project Table */}
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      {projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 border">Project Name</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Client</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Assigned By</th>
                <th className="px-4 py-2 border">Assigned To</th>
                {role === 1 || role === 2 ? <th className="px-4 py-2 border">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="bg-gray-700 hover:bg-gray-600">
                  <td className="px-4 py-2 border">{project.projectName}</td>
                  <td className="px-4 py-2 border">{project.description}</td>
                  <td className="px-4 py-2 border">{project.clientName}</td>
                  <td className="px-4 py-2 border">{project.status}</td>
                  <td className="px-4 py-2 border">
                    {project.assigner?.name} ({project.assigner?.role === 1 ? "Super Admin" : "HR"})
                  </td>
                  <td className="px-4 py-2 border">
                    {project.assigned ? project.assigned.name : "Not Assigned"}
                  </td>
                  {role === 1 || role === 2 ? (
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No projects found.</p>
      )}

      {message && <p className="mt-4 text-yellow-400">{message}</p>}
    </div>
  );
};

export default ProjectPage;
