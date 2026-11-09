import { Schema, model, Document, Types } from 'mongoose';

export interface IInquiry extends Document {
  circuitId?: Types.ObjectId | null;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  circuitId: { type: Schema.Types.ObjectId, ref: 'Circuit', default: null },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' }
}, { timestamps: true });

export const Inquiry = model<IInquiry>('Inquiry', InquirySchema);