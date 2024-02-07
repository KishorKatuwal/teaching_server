const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  noteDescription: {
    type: String,
    required: true,
    trim: true,
  },
});

const Notes = mongoose.model("Notes", noteSchema);
module.exports = Notes;
