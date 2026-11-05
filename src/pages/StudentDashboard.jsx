
import { useMemo, useState } from "react";
import {
  BookOpen, CalendarDays, CheckCircle2, Clock,
  ExternalLink, GraduationCap, LogOut, FileText,
  AlertCircle, Sun, Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { getAssignments, saveAssignments } from "../utils/localStorage";

function StudentDashboard() {
  const { currentUser, logout } = useAuth();

  const [assignments, setAssignments] = useState(() => getAssignments());
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [message, setMessage] = useState("");

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

  const myAssignments = useMemo(
    () => assignments.filter((assignment) =>
      assignment.assignedTo.includes(currentUser.id)
    ),
    [assignments, currentUser]
  );

  const totalAssignments = myAssignments.length;

  const submittedCount = myAssignments.filter(
    (assignment) =>
      assignment.submissions?.[currentUser.id] === "submitted"
  ).length;

  const pendingCount = totalAssignments - submittedCount;

  const progress = totalAssignments
    ? Math.round((submittedCount / totalAssignments) * 100)
    : 0;

  const filteredAssignments = myAssignments.filter((assignment) => {
    const submitted =
      assignment.submissions?.[currentUser.id] === "submitted";

    if (statusFilter === "submitted") return submitted;
    if (statusFilter === "pending") return !submitted;
    return true;
  });

  const today = new Date().toLocaleDateString("en-CA");

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment);
    setMessage("");
  };

  const handleConfirmSubmission = () => {
    if (!selectedAssignment) return;

    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id !== selectedAssignment.id) return assignment;

      return {
        ...assignment,
        submissions: {
          ...assignment.submissions,
          [currentUser.id]: "submitted",
        },
      };
    });

    const saved = saveAssignments(updatedAssignments);

    if (saved) {
      setAssignments(updatedAssignments);
      setMessage("Assignment submitted successfully!");
    } else {
      setMessage("Unable to save your submission. Please try again.");
    }

    setSelectedAssignment(null);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${
      darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className={`mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl p-5 shadow-sm ${panelClass}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className={mutedClass}>Welcome, {currentUser?.name}</p>
            </div>
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
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Assignments", value: totalAssignments, icon: BookOpen },
            { label: "Submitted", value: submittedCount, icon: CheckCircle2 },
            { label: "Pending", value: pendingCount, icon: Clock },
            { label: "Completion", value: `${progress}%`, icon: GraduationCap },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`rounded-xl p-5 shadow-sm ${panelClass}`}>
                <div className="flex items-center justify-between">
                  <p className={mutedClass}>{item.label}</p>
                  <Icon className="text-blue-600" />
                </div>
                <h2 className="mt-3 text-3xl font-bold">{item.value}</h2>
              </div>
            );
          })}
        </section>

        {/* Overall Progress */}
        <section className={`mb-6 rounded-xl p-6 shadow-sm ${panelClass}`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Overall Assignment Progress</h2>
            <span className="font-bold text-blue-500">{progress}%</span>
          </div>

          <div className={`h-4 overflow-hidden rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}>
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className={`mt-2 text-sm ${mutedClass}`}>
            {submittedCount} of {totalAssignments} assignments completed
          </p>
        </section>

        {/* Assignments */}
        <section className={`rounded-xl p-6 shadow-sm ${panelClass}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">My Assignments</h2>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={`rounded-lg border p-2 ${
                darkMode ? "border-gray-600 bg-gray-700 text-white" : "bg-white"
              }`}
              aria-label="Filter assignments"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>

          {message && (
            <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const isSubmitted =
                assignment.submissions?.[currentUser.id] === "submitted";

              const isOverdue = assignment.dueDate < today && !isSubmitted;

              return (
                <article
                  key={assignment.id}
                  className={`rounded-xl border p-5 transition hover:shadow-md ${
                    darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                        <FileText size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">{assignment.title}</h3>
                        <p className={`mt-1 text-sm ${mutedClass}`}>
                          {assignment.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {isSubmitted ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Submitted
                        </span>
                      ) : isOverdue ? (
                        <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          <AlertCircle size={14} /> Overdue
                        </span>
                      ) : (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`mt-4 flex items-center gap-2 text-sm ${mutedClass}`}>
                    <CalendarDays size={17} />
                    Due Date: {assignment.dueDate}
                    {isOverdue && (
                      <span className="font-semibold text-red-500">
                        (Deadline Passed)
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {assignment.driveLink && (
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <ExternalLink size={16} /> Open Assignment
                      </a>
                    )}

                    {!isSubmitted && (
                      <button
                        onClick={() => handleSubmitClick(assignment)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Submit Assignment
                      </button>
                    )}

                    {isSubmitted && (
                      <span className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                        <CheckCircle2 size={17} /> Submission Completed
                      </span>
                    )}
                  </div>
                </article>
              );
            })}

            {filteredAssignments.length === 0 && (
              <div className="py-10 text-center">
                <BookOpen size={40} className="mx-auto mb-3 text-gray-400" />
                <p className={mutedClass}>No assignments found.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={Boolean(selectedAssignment)}
        title="Confirm Assignment Submission"
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleConfirmSubmission}
      />
    </div>
  );
}

export default StudentDashboard;
