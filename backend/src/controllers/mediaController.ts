import { Request, Response } from 'express';
import { Media } from '../models/Media.js';
import cloudinary from '../config/cloudinary.js';

// --- PUBLIC CONTROLLERS ---

// Get all media (optionally filter by category or circuitId)
export const getPublicMedia = async (req: Request, res: Response) => {
  try {
    const { category, circuitId } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (circuitId) filter.circuitId = circuitId;

    const mediaItems = await Media.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return res.status(200).json(mediaItems);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// --- ADMIN CONTROLLERS ---

// Add media record (assumes image/video is already uploaded to Cloudinary via frontend or buffer)
export const createMedia = async (req: Request, res: Response) => {
  try {
    const { circuitId, type, category, url, publicId, altText, sortOrder } = req.body;

    if (!url || !publicId || !type || !category) {
      return res.status(400).json({ error: 'Missing required media fields (url, publicId, type, category)' });
    }

    const newMedia = new Media({
      circuitId: circuitId || null,
      type,
      category,
      url,
      publicId,
      altText: altText || '',
      sortOrder: sortOrder || 0
    });

    const savedMedia = await newMedia.save();
    return res.status(201).json({ message: 'Media added successfully', media: savedMedia });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete media from DB and Cloudinary
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mediaItem = await Media.findById(id);

    if (!mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete asset from Cloudinary
    await cloudinary.uploader.destroy(mediaItem.publicId);

    // Delete record from MongoDB
    await Media.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Media deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};