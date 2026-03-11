import mongoose, { Schema, Document } from 'mongoose';

export interface IDesign extends Document {
  userId: string;
  name: string;
  canvasSize: { width: number; height: number };
  bgImageUrl: string;
  // Store the active text layers exactly as they exist in Zustand
  layers: unknown[]; 
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  canvasSize: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  bgImageUrl: { type: String, default: "" },
  layers: { type: [Schema.Types.Mixed], default: [] },
}, { 
  timestamps: true 
});

export default mongoose.models.Design || mongoose.model<IDesign>('Design', DesignSchema);
