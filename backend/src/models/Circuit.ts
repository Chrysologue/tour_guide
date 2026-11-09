import { Schema, model, Document } from 'mongoose';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface ICircuit extends Document {
  title: string;
  slug: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  currency: string;
  itinerary: ItineraryDay[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CircuitSchema = new Schema<ICircuit>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export const Circuit = model<ICircuit>('Circuit', CircuitSchema);