# O.P.V.P. Kolhampur Public School Management System

A comprehensive school management system built with React.js and Node.js.

## Features

- **Student Management**: Admission, records, attendance tracking
- **Staff Management**: Teacher profiles, salary management
- **Academic Management**: Classes, exams, results
- **Financial Management**: Fee collection, income/expense tracking
- **Communication**: Notices, gallery, contact forms
- **Dashboard**: Analytics and statistics

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary for image storage
- JWT authentication

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd kolahmpur
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
- Copy `.env.example` to `.env` in backend folder
- Add your MongoDB URI and Cloudinary credentials

5. Run the application
```bash
# Backend (from backend folder)
npm run dev

# Frontend (from frontend folder)
npm run dev
```

## Default Admin Login
- Username: admin
- Password: admin123

## School Information
**O.P.V.P. Kolhampur Public School**
Kolhampur Bazar Nawabganj, Gonda
Uttar Pradesh 271319

## License
This project is licensed under the MIT License.