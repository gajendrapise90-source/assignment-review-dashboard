
const STORAGE_KEY = "assignments";

const initialAssignments = [
  {
    id: "assignment1",
    title: "React Fundamentals",
    description: "Complete a React component and props exercise.",
    dueDate: "2026-11-06",
    driveLink: "https://drive.google.com/",
    createdBy: "admin1",
    assignedTo: ["student1", "student2", "student3", "student4", "student5"],
    submissions: {
      student1: "submitted",
      student2: "not submitted",
      student3: "submitted",
      student4: "not submitted",
      student5: "submitted",
    },
  },
  {
    id: "assignment2",
    title: "JavaScript ES6",
    description: "Practice array methods, promises and async/await.",
    dueDate: "2026-11-08",
    driveLink: "https://drive.google.com/",
    createdBy: "admin1",
    assignedTo: ["student1", "student2", "student3"],
    submissions: {
      student1: "not submitted",
      student2: "submitted",
      student3: "not submitted",
    },
  },
  {
    id: "assignment3",
    title: "HTML and CSS Design",
    description: "Create a responsive landing page.",
    dueDate: "2026-11-10",
    driveLink: "https://drive.google.com/",
    createdBy: "admin2",
    assignedTo: ["student1", "student2", "student3", "student4", "student5"],
    submissions: {
      student1: "submitted",
      student2: "not submitted",
      student3: "not submitted",
      student4: "submitted",
      student5: "not submitted",
    },
  },
];

export function getAssignments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }

    saveAssignments(initialAssignments);
    return initialAssignments;
  } catch (error) {
    console.error("Unable to load assignments:", error);
    return [];
  }
}

export function saveAssignments(assignments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    return true;
  } catch (error) {
    console.error("Unable to save assignments:", error);
    return false;
  }
}
