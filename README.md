# InternProject



---


This is the frontend for the Notes App built using React.js and Vite. It allows users to sign up, log in, create, and delete notes. Authentication is handled using JWT stored in cookies.

## 🚀 Tech Stack

- React.js
- Vite
- Tailwind CSS

---

## 📦 Installation

```bash
cd client
npm install
````

---

## ▶️ Running the App

```bash
npm run dev
```

> This will run the React app on `http://localhost:5173` by default.

---

## 🔑 Features

* Signup with name,Email and OTP
* Login using Email and OTP
* JWT-based Authentication
* Create and Delete Notes
* User Dashboard
* Auto logout on token expiry

---

## 🌐 API Endpoints

> Make sure the server is running on `http://localhost:5000`

* `POST /signup1` - Register user
* `POST /verifyotp` - Verify OTP and create account
* `POST /login` - Login user
* `GET /dashboard` - Fetch user & notes (requires token)
* `POST /createnote` - Create new note
* `DELETE /deletenote/:id` - Delete a note

---

## 📁 Folder Structure

```
client/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── index.html
```

---

## 💡 Tips

* When JWT token expires, it auto removes from localStorage and logs out the user.
* Make sure your server is running before using the client app.

````

---

### ✅ `server/README.md`

```markdown
# 🛠️  Server

This is the backend for the Notes App built using Node.js and Express. It handles user authentication, note creation, and retrieval.

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer (for OTP)

---

## 📦 Installation

```bash
cd server
npm install
````

---

## ▶️ Running the Server

```bash
npm run start
```

> This will run the server on `http://localhost:4000` by default.

---

## 🔐 Environment Variables

Create a `.env` file in the `server` directory and add the following:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```

---

## 📁 Folder Structure

```
server/
├── controller/
│   └── Auth.js
├── model/
│   ├── User.js
│   ├── OTP.js
│   └── Note.js
├── routes/
│   └── AuthRoutes.js
├── utils/
│   └── mailSender.js
├── middleware/
│   └── auth.js
├── .env
├── server.js
└── package.json
```

---

## 🔑 API Routes

### Auth

* `POST /signup1` - Send OTP and store email, name, dob
* `POST /verifyotp` - Create account on OTP verify
* `POST /login` - Login and return token in cookie
* `GET /dashboard` - Get user info & notes (protected)
* `POST /createnote` - Add new note (protected)
* `DELETE /deletenote/:id` - Delete note (protected)

---

## 🧪 Test

Use tools  **Postman**  to test your APIs before integrating with frontend.

---

## 📬 Contact

For any issue or discussion, open a GitHub issue or contact me.
kumarsarvesh105@gmail.com
```

---


```
