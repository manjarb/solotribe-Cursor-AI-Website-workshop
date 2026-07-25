import { Model, Schema, models, model } from "mongoose";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/validations/lead";

export interface LeadDocument {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<LeadDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "new",
      required: true,
    },
  },
  { timestamps: true },
);

export const Lead =
  (models.Lead as Model<LeadDocument>) ||
  model<LeadDocument>("Lead", leadSchema);
