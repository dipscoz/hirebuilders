const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

  nom: String,
  metier: String,
  ville: String,
  prix: String,
  note: Number,
  dispo: Boolean,

});

module.exports = mongoose.model("Employee", employeeSchema);