# LimeWire-Back-End  
A prototype backend server built for an audio-library web app, designed to support browsing, uploading, tagging, and streaming audio assets. Built as part of a passion project at the intersection of music and software.

## 🚀 Tech Stack  
- Node.js / Express  
- PostgreSQL (or SQLite / whichever you used)  
- RESTful API architecture  
- JWT-based authentication  
- File upload handling (audio assets)  
- Modular code structure: controllers, routes, models, middleware  
- [Optional: if you used any ORM (Sequelize, TypeORM)—mention here]

##🎧 Key Features

User Authentication
Register & login with JWT auth
Audio Uploading
Upload audio files with metadata (title, artist, tags, category)
Library Browsing
Search, filter, and list audio assets
Secure Streaming / Downloading
Stream or download audio files via protected endpoints
Admin / Management Tools (optional)
Delete or manage uploaded assets
Example API Endpoints:
POST /api/users/register
POST /api/users/login
GET /api/audio
POST /api/audio/upload
GET /api/audio/:id
DELETE /api/audio/:id

  ## 📁 Project Structure
  /src
  /controllers
  /routes
  /models
  /middleware
  /uploads        ← stored audio files (local or cloud)
  server.js

##⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/yourusername/LimeWire-Back-End.git
cd LimeWire-Back-End

2. Install dependencies
npm install

3. Create a .env file
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/limewire
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads

4. Start the server
npm run dev   # nodemon

##🔐 Authentication

 All protected routes require:
 Authorization: Bearer <token>

##📦 Upload Handling

 Uploaded audio files are stored:
 Locally inside /uploads, OR

Connected to S3 (if configured)

Metadata is stored in PostgreSQL.
