import { Schema, model, Document, Types } from 'mongoose';

export interface IMedia extends Document {
  circuitId?: Types.ObjectId | null;
  type: 'image' | 'video';
  category: 'hero' | 'gallery' | 'circuit';
  url: string;
  publicId: string;
  altText: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  circuitId: { type: Schema.Types.ObjectId, ref: 'Circuit', default: null },
  type: { type: String, enum: ['image', 'video'], required: true },
  category: { type: String, enum: ['hero', 'gallery', 'circuit'], required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  altText: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const Media = model<IMedia>('Media', MediaSchema);