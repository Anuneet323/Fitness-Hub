import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId;
  date: Date;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  water?: number;
  workoutsDone: number;
  workoutDuration?: number;
  steps?: number;
  sleep?: number;
  mood?: "excellent" | "good" | "okay" | "bad" | "terrible";
  energy?: number;
  notes?: string;
  photos?: string[];
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
    date: { type: Date, required: true },
    weight: { type: Number, min: 0 },
    bodyFat: { type: Number, min: 0, max: 100 },
    muscleMass: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fats: { type: Number, min: 0 },
    water: { type: Number, min: 0 },
    workoutsDone: { type: Number, default: 0, min: 0 },
    workoutDuration: { type: Number, min: 0 },
    steps: { type: Number, min: 0 },
    sleep: { type: Number, min: 0, max: 24 },
    mood: {
      type: String,
      enum: ["excellent", "good", "okay", "bad", "terrible"],
    },
    energy: { type: Number, min: 1, max: 10 },
    notes: { type: String },
    photos: [{ type: String }],
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      thighs: Number,
      arms: Number,
    },
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, date: -1 });
ProgressSchema.index({ planId: 1 });

export const Progress = mongoose.model<IProgress>("Progress", ProgressSchema);
