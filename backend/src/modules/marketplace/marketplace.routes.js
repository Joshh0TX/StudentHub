const express = require("express");
const router = express.Router();
const prisma = require("../../config/prisma");
const upload = require("../../middleware/upload.middleware");

// ─── STORE ROUTES ─────────────────────────────────────────────────────────────

// GET store by store ID (for StoreView) — increments visits
// NOTE: must be defined BEFORE /store/:ownerId to avoid "view" being matched as ownerId
router.get("/store/view/:storeId", async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.storeId },
      include: { contacts: true, products: true },
    });
    if (!store) return res.status(404).json({ error: "Store not found" });
    prisma.store.update({ where: { id: req.params.storeId }, data: { visits: { increment: 1 } } }).catch(() => {});
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.post("/store", upload.single("image"), async (req, res) => {
  const { name, description, type, ownerId, contacts } = req.body;
  if (!name || !ownerId)
    return res.status(400).json({ error: "name and ownerId are required" });
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const store = await prisma.store.create({
      data: { name, description, type: type || "goods", image, ownerId, contacts: { create: contacts ? JSON.parse(contacts) : [] } },
      include: { contacts: true },
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/store/:id", upload.single("image"), async (req, res) => {
  const { name, description, type, contacts } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: {
        name, description, type,
        ...(image && { image }),
        contacts: contacts ? { deleteMany: {}, create: JSON.parse(contacts) } : undefined,
      },
      include: { contacts: true },
    });
    res.json(store);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Store not found" });
    res.status(500).json({ error: error.message });
  }
});

// ─── ORDER ROUTES ─────────────────────────────────────────────────────────────

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

router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "status is required" });
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json(order);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Order not found" });
    res.status(500).json({ error: error.message });
  }
});

// ─── FAVOURITES ROUTES ────────────────────────────────────────────────────────

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

// ─── REVIEW ROUTES ────────────────────────────────────────────────────────────
// NOTE: must be defined BEFORE /:id and /:id/* to avoid "reviews" being matched as a product id

router.delete("/reviews/:id", async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: "Review deleted" });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Review not found" });
    res.status(500).json({ error: error.message });
  }
});

// ─── PRODUCT ROUTES ───────────────────────────────────────────────────────────

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

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { store: { include: { contacts: true } } },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    // increment visits in background, don't block response
    prisma.product.update({ where: { id: req.params.id }, data: { visits: { increment: 1 } } }).catch(() => {});
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", upload.array("images", 4), async (req, res) => {
  const { name, description, price, type, category, locations, storeId } = req.body;
  if (!name || !price || !category || !storeId)
    return res.status(400).json({ error: "name, price, category and storeId are required" });
  const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
  try {
    const product = await prisma.product.create({
      data: {
        name, description, price: parseFloat(price), images,
        type: type || "goods", category,
        locations: locations ? JSON.parse(locations) : [],
        storeId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", upload.array("images", 4), async (req, res) => {
  const { name, description, price, type, category, locations } = req.body;
  const newImages = req.files?.length ? req.files.map((f) => `/uploads/${f.filename}`) : undefined;
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name, description,
        price: price ? parseFloat(price) : undefined,
        type, category,
        locations: locations ? JSON.parse(locations) : undefined,
        ...(newImages && { images: newImages }),
      },
    });
    res.json(product);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Product not found" });
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Product not found" });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
