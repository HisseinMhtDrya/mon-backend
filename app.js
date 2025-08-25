require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connecté à la base de données"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Schéma Product
const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    stockStatus: {
      type: String,
      enum: ["en stock", "petite stock", "pas en stock"],
      required: true,
    },
  },
  { timestamps: true }
);

// Modèle Product
const productModel = mongoose.model("products", productSchema);

// Middleware JSON
app.use(express.json());

// ------------------ Routes CRUD ------------------

// GET all products
app.get("/products", async (req, res) => {
  const products = await productModel.find();
  res.send({ products });
});

// GET product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).send({ message: "Produit introuvable" });
    res.send({ product });
  } catch (err) {
    res.status(400).send({ message: "ID invalide" });
  }
});

// POST add a new product
app.post("/products", async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    res.status(201).send({ message: "Produit ajouté avec succès", product });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// PATCH update product (except stockStatus)
app.patch("/products/:id", async (req, res) => {
  try {
    const { productName, price } = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { productName, price },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).send({ message: "Produit introuvable" });
    res.send({ message: "Produit mis à jour", updatedProduct });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// PATCH update stockStatus only
app.patch("/products/:id/:status", async (req, res) => {
  try {
    const status = req.params.status;
    if (!["en stock", "petite stock", "pas en stock"].includes(status)) {
      return res.status(400).send({ message: "Valeur stockStatus invalide" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { stockStatus: status },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).send({ message: "Produit introuvable" });
    res.send({ message: "Stock mis à jour", updatedProduct });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// DELETE a product
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send({ message: "Produit introuvable" });
    res.send({ message: "Produit supprimé avec succès", deletedProduct });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Lancement serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
