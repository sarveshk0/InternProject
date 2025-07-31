const express=require("express");
const authRoutes = require("./routes/authroutes.js");
const noteRoutes = require("./routes/noteRoutes.js");
const app=express();
const cors=require("cors")
const cookieParser = require("cookie-parser");
// user routes

const database = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://intern-project-ebon.vercel.app",
  "http://localhost:5173",
  "https://internproject-frontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());
// Database connect
database.connect();
app.use(express.json());

// Middlewares
app.use((req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api", authRoutes);
app.use("/api/notes", noteRoutes);


// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...."
  });
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

