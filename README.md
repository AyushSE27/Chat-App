Chat-App 💬
A real-time full-stack chat application built using the MERN Stack featuring private messaging, group chats, online status, typing indicators, file sharing, emojis, and real-time communication powered by Socket.IO.

🚀 Features
🔒 Authentication

User Register & Login

JWT (JSON Web Token) Authentication

Protected Frontend & Backend Routes

⚡ Real-Time Chat

One-to-One Private Messaging

Real-Time Messages using Socket.IO

Online/Offline Status Indicators

Real-Time Typing Indicators (User is typing...)

👥 Group Chat

Create New Groups

Send Group Messages in Real-Time

Real-Time Group Activity Communication

📂 Media Sharing

Send Images

Send Files & Documents

Download Shared Files directly from Chat

🎨 UI/UX Features

Interactive Emoji Picker 😀

Notification Sound on New Messages 🔔

Auto-Scroll to Latest Message

Fully Responsive Chat Layout (Mobile & Desktop friendly)

✔️ Message Status

Sent (✓)

Delivered (✓✓)

Read Status Support

🛠️ Tech Stack
Frontend
React.js & Vite (Fast build tool)

Axios (API Requests)

Socket.IO Client (Real-time connection)

React Icons & Emoji Picker (Rich UI elements)

Backend
Node.js & Express.js (Server framework)

MongoDB & Mongoose (Database & ORM)

Socket.IO (WebSockets)

Multer (File Upload middleware)

📂 Project Structure
Plaintext
chat-app/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── components/
│   │   └── socket.js
│   └── vite.config.js
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
Bash
git clone https://github.com/AyushSE27/chat-app.git
cd chat-app
2️⃣ Backend Setup
Navigate to the backend directory, install dependencies, configure environment variables, and start the server:

Bash
cd backend
npm install
Create a .env file in the backend root folder and add your credentials:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the backend server:

Bash
node server.js
3️⃣ Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server:

Bash
cd frontend
npm install
npm run dev
🌐 Default URLs
Frontend Local URL: http://localhost:5173

Backend API URL: http://localhost:5000

📸 Screenshots
Private & Group Chats
Online Status & Users
Media & Document Sharing
🔥 Future Improvements
[ ] Voice Messages 🎙️

[ ] Video Calling 📞

[ ] Dark Mode Support 🌙

[ ] Message Reactions (Like, Love, Haha, etc.) ❤️

[ ] Edit & Delete Sent Messages (Unsend feature) ❌

[ ] Advanced Seen/Read Status Improvements 👁️

👨‍💻 Author
AYUSH VERMA

Feel free to connect or contribute to this project!

📜 License
This project is licensed under the MIT License.
