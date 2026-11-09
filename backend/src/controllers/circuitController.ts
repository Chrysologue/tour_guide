import { Request, Response } from 'express';
import { Circuit } from '../models/Circuit.js';

// --- PUBLIC CONTROLLERS ---

// Get all published circuits (for visitors)
export const getPublicCircuits = async (req: Request, res: Response) => {
  try {
    const circuits = await Circuit.find({ isPublished: true }).sort({ createdAt: -1 });
    return res.status(200).json(circuits);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Get single published circuit by slug (for tour detail page)
export const getPublicCircuitBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const circuit = await Circuit.findOne({ slug, isPublished: true });
    
    if (!circuit) {
      return res.status(404).json({ error: 'Circuit not found' });
    }

    return res.status(200).json(circuit);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// --- ADMIN CONTROLLERS ---

// Get ALL circuits (admin can see drafts & published tours)
export const adminGetAllCircuits = async (req: Request, res: Response) => {
  try {
    const circuits = await Circuit.find({}).sort({ createdAt: -1 });
    return res.status(200).json(circuits);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Create a new circuit
export const createCircuit = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, location, duration, price, currency, itinerary, isPublished } = req.body;

    // Check if slug already exists
    const existingSlug = await Circuit.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ error: 'A circuit with this slug already exists' });
    }

    const newCircuit = new Circuit({
      title,
      slug,
      description,
      location,
      duration,
      price,
      currency,
      itinerary,
      isPublished
    });

    const savedCircuit = await newCircuit.save();
    return res.status(201).json({ message: 'Circuit created successfully', circuit: savedCircuit });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Update an existing circuit
export const updateCircuit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCircuit = await Circuit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedCircuit) {
      return res.status(404).json({ error: 'Circuit not found' });
    }

    return res.status(200).json({ message: 'Circuit updated successfully', circuit: updatedCircuit });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a circuit
export const deleteCircuit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCircuit = await Circuit.findByIdAndDelete(id);

    if (!deletedCircuit) {
      return res.status(404).json({ error: 'Circuit not found' });
    }

    return res.status(200).json({ message: 'Circuit deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};