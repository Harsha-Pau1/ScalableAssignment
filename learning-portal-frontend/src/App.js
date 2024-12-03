// App.js
import React, { useState } from "react";
import UserList from "./components/UserList";
import CourseList from "./components/CourseList";
import ProgressForm from "./components/ProgressForm";
import ProgressList from "./components/ProgressList"; // Import ProgressList component

const App = () => {
  const [userId, setUserId] = useState("1"); // Example user ID
  const [courseId, setCourseId] = useState("101"); // Example course ID

  return (
    <div>
      <h1>Welcome to the Learning Portal</h1>

      {/* Render existing components */}
      <UserList />
      <CourseList />
      <ProgressForm />

      {/* Render ProgressList component with userId and courseId */}
      <ProgressList userId={userId} courseId={courseId} />
    </div>
  );
};

export default App;
