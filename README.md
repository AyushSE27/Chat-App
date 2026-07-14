# Chat-App 💬

A real-time full-stack chat application built using the MERN Stack with private messaging, group chats, online status, typing indicator, file sharing, emojis, and Socket.IO real-time communication.

---

## 🚀 Features

### 🔒 Authentication
* User Register & Login
* JWT Authentication
* Protected Routes

### ⚡ Real-Time Chat
* One-to-One Messaging
* Real-Time Messages using Socket.IO
* Online/Offline Users
* Typing Indicator

### 👥 Group Chat
* Create Groups
* Send Group Messages
* Real-Time Group Communication

### 📂 Media Sharing
* Send Images
* Send Files/Documents
* Download Shared Files

### 🎨 UI Features
* Emoji Picker 😀
* Notification Sound 🔔
* Auto Scroll Chat
* Responsive Chat Layout

### ✔️ Message Status
* Sent ✓
* Delivered ✓✓
* Read Status Support

---

## 🛠️ Tech Stack

### Frontend
* React.js
* Vite
* Axios
* Socket.IO Client
* React Icons
* Emoji Picker

### Backend
* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* Multer

---

## 📂 Project Structure

```text
chat-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── context/
    │   ├── components/
    │   └── socket.js
    └── vite.config.js
⚙️ Installation
1️⃣ Clone Repository
Bash
git clone [https://github.com/AyushSE27/chat-app.git](https://github.com/AyushSE27/chat-app.git)
2️⃣ Backend Setup
Bash
cd backend
npm install
Create a .env file in the backend root and add:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
Start Backend:

Bash
node server.js
3️⃣ Frontend Setup
Bash
cd frontend
npm install
npm run dev
🌐 URLs
Frontend: http://localhost:5173

Backend: http://localhost:5000

📸 Screenshots
Private Chat & Group Chat
Online Users
Typing Indicator & Media Sharing
🔥 Future Improvements
[ ] Voice Messages 🎙️

[ ] Video Calling 📞

[ ] Dark Mode 🌙

[ ] Message Reactions ❤️

[ ] Delete Messages ❌

[ ] Edit Messages 📝

[ ] Seen Status Improvements 👁️

👨‍💻 Author
AYUSH VERMA

📜 License
This project is licensed under the MIT License.
