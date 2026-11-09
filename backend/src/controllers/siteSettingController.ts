import { Request, Response } from 'express';
import { SiteSetting } from '../models/SiteSetting.js';

// Get a setting by key (Public)
export const getSettingByKey = async (req: Request, res: Response) => {
  try {
    const  key  = req.params.key as string;
    const setting = await SiteSetting.findOne({ key });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    return res.status(200).json(setting);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Create or update a setting (Admin only)
export const upsertSetting = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    const updatedSetting = await SiteSetting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Setting saved successfully', setting: updatedSetting });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};