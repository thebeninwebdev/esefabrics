import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  country: { type: String, default: "Unknown" },
  browser: { type: String, default: "Unknown" },
  os: { type: String, default: "Unknown" },
  referrer: { type: String, default: "Direct" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
