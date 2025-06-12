🏥 Patient Appointment Booking System 📖 Overview A full-stack web application to manage doctor-patient appointments seamlessly. Patients can register, log in, and book, reschedule, or cancel appointments. Doctors (Admins) can manage and update appointment statuses.

This project is built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) and secured using JWT authentication.

🚀 Tech Stack 🔧 Backend: Node.js

Express.js

MongoDB

Mongoose

JWT (JSON Web Tokens)

Dotenv

🎨 Frontend: React.js

React Router DOM

Context API

Tailwind CSS

🛠️ Setup Instructions 📦 Backend Setup Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file in the backend/ directory with the following content:

ini Copy Edit
 PORT=5000
 MONGO_URI=mongodb://localhost:27017/appointmentdb 
 JWT_SECRET=your_jwt_secret_key Start the backend server: npm run dev

💻 Frontend Setup Navigate to the frontend folder: cd frontend

Install dependencies: npm install

Start the frontend development server: npm start

🌐 Usage Open your browser and go to: http://localhost:3000

Sign up or log in as a Patient or Doctor

Patients can:

Book new appointments

Reschedule or cancel existing appointments

Doctors/Admins can:

View and manage all appointments

![Screenshot (939)](https://github.com/user-attachments/assets/569987d7-4dd5-40f3-9564-8cbdeb2142ba)
![Screenshot (940)](https://github.com/user-attachments/assets/e17cacb2-2d5b-40c6-896a-10f61b43f771)
![Screenshot (941)](https://github.com/user-attachments/assets/9ae97ad8-d31d-442c-8648-bd4f139d7444)


