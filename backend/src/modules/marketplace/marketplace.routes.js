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

// ─── ORDER ROUTES ─────────────────────────────────────────────────────────────

// POST place an order
router.post("/orders", async (req, res) => {
  const { productId, buyerId, quantity, deliveryTime, location, note } = req.body;
  if (!productId || !buyerId)
    return res.status(400).json({ error: "productId and buyerId are required" });

  try {
    const order = await prisma.order.create({
      data: { productId, buyerId, quantity: quantity || 1, deliveryTime, location, note },
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET orders for a store (seller view)
router.get("/orders/store/:storeId", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { product: { storeId: req.params.storeId } },
      include: { product: true, buyer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update order status
router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "status is required" });

  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Order not found" });
    res.status(500).json({ error: error.message });
  }
});

// ─── REVIEW ROUTES ────────────────────────────────────────────────────────────

// GET reviews for a product
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add a review
router.post("/:id/reviews", async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text)
    return res.status(400).json({ error: "userId and text are required" });

  try {
    const review = await prisma.review.create({
      data: { productId: req.params.id, userId, text },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json(review);
  } catch (error) {
    if (error.code === "P2002")
      return res.status(409).json({ error: "You have already reviewed this product" });
    res.status(500).json({ error: error.message });
  }
});

// DELETE a review
router.delete("/reviews/:id", async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: "Review deleted" });
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Review not found" });
    res.status(500).json({ error: error.message });
  }
});

// ─── FAVOURITES ROUTES ────────────────────────────────────────────────────────

// GET user's favourite stores
router.get("/favourites/:userId", async (req, res) => {
  try {
    const favourites = await prisma.storeFavourite.findMany({
      where: { userId: req.params.userId },
      include: { store: { include: { products: true } } },
    });
    res.json(favourites.map((f) => f.store));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST toggle favourite (add if not exists, remove if exists)
router.post("/favourites", async (req, res) => {
  const { storeId, userId } = req.body;
  if (!storeId || !userId)
    return res.status(400).json({ error: "storeId and userId are required" });

  try {
    const existing = await prisma.storeFavourite.findUnique({
      where: { storeId_userId: { storeId, userId } },
    });

    if (existing) {
      await prisma.storeFavourite.delete({ where: { id: existing.id } });
      return res.json({ favourited: false });
    }

    await prisma.storeFavourite.create({ data: { storeId, userId } });
    res.status(201).json({ favourited: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
