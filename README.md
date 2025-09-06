# University Website Project

A dynamic university website built with Node.js, Express, and EJS templating engine. The project includes features for course management, notifications, user authentication, and more.

## 🚀 Features

### Authentication

- User registration and login
- JWT-based authentication
- Role-based access control
- Profile management

### Course Management

- View available courses
- Course details with views counter
- File downloads for course materials
- Bookmark favorite courses

### Notifications System

- Public notifications
- Specialization-specific notifications
- Real-time notification updates
- Markdown formatting support for notifications

### Admin Dashboard

- Add/manage colleges
- Add/manage specializations
- Add/manage courses
- Course material management
- Send notifications

### User Features

- Bookmark system
- Profile customization
- Specialization-based content
- Contact form

## 🛠️ Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Template Engine**: EJS
- **Authentication**: JWT, bcrypt
- **Frontend**: HTML, CSS, JavaScript
- **File Handling**: Multer
- **Other Tools**: Cookie-parser, Dotenv

## 📦 Project Structure

```
university-website-ejs/
├── config/
│   └── db.js
├── middlewares/
│   └── jwt.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Bookmark.js
│   └── notifications.js
├── public/
│   ├── css/
│   ├── js/
│   └── uploads/
├── routes/
│   ├── auth.js
│   ├── colleges.js
│   ├── courses.js
│   ├── notification.js
│   └── specializations.js
├── views/
│   ├── dashboard/
│   ├── partials/
│   └── *.ejs
├── .env
├── server.js
└── README.md
```

## 🚦 Getting Started

1. **Clone the repository**

```bash
git clone [repository-url]
cd university-website-ejs
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your configurations
```

4. **Start the server**

```bash
npm start
```

## 🔧 Environment Variables

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 📝 API Routes

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /profile` - User profile

### Courses

- `GET /library` - View all courses
- `GET /book/:id` - View course details
- `POST /bookmarks` - Bookmark a course

### Notifications

- `GET /notifications` - View notifications
- `POST /notifications/add` - Add new notification (admin)

### Admin Routes

- `GET /add` - Add college
- `GET /add2` - Add specialization
- `GET /add3` - Add course
- `GET /add4` - Add course data
- `GET /add5` - Add notification

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔒 Security

- JWT authentication
- Password hashing using bcrypt
- Protected routes
- Input validation
- XSS protection
- CSRF protection

## 🎯 Future Enhancements

- [ ] Real-time chat system
- [ ] Advanced search functionality
- [ ] Student discussion forums
- [ ] Academic calendar integration
- [ ] Mobile application
- [ ] PDF preview feature
- [ ] Multi-language support

## 📞 Contact

For questions and support, please email [your-email@domain.com]

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- EJS template engine
- All contributors

---

Made with ❤️ by [Your Name/Team]
