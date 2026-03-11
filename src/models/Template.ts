import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITextZone {
  id: string; // Used to uniquely identify the layer
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  align: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  rotation: number;
  visible: boolean;
  locked: boolean;
}

export interface ITemplate extends Document {
  name: string;
  category: string;
  canvasSize: {
    width: number;
    height: number;
  };
  bgImageUrl: string | null;
  textZones: ITextZone[];
  createdAt: Date;
  updatedAt: Date;
}

const TextZoneSchema = new Schema<ITextZone>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  fontSize: { type: Number, required: true },
  fontFamily: { type: String, required: true },
  fontWeight: { type: String, required: true, default: 'normal' },
  fill: { type: String, required: true },
  align: { type: String, enum: ['left', 'center', 'right', 'justify'], default: 'left' },
  letterSpacing: { type: Number, default: 0 },
  lineHeight: { type: Number, default: 1 },
  textTransform: { type: String, enum: ['none', 'uppercase', 'lowercase', 'capitalize'], default: 'none' },
  rotation: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  locked: { type: Boolean, default: false },
}, { _id: false }); // Disable _id for subdocuments to keep it clean

const TemplateSchema = new Schema<ITemplate>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  canvasSize: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  bgImageUrl: { type: String, default: null },
  textZones: { type: [TextZoneSchema], default: [] },
}, {
  timestamps: true,
});

const Template: Model<ITemplate> = mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;
