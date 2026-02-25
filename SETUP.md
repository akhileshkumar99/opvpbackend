# ST Joseph School Management System - Setup Instructions

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher) - Can use MongoDB Atlas cloud or local installation
3. **npm** or **yarn**

## Project Structure

```
st-joseph-school/
├── backend/           # Node.js Express API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── uploads/       # File uploads
│   └── server.js      # Entry point
└── frontend/          # React Vite App
    ├── src/
    │   ├── pages/     # All pages
    │   ├── layouts/   # Layout components
    │   ├── context/   # React contexts
    │   └── services/  # API services
    └── ...
```

## Backend Setup

1. Navigate to backend folder:
   
```
bash
   cd backend
   
```

2. Install dependencies:
   
```
bash
   npm install
   
```

3. Create `.env` file (already created with defaults):
   
```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/st_joseph_school
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   
```

4. Start MongoDB (if using local):
   
```
bash
   # Linux/Mac
   sudo systemctl start mongod
   
   # Windows (if installed as service)
   net start MongoDB
   
```

5. Run the backend server:
   
```
bash
   npm run dev   # Development with nodemon
   # OR
   npm start     # Production
   
```

   Backend will run on http://localhost:5000

## Frontend Setup

1. Navigate to frontend folder:
   
```
bash
   cd frontend
   
```

2. Install dependencies:
   
```
bash
   npm install
   
```

3. Start development server:
   
```
bash
   npm run dev
   
```

   Frontend will run on http://localhost:5173

## Default Admin Login

After starting the server, the default admin account will be created automatically:

- **Username:** admin
- **Password:** admin123

## Building for Production

### Frontend Build
```
bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Backend Production

```
bash
cd backend
npm start
```

## Deployment to Hostinger

### Backend (Node.js Hosting)

1. Upload backend folder contents to Hostinger
2. Set environment variables in Hostinger panel
3. Run `npm install` in the backend directory
4. Point domain to backend

### Frontend (Static Hosting)

1. Build the frontend: `npm run build`
2. Upload the `dist` folder contents to public_html
3. Configure .htaccess for React Router

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/password` - Change password

### Students
- GET `/api/students` - List students
- POST `/api/students` - Add student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Teachers
- GET `/api/teachers` - List teachers
- POST `/api/teachers` - Add teacher
- PUT `/api/teachers/:id` - Update teacher
- DELETE `/api/teachers/:id` - Delete teacher

### Fees
- GET `/api/fees` - List fees
- POST `/api/fees` - Create fee record
- POST `/api/fees/pay/:id` - Pay fee

### Income/Expense
- GET `/api/income` - List income
- POST `/api/income` - Add income
- GET `/api/expense` - List expenses
- POST `/api/expense` - Add expense

### Attendance
- GET `/api/attendance` - List attendance
- POST `/api/attendance` - Mark attendance
- POST `/api/attendance/bulk` - Bulk mark

### Other
- `/api/exams` - Exam management
- `/api/results` - Result management
- `/api/notices` - Notice management
- `/api/classes` - Class management
- `/api/gallery` - Gallery management
- `/api/admission` - Online admissions
- `/api/dashboard` - Dashboard stats

## Features Included

✅ Student Management (Add/Edit/Delete/List)
✅ Teacher & Staff Management
✅ Fees Collection & Receipts
✅ Income/Expense Tracking
✅ Student Attendance
✅ Exam Management
✅ Result Management
✅ Notice Board
✅ Class & Section Management
✅ Gallery Management
✅ Online Admission Forms
✅ Public Website (Home, About, Gallery, Notices, Contact)
✅ Admin Dashboard with Stats
✅ JWT Authentication
✅ Role-based Access
✅ Mobile Responsive Design
✅ Production Ready

## Troubleshooting

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify MONGODB_URI in .env

2. **Port Already in Use**
   - Change PORT in .env
   - Kill process on port 5000

3. **CORS Errors**
   - Check FRONTEND_URL in backend .env

4. **JWT Token Issues**
   - Clear browser localStorage
   - Login again

## Support

For issues or questions, please check the code comments or create an issue.
