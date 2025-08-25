const mongoose = require("mongoose");

// Définition du schéma pour Product
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockStatus: {
      type: String,
      enum: ["en stock", "petite stock", "pas en stock"], // valeurs autorisées
      required: true,
    },
  },
  { timestamps: true }
);

// Création du modèle Product
const Product = mongoose.model("products", productSchema);

module.exports = Product;
