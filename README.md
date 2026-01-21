# PrimeTrade - Enterprise Dashboard Application

A scalable full-stack web application with authentication and task management, built with a professional, minimal, enterprise-grade design suitable for fintech/SaaS companies.

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**
- React.js 18 with Vite
- Tailwind CSS for styling
- React Router DOM for routing
- Axios for HTTP requests
- Framer Motion for subtle animations
- React Three Fiber (Three.js) for 3D elements

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

### Project Structure

```
primetrade-assignment/
├── backend/
│   ├── models/          # MongoDB schemas (User, Task)
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── contexts/    # React context providers
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main app component
│   └── public/          # Static assets
└── README.md
```

### Run the Application

```bash
# Clone the repository
git clone <your-github-repo-url>
cd primetrade-assignment

# Backend setup
cd backend
npm install

# Create environment variables
echo "MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=supersecretkey" > .env

# Start backend
npm run dev
➡️ Backend runs at http://localhost:5000


Open another terminal tab (or stop backend with Ctrl+C), then:

# Frontend setup
cd frontend
npm install
npm run dev


➡️ Frontend runs at http://localhost:3000



