
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { users } from "../data/users";
import { getAssignments, saveAssignments } from "../utils/localStorage";
import {
  Plus, Pencil, Trash2, LogOut, Search, Filter, Sun, Moon,
} from "lucide-react";

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const students = users.filter((user) => user.role === "student");

  const [assignments, setAssignments] = useState(() => getAssignments());

  const emptyForm = {
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
    assignedTo: students.map((student) => student.id),
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    setDarkMode((previous) => {
      const updated = !previous;
      localStorage.setItem("darkMode", String(updated));
      return updated;
    });
  };

  const panelClass = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-900";

  const mutedClass = darkMode ? "text-gray-300" : "text-gray-500";

  const inputClass = `w-full rounded-lg border p-3 ${
    darkMode
      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
      : "border-gray-300 bg-white text-gray-900"
  }`;

  const filteredAssignments = assignments
    .filter((assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((assignment) => {
      const total = assignment.assignedTo.length;
      const submitted = Object.values(assignment.submissions || {})
        .filter((status) => status === "submitted").length;

      if (statusFilter === "completed") {
        return total > 0 && submitted === total;
      }

      if (statusFilter === "pending") {
        return submitted < total;
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = Number(a.id.replace("assignment-", "")) || 0;
      const timeB = Number(b.id.replace("assignment-", "")) || 0;

      return sortOrder === "newest"
        ? timeB - timeA
        : timeA - timeB;
    });

  const updateAssignments = (updated) => {
    const saved = saveAssignments(updated);

    if (saved) {
      setAssignments(updated);
      setMessage("Assignment saved successfully!");
    } else {
      setMessage("Unable to save. Please try again.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleStudentChange = (studentId) => {
    setForm((previous) => ({
      ...previous,
      assignedTo: previous.assignedTo.includes(studentId)
        ? previous.assignedTo.filter((id) => id !== studentId)
        : [...previous.assignedTo, studentId],
    }));
  };

  const handleSelectAll = (checked) => {
    setForm((previous) => ({
      ...previous,
      assignedTo: checked ? students.map((student) => student.id) : [],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.assignedTo.length === 0) {
      setMessage("Please select at least one student.");
      return;
    }

    let updated;

    if (editingId) {
      updated = assignments.map((assignment) => {
        if (assignment.id !== editingId) return assignment;

        const submissions = Object.fromEntries(
          form.assignedTo.map((id) => [
            id,
            assignment.submissions?.[id] || "not submitted",
          ])
        );

        return { ...assignment, ...form, submissions };
      });
    } else {
      const newAssignment = {
        id: `assignment-${Date.now()}`,
        ...form,
        createdBy: currentUser.id,
        submissions: Object.fromEntries(
          form.assignedTo.map((id) => [id, "not submitted"])
        ),
      };

      updated = [newAssignment, ...assignments];
    }

    updateAssignments(updated);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (assignment) => {
    setForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      driveLink: assignment.driveLink,
      assignedTo: [...assignment.assignedTo],
    });

    setEditingId(assignment.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    updateAssignments(
      assignments.filter((assignment) => assignment.id !== id)
    );
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${
      darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className={`mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl p-5 shadow-sm ${panelClass}`}>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className={mutedClass}>Welcome, {currentUser?.name}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-200 hover:text-gray-900"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className={`rounded-xl p-5 shadow-sm ${panelClass}`}>
            <p className={mutedClass}>Total Assignments</p>
            <h2 className="mt-2 text-3xl font-bold">{assignments.length}</h2>
          </div>

          <div className={`rounded-xl p-5 shadow-sm ${panelClass}`}>
            <p className={mutedClass}>Total Students</p>
            <h2 className="mt-2 text-3xl font-bold">{students.length}</h2>
          </div>

          <div className={`rounded-xl p-5 shadow-sm ${panelClass}`}>
            <p className={mutedClass}>Total Submissions</p>
            <h2 className="mt-2 text-3xl font-bold">
              {assignments.reduce(
                (total, assignment) =>
                  total +
                  Object.values(assignment.submissions || {}).filter(
                    (status) => status === "submitted"
                  ).length,
                0
              )}
            </h2>
          </div>
        </section>

        {/* Create / Edit Assignment */}
        <section className={`mb-8 rounded-xl p-6 shadow-sm ${panelClass}`}>
          <h2 className="mb-5 text-xl font-bold">
            {editingId ? "Edit Assignment" : "Create New Assignment"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">Assignment Title</label>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter assignment title"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Description</label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter assignment description"
                rows="3"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium">Due Date</label>
                <input
                  required
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Google Drive Link</label>
                <input
                  required
                  type="url"
                  name="driveLink"
                  value={form.driveLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Student Selection */}
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <label className="font-semibold">Assign To Students</label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.assignedTo.length === students.length}
                    onChange={(event) => handleSelectAll(event.target.checked)}
                  />
                  Select All Students
                </label>
              </div>

              <div className={`grid gap-3 rounded-lg border p-4 sm:grid-cols-2 md:grid-cols-3 ${
                darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200"
              }`}>
                {students.map((student) => (
                  <label key={student.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.assignedTo.includes(student.id)}
                      onChange={() => handleStudentChange(student.id)}
                    />
                    {student.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                <Plus size={18} />
                {editingId ? "Update Assignment" : "Create Assignment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                    setMessage("");
                  }}
                  className="rounded-lg border px-5 py-3"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {message && (
              <p className="text-sm font-medium text-blue-500">{message}</p>
            )}
          </form>
        </section>

        {/* Manage Assignments */}
        <section className={`rounded-xl p-6 shadow-sm ${panelClass}`}>
          <h2 className="mb-5 text-xl font-bold">Manage Assignments</h2>

          {/* Search, Filter, Sort */}
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search assignment..."
                aria-label="Search assignments"
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <Filter size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter assignments by status"
                className={`${inputClass} pl-10`}
              >
                <option value="all">All Assignments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort assignments"
              className={inputClass}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <p className={`mb-4 text-sm ${mutedClass}`}>
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </p>

          <div className="space-y-5">
            {filteredAssignments.map((assignment) => {
              const assignedCount = assignment.assignedTo.length;

              const submittedCount = Object.values(
                assignment.submissions || {}
              ).filter((status) => status === "submitted").length;

              const progress = assignedCount
                ? Math.round((submittedCount / assignedCount) * 100)
                : 0;

              return (
                <div
                  key={assignment.id}
                  className={`rounded-xl border p-5 ${
                    darkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{assignment.title}</h3>
                      <p className={`mt-1 ${mutedClass}`}>
                        {assignment.description}
                      </p>
                      <p className={`mt-2 text-sm ${mutedClass}`}>
                        Due: {assignment.dueDate}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700"
                        aria-label="Edit assignment"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="rounded-lg bg-red-100 p-2 text-red-700"
                        aria-label="Delete assignment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Completion Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Class Completion</span>
                      <strong>{progress}%</strong>
                    </div>

                    <div className={`h-3 overflow-hidden rounded-full ${
                      darkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}>
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className={`mt-2 text-sm ${mutedClass}`}>
                      {submittedCount} of {assignedCount} students submitted
                    </p>
                  </div>

                  {/* Student Status */}
                  <div className="mt-4 border-t border-gray-500 pt-4">
                    <h4 className="mb-3 font-semibold">Student Status</h4>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {assignment.assignedTo.map((studentId) => {
                        const student = students.find(
                          (item) => item.id === studentId
                        );

                        if (!student) return null;

                        const submitted =
                          assignment.submissions?.[studentId] === "submitted";

                        return (
                          <div
                            key={studentId}
                            className={`flex items-center justify-between rounded-lg p-3 text-sm ${
                              darkMode ? "bg-gray-600" : "bg-gray-50"
                            }`}
                          >
                            <span>{student.name}</span>
                            <span className={
                              submitted
                                ? "font-medium text-green-500"
                                : "font-medium text-orange-500"
                            }>
                              {submitted ? "Submitted" : "Pending"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAssignments.length === 0 && (
              <p className={`py-8 text-center ${mutedClass}`}>
                No matching assignments found.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
