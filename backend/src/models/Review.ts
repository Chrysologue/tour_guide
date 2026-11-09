import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  circuitId?: Types.ObjectId | null;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  circuitId: { type: Schema.Types.ObjectId, ref: 'Circuit', default: null },
  customerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export const Review = model<IReview>('Review', ReviewSchema);