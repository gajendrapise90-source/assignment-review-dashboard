# Assignment Review Dashboard

A web-based assignment management system that allows administrators to create and manage assignments while students can view assigned tasks and submit their work.

## Live Demo

Admin Dashboard: 
https://assignment-review-dashboard-pi.vercel.app/admin

GitHub Repository:  
https://github.com/gajendrapise90-source/assignment-review-dashboard

## Features

### Admin
- Admin authentication and role-based access.
- Admin dashboard.
- Create new assignments.
- View assignment lists.
- Edit existing assignments.
- Delete assignments.
- View student submissions.

### Student
- Student authentication.
- Student dashboard.
- View assigned assignments.
- Submit assignments.
- View assignment-related information.

## Technology Stack

- Frontend: React.js
- Build Tool: Vite
- Routing: React Router DOM
- Authentication Context: React Context API
- Backend: Node.js and Express.js (if used in this project)
- Database: MongoDB (if used in this project)
- Deployment: Vercel
- Version Control: Git and GitHub

## Project Setup

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gajendrapise90-source/assignment-review-dashboard.git
   ```

2. Navigate to the project directory:

   ```bash
   cd assignment-review-dashboard
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

### Production Build

To create a production build:

```bash
npm run build
```

## Folder Structure

```text
assignment-review-dashboard/
│
├── public/
│   │   |── favicon.svg
│       └── icons.svg
├── src/
|   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── ConfirmDialog.jsx
│   │   ├── Navbar.jsx
|   |   ├── ProgressBar.jsx
│   │   └── SideBar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── users.js
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Login.jsx
│   │   └── StudentDashboard.jsx
│   │── utilis/
│   │   └── localstorage.js
│   ├── App.css
|   ├── App.jsx
|   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.lock.json
├── package.json
├── README.md
├── vercel.json
└── vite.config.json
```

## Component Architecture

The application follows a component-based architecture.

### App.jsx
- Defines application routes using React Router.
- Controls navigation between Admin and Student dashboards.
- Handles role-based route access.

### AuthContext
- Provides authentication context.
- Maintains the current user information.
- Helps identify Admin and Student roles.

### Login
- Provides the login interface.
- Handles user login.

### AdminDashboard
- Provides assignment management functionality.
- Allows administrators to create, edit and delete assignments.
- Displays student submissions.

### StudentDashboard
- Displays assignments assigned to students.
- Provides assignment submission functionality.

## Key Design Decisions

1. Role-Based Access: Separate Admin and Student dashboards provide role-specific functionality.

2. Component-Based Architecture: React components help organize application functionality and improve maintainability.

3. Centralized Authentication Context: React Context API provides shared authentication information across the application.

4. Client-Side Routing: React Router DOM manages navigation without requiring full-page reloads.

5. Deployment: Vercel provides production hosting and automatic deployment through GitHub integration.

## Testing

The following functionality has been manually tested:

- Admin login and dashboard access.
- Create assignment.
- Edit assignment.
- Delete assignment.
- Student dashboard access.
- View assigned assignments.
- Submit student assignments.
- Admin viewing student submissions.
- Assignment data persistence after refreshing.

## Future Improvements

- Admin approval and rejection of submissions.
- Student feedback and review comments.
- Improved submission tracking.
- Enhanced dashboard analytics.

## Author

Gajendra Pise

GitHub: https://github.com/gajendrapise90-source

LinkedIn: https://www.linkedin.com/in/gajendra-pise-41830b370/
