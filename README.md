# Limewire Backend API

**Limewire Backend** is a robust Node.js/Express REST API that powers the Limewire audio sharing platform. This backend provides secure user authentication, audio file management with GridFS storage, and comprehensive CRUD operations for sounds and comments. Built to handle high-quality audio files with efficient streaming capabilities, the API serves as the foundation for a modern audio sharing community.

The backend is designed to support audio professionals, content creators, and music enthusiasts by providing reliable file storage, metadata management, and user interaction features. With JWT-based authentication and MongoDB integration, it ensures secure and scalable operations for the Limewire platform.

## Getting Started


### 🔗 Frontend Repository
[Frontend Repository Link] - *Coming Soon*

### 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd limeWire-Back-End
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/limewire?retryWrites=true
   JWT_SECRET=
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```


## Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based user authentication
- **User Registration & Login**: Complete user account management
- **Password Encryption**: BCrypt hashing for secure password storage
- **Protected Routes**: Middleware-based route protection

### 🎵 Audio File Management
- **GridFS Integration**: Efficient storage and streaming of large audio files
- **Multi-format Support**: Handles various audio file formats (MP3, WAV, FLAC, etc.)
- **File Upload**: Secure audio file upload with validation
- **Audio Streaming**: Real-time audio streaming with range request support
- **File Size Limits**: 10MB upload limit with configurable settings

### 🏷️ Sound Management
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for sounds
- **Metadata Storage**: Title, description, and tagging system
- **Tag Categories**: Predefined tags (Music, Foley, Sound Effect, Ambient, Sound Bite)
- **User Association**: Sounds linked to user accounts with ownership validation

### 💬 Community Features
- **Comment System**: Full CRUD operations for sound comments
- **User Profiles**: Retrieve user information and their uploaded sounds
- **Community Discovery**: Browse all users and sounds in the platform

### 🔧 Technical Features
- **RESTful API Design**: Clean, consistent API endpoints
- **Data Validation**: Input validation and error handling
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Request Logging**: Morgan middleware for HTTP request logging
- **Error Handling**: Comprehensive error responses with appropriate status codes

## API Endpoints

### Authentication
- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User authentication

### Users
- `GET /users` - Get all users
- `GET /users/:userId` - Get user profile with their sounds
- `DELETE /users/:userId` - Delete user account

### Sounds
- `POST /sounds` - Upload new sound (requires authentication)
- `GET /sounds` - Get all sounds
- `GET /sounds/:soundId` - Get specific sound details
- `PUT /sounds/:soundId` - Update sound metadata (requires ownership)
- `DELETE /sounds/:soundId` - Delete sound (requires ownership)
- `GET /sounds/stream/:fileId` - Stream audio file
- `GET /sounds/:soundId/stream` - Stream sound by sound ID

### Comments
- `POST /comments` - Create new comment (requires authentication)
- `GET /comments?sound=:soundId` - Get comments for a specific sound
- `GET /comments/:commentId` - Get specific comment
- `PUT /comments/:commentId` - Update comment (requires ownership)
- `DELETE /comments/:commentId` - Delete comment (requires ownership)

## Technologies Used

### Backend Framework
- **Node.js 20+** - JavaScript runtime environment
- **Express.js 4.21.2** - Fast, unopinionated web framework
- **ES6 Modules** - Modern JavaScript module system

### Database & Storage
- **MongoDB 6.20.0** - NoSQL document database
- **Mongoose 8.9.5** - MongoDB object modeling for Node.js
- **GridFS** - MongoDB specification for storing large files

### Authentication & Security
- **JSON Web Tokens (JWT) 9.0.2** - Secure token-based authentication
- **BCrypt 5.1.1** - Password hashing and salting
- **CORS 2.8.5** - Cross-origin resource sharing middleware

### File Processing
- **Multer 1.4.4-lts.1** - Multipart/form-data handling for file uploads
- **Node.js Streams** - Efficient file streaming capabilities

### Development Tools
- **Nodemon 3.1.9** - Development server with auto-restart
- **Morgan 1.10.0** - HTTP request logger middleware
- **Dotenv 16.4.7** - Environment variable management

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  hashedPassword: String (required)
}
```

### Sound Model
```javascript
{
  user: ObjectId (ref: User),
  title: String (required),
  description: String (required),
  tags: [String] (enum: ["soundBite", "music", "foley", "soundEffect", "ambient"]),
  fileId: ObjectId (GridFS file reference),
  filename: String,
  contentType: String,
  length: Number (file size in bytes),
  uploadDate: Date,
  bucketName: String (default: "audio")
}
```

### Comment Model
```javascript
{
  sound: ObjectId (ref: Sound),
  user: ObjectId (ref: User),
  comment_text: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## File Upload Specifications
- **File Size Limit**: 10MB per file
- **Storage**: MongoDB GridFS with automatic chunking
- **Streaming**: Efficient byte-range streaming for audio playback

## Error Handling

The API implements comprehensive error handling with appropriate HTTP status codes:

- `200` - Success
- `201` - Created successfully
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resources)
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: 12-round BCrypt salt hashing
- **JWT Token Expiration**: 7-day token lifetime
- **Input Validation**: Request body and parameter validation
- **Ownership Verification**: User authorization for resource modification
- **CORS Configuration**: Controlled cross-origin access

## Development

### Project Structure
```
├── config/
│   └── gridfs.js          # GridFS bucket configuration
├── controllers/
│   ├── auth.js            # Authentication logic
│   ├── comments.js        # Comment management
│   ├── sounds.js          # Sound upload and streaming
│   └── users.js           # User management
├── db/
│   └── connection.js      # MongoDB connection
├── middleware/
│   └── verify-token.js    # JWT verification middleware
├── models/
│   ├── comments.js        # Comment schema
│   ├── sounds.js          # Sound schema
│   └── user.js            # User schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── comments.js        # Comment routes
│   ├── index.js           # Route aggregation
│   ├── sounds.js          # Sound routes
│   └── users.js           # User routes
├── server.js              # Application entry point
└── package.json           # Dependencies and scripts
```

### Scripts
- `npm start` - Production server
- `npm run dev` - Development server with auto-reload

## Future Enhancements

### Planned Features
- **Audio Processing**: Server-side audio manipulation and effects
- **Search & Filtering**: Advanced search by title, tags, and metadata
- **Like System**: User favorites and sound ranking
- **Batch Operations**: Multiple file upload and management

---

*Built with ❤️ for the audio community*
