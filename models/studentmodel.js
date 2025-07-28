const (mongoose = require ("mongoose"));
// create a schema
const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// create students model
const studentModel = mongoose.model("students", schema);
module.exports = students