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

## 🎧 Key Features  
- User registration & login (authentication + authorization)  
- Upload and manage audio files (metadata: title, artist, tags, category)  
- Browse, search, filter audio assets (by tags, category, keyword)  
- Stream or download audio files (via secure endpoints)  
- Admin endpoints for managing assets / users (if applicable)  
- Example endpoints:  
  - `POST /api/users/register`  
  - `POST /api/users/login`  
  - `GET /api/audio`  
  - `POST /api/audio/upload`  
  - `GET /api/audio/:id`  
  - `DELETE /api/audio/:id`  
- Designed with scalability and modularity in mind (ready to be extended into full audio-tech product)

## 🔧 Setup & Installation  
1. Clone the repo  
   ```bash
   git clone https://github.com/Buru7734/limeWire-Back-End.git

