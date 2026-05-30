import mongoose, { Schema, Document } from 'mongoose';

export interface IDesign extends Document {
  userId: string;
  name: string;
  canvasSize: { width: number; height: number };
  bgImageUrl: string;
  bgImageSettings?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    overlayOpacity?: number;
    overlayColor?: string;
  };
  // Store the active text layers exactly as they exist in Zustand
  layers: unknown[]; 
  publishHistory?: { pageId: string; publishedAt: Date }[];
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
  bgImageSettings: { type: Schema.Types.Mixed },
  layers: { type: [Schema.Types.Mixed], default: [] },
  publishHistory: { 
    type: [{ pageId: String, publishedAt: Date }], 
    default: [] 
  },
}, { 
  timestamps: true 
});

export default mongoose.models.Design || mongoose.model<IDesign>('Design', DesignSchema);
