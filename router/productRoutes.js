const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// ✅ GET tous les produits
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ GET un produit par ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "ID invalide" });
  }
});

// ✅ POST - ajouter un produit
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Produit créé avec succès", product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PATCH - mettre à jour un produit (sauf stockStatus)
router.patch("/:id", async (req, res) => {
  try {
    const { productName, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, price },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Produit introuvable" });
    res.json({ message: "Produit mis à jour", updatedProduct });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PATCH - mettre à jour uniquement le stockStatus
router.patch("/:id/:status", async (req, res) => {
  try {
    const status = req.params.status;
    if (!["en stock", "petite stock", "pas en stock"].includes(status)) {
      return res.status(400).json({ message: "Valeur du stockStatus invalide" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { stockStatus: status },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Produit introuvable" });

    res.json({ message: "Stock mis à jour", updatedProduct });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE - supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Produit introuvable" });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
