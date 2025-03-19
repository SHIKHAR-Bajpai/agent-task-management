const mongoose = require('mongoose');

// Schema for task distribution to agents (referenced to Agent Model)
const listSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent', 
    required: true,
  },
}, { timestamps: true });


module.exports = mongoose.model("List" , listSchema)