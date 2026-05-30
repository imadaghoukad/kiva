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

  // Advanced Text Effects
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  stroke?: string;
  strokeWidth?: number;
  textBgColor?: string;
  textBgPadding?: number;
  textBgRadius?: number;

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
  bgImageSettings?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    overlayOpacity?: number;
    overlayColor?: string;
  };
  textZones: ITextZone[];
  source: 'admin' | 'user';
  userId?: mongoose.Types.ObjectId | string;
  isPublic: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  usageCount?: number;
  reported?: boolean;
  authorName?: string;
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
  shadowColor: { type: String },
  shadowBlur: { type: Number },
  shadowOffsetX: { type: Number },
  shadowOffsetY: { type: Number },
  stroke: { type: String },
  strokeWidth: { type: Number },
  textBgColor: { type: String },
  textBgPadding: { type: Number },
  textBgRadius: { type: Number },
  visible: { type: Boolean, default: true },
  locked: { type: Boolean, default: false },
}, { _id: false });

const BgImageSettingsSchema = new Schema({
  brightness: { type: Number },
  contrast: { type: Number },
  saturation: { type: Number },
  blur: { type: Number },
  overlayOpacity: { type: Number },
  overlayColor: { type: String },
}, { _id: false });

const TemplateSchema = new Schema<ITemplate>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  canvasSize: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  bgImageUrl: { type: String, default: null },
  bgImageSettings: { type: BgImageSettingsSchema },
  textZones: { type: [TextZoneSchema], default: [] },
  source: { type: String, enum: ['admin', 'user'], default: 'admin' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: false },
  moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  usageCount: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  authorName: { type: String, required: false },
}, {
  timestamps: true,
});

const Template: Model<ITemplate> = mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;
