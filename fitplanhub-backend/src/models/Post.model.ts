// ========================================
// src/models/Post.model.ts
// ========================================

import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
  replies?: Array<{
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  content: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | 'mixed';
  hashtags?: string[];
  mentions?: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  comments: IComment[];
  commentsCount: number;
  shares: number;
  isPublic: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { type: String, required: true, trim: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replies: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const PostSchema = new Schema<IPost>({
  authorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true, trim: true },
  mediaUrls: [{ type: String }],
  mediaType: { 
    type: String, 
    enum: ['image', 'video', 'mixed'] 
  },
  hashtags: [{ type: String }],
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  comments: [CommentSchema],
  commentsCount: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false }
}, { timestamps: true });

PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ hashtags: 1 });
PostSchema.index({ likesCount: -1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);
