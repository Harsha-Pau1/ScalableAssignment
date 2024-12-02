# Learning-Platform-API
### By,
- Aparna Singh (2023SL93033)
- Gagan prajapati (2023SL93103)
- Harsha Paul (2023SL93077)
- Rakshith Kumar (2023SL93019)
- Sukhmanjot kaur (2023SL93038)
---
### Overview
The Learning Portal API is designed to simplify the management of learning platforms. It includes functionality to:
- Register, update, and delete users.
- Manage courses and enrollments.
- Track users' progress in courses.
#### Key Features:
- Secure Access: JWT-based authentication.
- Role-based Permissions: Restrict access based on roles (Student, Admin).
- Detailed Data Models: Comprehensive endpoints for managing users, courses, and progress.

  [Link to SwaggerHub](https://app.swaggerhub.com/apis/h.harsha.p.paul/LearningportalAPI/1.0.0#/)
  
  [Link to Postman Collection](https://team-rockstar-6610.postman.co/workspace/Learninng-portal~de969ec7-ed0c-457e-a09d-5c4fca8ea6bd/collection/30929132-31528d5b-019c-4d7d-8767-1da8233e6cc0?action=share&creator=30929132)
--- 
### User stories
- User Management
1. As a new user,I want to register an account through the Learning Portal,so that I can access the platform's features. 
2. As a registered user,I want to log in with my credentials, so that I can access my personalized dashboard and courses. 
3. As an admin, I want to retrieve a list of all registered users, so that I can manage user accounts efficiently. 
4. As a student, I want to view my profile details, so that I can verify my personal information. 
5. As an admin, I want to update a user's details, so that I can correct errors or update information. 
6. As an admin, I want to delete a user from the system, so that I can maintain an accurate user database. 
7. As an admin, I want to search for a user by their email address, so that I can quickly retrieve specific user details.
8. As a student, I want to see the list of courses I am enrolled in, so that I can manage my learning progress. 
9. As a student, I want to see a list of courses I have completed, so that I can track my achievements. 
10. As an admin, I want to view all students in the system, so that I can oversee their activities. 

- Progress Management
1. As a student, I want to record my progress in a course, so that I can keep track of what I’ve learned. 
2. As a student, I want to view my progress in a specific course, so that I can see how far I’ve come. 
3. As a student, I want to update my progress in a course, so that it reflects my current learning status. 
4. As a student, I want to delete my progress in a specific course, so that I can reset and start over if needed. 
5. As an admin, I want to retrieve all progress records of a user, so that I can analyze their learning journey.
6. As an admin, I want to view all progress records for a specific course, so that I can evaluate its effectiveness. 

- Course Management
1. As an admin, I want to add new courses to the portal, so that students have more learning opportunities. 
2. As a student, I want to view all available courses, so that I can choose which ones to enroll in. 
3. As a student, I want to view the details of a specific course, so that I can decide if it aligns with my learning goals. 
4. As an admin, I want to modify the details of a course, so that I can keep its content up-to-date. 
5. As an admin, I want to delete a course from the system, so that outdated or irrelevant courses are removed. 
6. As an admin, I want to see a list of users enrolled in a specific course, so that I can monitor student participation.
7. As a student, I want to enroll in a course, so that I can access its materials and start learning. 
8. As a student, I want to filter available courses by their level, so that I can find courses that match my current knowledge.
9. As a student, I want to deregister myself from a course.

---
### API Overview
The Learning Portal API provides endpoints for managing users, courses, progress, and authentication in a structured and secure manner. 
- User 

| Endpoint                                  | Method | Summary                                                                                              |
|-------------------------------------------|--------|------------------------------------------------------------------------------------------------------|
| `/api/v1/register`                        | POST   | Register a new user                                                                                  | 
| `/api/v1/login`                           | POST   | Login by Authenticate a user and provide a JWT token.                                                |
| `/api/v1/users`                           | GET    | Retrieve a list of all registered users (Admin only).                                                |
| `/api/v1/users/{id}`                      | GET    | Retrieve details of a specific user (Admin or logged in student).                                    |
| `/api/v1/users/{id}`                      | PUT    | Update a specific user's details (Admin or logged in student).                                       |
| `/api/v1/users/{id}`                      | DELETE | Remove a user from the system (Admin only).                                                          |
| `/api/v1/users/{email}`                   | GET    | Retrieve the details of a user using their email (Admin only).                                       |
| `/api/v1/users/{id}/courses`              | GET    | Retrieve the list of courses a specific user is enrolled in (Admin or logged in student).            |
| `/api/v1/users/{id}/completed-courses`    | GET    | Retrieve the list of courses a specific user has completed (Admin or logged in student).             |
| `/api/v1/users/students`                  | GET    | Retrieve a list of all students (Admin only).                                                        |

- Progress 

| Endpoint                                  | Method | Summary                                                                                              |
|-------------------------------------------|--------|------------------------------------------------------------------------------------------------------|
| `/api/v1/progress`                        | POST   | Record progress for a user in a course (Admin or logged in student).                                 | 
| `/api/v1/progress/{userId}/{courseId}`    | GET    | Retrieve the progress of a user in a specific course (Admin or logged in student).                   |
| `/api/v1/progress/{userId}/{courseId}`    | PUT    | Update the progress of a user in a specific course (Admin or logged in student).                     |
| `/api/v1/progress/{userId}/{courseId}`    | DELETE | Remove a user's progress in a specific course(Admin or logged in student).                           |
| `/api/v1/progress/user/{userId}`          | GET    | Retrieve all progress records for a specific user(Admin or logged in student).                       |
| `/api/v1/progress/course/{courseId}`      | GET    | Retrieve all progress records for a specific course (Admin only).                                    |

- Courses

| Endpoint                                  | Method | Summary                                                                                              |
|-------------------------------------------|--------|------------------------------------------------------------------------------------------------------|
| `/api/v1/courses`                         | POST   | Add a new course (Admin only).                                                                       | 
| `/api/v1/courses`                         | GET    | Retrieve all available courses (Admin or logged in student).                                         |
| `/api/v1/courses/{Id}`                    | GET    | Retrieve details of a specific course (Admin or logged in student).                                  |
| `/api/v1/courses/{Id}`                    | PUT    | Modify details of a specific course (Admin only).                                                    |
| `/api/v1/courses/{Id}`                    | DELETE | Remove a course from the system (Admin only)                                                         |
| `/api/v1/courses/{Id}/enrolled-users`     | GET    | Retrieve the list of users enrolled in a specific course (Admin only).                               |
| `/api/v1/courses/{Id}/enroll`             | POST   | Enroll a student in a specific course (Admin or logged in student).                                  |
| `/api/v1/courses/{Id}/deregister`         | DELETE | Deregister a student from a course (Admin or logged in student).                                  |
| `/api/v1/courses/level/{level}`           | GET    | Retrieve all available courses of a particular level (Admin or logged in student).                   |


