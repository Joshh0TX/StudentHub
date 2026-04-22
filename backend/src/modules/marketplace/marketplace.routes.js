const express = require("express");
const router = express.Router();
const prisma = require("../../config/prisma");

router.get("/store/:ownerId", async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.params.ownerId },
      include: { contacts: true, products: true },
    });
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/store", async (req, res) => {
  const { name, description, type, ownerId, contacts } = req.body;
  if (!name || !ownerId)
    return res.status(400).json({ error: "name and ownerId are required" });

  try {
    const store = await prisma.store.create({
      data: {
        name,
        description,
        type: type || "goods",
        ownerId,
        contacts: {
          create: contacts || [],
        },
      },
      include: { contacts: true },
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/store/:id", async (req, res) => {
  const { name, description, type, contacts } = req.body;
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        type,
        contacts: contacts
          ? { deleteMany: {}, create: contacts }
          : undefined,
      },
      include: { contacts: true },
    });
    res.json(store);
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Store not found" });
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { store: { include: { contacts: true } } },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { store: { include: { contacts: true } } },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, description, price, image, type, category, locations, storeId } = req.body;
  if (!name || !price || !category || !storeId)
    return res.status(400).json({ error: "name, price, category and storeId are required" });

  try {
    const product = await prisma.product.create({
      data: { name, description, price, image, type: type || "goods", category, locations: locations || [], storeId },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, description, price, image, type, category, locations } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, description, price, image, type, category, locations },
    });
    res.json(product);
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Product not found" });
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Product not found" });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
