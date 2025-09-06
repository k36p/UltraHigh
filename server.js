const express = require("express");
const path = require("path");
const os = require('os');
const process = require('process');
const app = express();
const port = 8080;

// View engine setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// MongoDB and utilities
const { ObjectId } = require("mongodb");
const router = express.Router();
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

// Models and Routes
const authRoutes = require('./routes/auth');
const User = require('./models/User');  
const BookmarkModle = require('./models/Booksmark'); 
const collegeRoutes = require('./routes/colleges');  
const specializationRoutes = require('./routes/specializations');
const Course = require('./models/Course');
const mail = require('./routes/mail'); 
const courseRoutes = require('./routes/courses');  
const notificationRoutes = require('./routes/notification');  
const Notification = require('./models/notifications'); 
const BookMark = require('./routes/bookMark'); 

// tools clip
const image_to_pdf = require('./routes/tools/img-to-pdf'); 



// Database connection
const connectDB = require('./config/db');

// Connect to database
let data = connectDB();

// Middleware setup
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const AccessPanel = require('./middlewares/access'); // Import AccessPanel middleware

// JWT authentication setup
const { type } = require("os");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authRoute = require('./routes/auth');
const jwtUtils = require("./middlewares/jwt");
const { PassThrough } = require("stream");

app.use(cookieParser());

// Routes middleware
app.use('/auth', authRoute);
app.use(
    collegeRoutes,
    specializationRoutes,
    courseRoutes,
    mail,
    notificationRoutes,
    BookMark,image_to_pdf
);


// Authorization middleware
async function authorize(req, res, next) {
  try {
    // Retrieve JWT token from cookie
    const jwtToken = req.cookies.token;
    
    if (!jwtToken) {
      return res.redirect("/login");
    }
    
    // Verify JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const username = decoded.user;
    req.user = username;
    next();
    
  } catch (error) {
    console.error('Authorization error:', error);
    res.redirect("/login");
  }
}

async function verify(req, res, next) {
  try {
    delete res.locals.user; 
    const jwtToken = req.cookies.token;

    if (!jwtToken) {
      req.user = null;
      return next(); // Important: Continue to next middleware
    }
    
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // Fetch the full user data from database
    const user = await User.findById(decoded.user.id).populate({
                path: 'specialization',
                populate: {
                    path: 'college'
                }
            }).select('-password');
    
    // Attach user data to the request object
    req.user = user;
    next(); // Continue to next middleware

  } catch (error) {
    console.error('Verify error:', error);
    req.user = null;
    next(); // Always call next() even in error cases
  }
}

// Usage
app.use(verify);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// Then your routes

// Utility function for date formatting
function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Routes

// Main page
app.get("/",async (req, res) => {
  try {
     res.render("main");
  } catch (error) {
    console.error('Error rendering main page:', error);
    res.status(500).send('Error loading main page');
  }
});


// Contact page
app.get("/edit", async (req, res) => {
  try {
    res.render("edit");
  } catch (error) {
    console.error('Error rendering edit page:', error);
    res.status(500).send('Error loading edit page');
  }
});

// Bookmarks page
app.get("/bookMarks", async (req, res) => {
  let dataList = []; 

  try {
    if (req.user && req.user.id) {
      dataList = await BookmarkModle.findOne({ user_id: req.user.id }).populate({
        path: 'course_id',
        populate: {
            path: 'specialization',
        }}).lean();
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    dataList = []; 
  }

  try {
    res.render("saved", { dataList: dataList, });
  } catch (error) {
    console.error('Error rendering saved page:', error);
    res.status(500).send('Error loading bookmarks page');
  }
});

// Library page
app.get("/library", async (req, res) => {
  try {
    const books = await Course.find({}).populate('specialization').lean();
    res.render("library", { data: books });
  } catch (error) {
    console.error('Error loading library:', error);
    res.render("library", { data: [] });
  }
});

// Individual book page
app.get("/library/book", async (req, res) => {
  try {
    res.render("book");
  } catch (error) {
    console.error('Error rendering book page:', error);
    res.status(500).send('Error loading book page');
  }
});

// Notifications page
app.get("/notifications", async (req, res) => {
 var is_logged_in = req.user ? true : false;
 console.log(is_logged_in)
  try {
    let data_public = await Notification.find({ type: 'public' }).sort({ createdAt: -1 }).populate('specialization').lean();
    let data_by_specialization = req.user ? await Notification.find({specialization: req.user.specialization._id }).sort({ createdAt: -1 }).populate('specialization').lean() : [];
    res.render("notifications", { data: data_public, data_by_specialization: data_by_specialization, is_logged_in: is_logged_in });
  } catch (error) {
    console.error('Error rendering notifications page:', error);
    res.status(500).send('Error loading notifications page');
  }
});

// Contact page
app.get("/contact", async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    console.error('Error rendering contact page:', error);
    res.status(500).send('Error loading contact page');
  }
});

// Login page
app.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error('Error rendering login page:', error);
    res.status(500).send('Error loading login page');
  }
});

// Add college page
app.get("/add",AccessPanel,  async (req, res) => {
  try {
    res.render("dashboard/add-college.ejs");
  } catch (error) {
    console.error('Error rendering add college page:', error);
    res.status(500).send('Error loading add college page');
  }
});

// Add specialization page
app.get("/add2",AccessPanel,  async (req, res) => {
  try {
    res.render("dashboard/add-specialization.ejs");
  } catch (error) {
    console.error('Error rendering add specialization page:', error);
    res.status(500).send('Error loading add specialization page');
  }
});

// Add books page
app.get("/add3",AccessPanel,  async (req, res) => {
  try {
    res.render("dashboard/add-course.ejs");
  } catch (error) {
    console.error('Error rendering add books page:', error);
    res.status(500).send('Error loading add books page');
  }
});


// Add course data page
app.get("/add4",AccessPanel, async (req, res) => {

  try {
    const courses = await Course.find({}).lean();
    res.render("dashboard/add-course-data.ejs", { data: courses });
  } catch (error) {
    console.error('Error rendering add books page:', error);
    res.status(500).send('Error loading add books page');
  }
});

// Book detail page
app.get("/book/:id", async (req, res) => { //NOTE: edit check user saved book status in soon not now but its important things for more protection
try {

  var courseId = req.params.id
  const courseData = await Course.findById(courseId).populate('specialization')
  courseData.views = courseData.views + 1; 
  await courseData.save();    


    res.render("book.ejs",{data:courseData});
  } catch (error) {
    console.error('Error rendering book detail page:', error);
    res.render('404');
  }
});


// profile page
app.get("/profile",authorize, async (req, res) => {
  try {
    res.render("profile");
  } catch (error) {
    console.error('Error rendering login page:', error);
    res.status(500).send('Error loading login page');
  }
});

// notifications page
app.get("/add5",authorize, async (req, res) => {
  try {
    res.render("dashboard/add-notification");
  } catch (error) {
    console.error('Error rendering notification page:', error);
    res.status(500).send('Error loading notification page');
  }
});


app.get("/edit5", async (req, res) => {
  try {
    res.render("edit5");
  } catch (error) {
    console.error('Error rendering edit page:', error);
    res.status(500).send('Error loading edit page');
  }
});



// Handle 404 routes
app.use((req, res) => {
  res.render('404')
});

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`Platform: ${os.platform()}`);
  console.log(`OS Type: ${os.type()}`); 
});



