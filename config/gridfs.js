import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket;

// Initialize GridFS bucket once MongoDB connection is ready
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established, initializing GridFS bucket...');
  
  // Create GridFS bucket for audio files
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'audio' // This creates collections: audio.files and audio.chunks
  });
  
  console.log('GridFS bucket initialized successfully');
});

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

export { bucket };