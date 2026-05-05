const express = require("express");
const router = express.Router();
const prisma = require("../../config/prisma");
const upload = require("../../middleware/upload.middleware");
const { uploadToSupabase } = require("../../middleware/upload.middleware");

// ─── STORE ROUTES ─────────────────────────────────────────────────────────────

// GET store by store ID (for StoreView) — increments visits
// NOTE: must be defined BEFORE /store/:ownerId to avoid "view" being matched as ownerId
router.get("/store/view/:storeId", async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.storeId },
      include: {
        contacts: true,
        products: {
          include: { _count: { select: { orders: true } } },
        },
      },
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
      include: {
        contacts: true,
        products: {
          include: { _count: { select: { orders: true } } },
        },
      },
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
  try {
    const image = req.file ? await uploadToSupabase(req.file) : null;
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
  try {
    const image = req.file ? await uploadToSupabase(req.file) : undefined;
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
      include: { product: true, buyer: { select: { id: true, f_name: true, l_name: true } } },
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
      include: {
        store: { include: { contacts: true } },
      },
    });

    // get avg ratings via raw SQL to avoid Prisma client cache issues
    const ratings = await prisma.$queryRaw`
      SELECT "productId",
             ROUND(AVG(rating)::numeric, 1)::float AS "avgRating",
             COUNT(*)::int AS "reviewCount"
      FROM "Review"
      GROUP BY "productId"
    `;

    const ratingMap = {};
    ratings.forEach((r) => {
      ratingMap[r.productId] = { avgRating: r.avgRating, reviewCount: r.reviewCount };
    });

    const withRating = products.map((p) => ({
      ...p,
      avgRating: ratingMap[p.id]?.avgRating ?? null,
      reviewCount: ratingMap[p.id]?.reviewCount ?? 0,
    }));

    res.json(withRating);
  } catch (error) {
    console.error("GET /api/products error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await prisma.$queryRaw`
      SELECT r.id, r."productId", r."userId", r.rating, r.text, r."createdAt",
             u.id AS "user_id", u.f_name AS "user_f_name", u.l_name AS "user_l_name"
      FROM "Review" r
      LEFT JOIN "User" u ON u.id = r."userId"
      WHERE r."productId" = ${req.params.id}
      ORDER BY r."createdAt" DESC
    `;
    // reshape to match expected format
    const shaped = reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      rating: r.rating,
      text: r.text,
      createdAt: r.createdAt,
      user: r.user_id ? { id: r.user_id, f_name: r.user_f_name, l_name: r.user_l_name } : null,
    }));
    res.json(shaped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/reviews", async (req, res) => {
  const { userId, text, rating } = req.body;
  if (!userId || !rating)
    return res.status(400).json({ error: "userId and rating are required" });
  const parsedRating = parseInt(rating);
  if (parsedRating < 1 || parsedRating > 5)
    return res.status(400).json({ error: "rating must be between 1 and 5" });
  try {
    const id = require("crypto").randomUUID();
    const safeText = text && text.trim() ? text.trim() : "";
    await prisma.$executeRaw`
      INSERT INTO "Review" (id, "productId", "userId", rating, text, "createdAt")
      VALUES (${id}, ${req.params.id}, ${userId}, ${parsedRating}, ${safeText}, NOW())
    `;
    const rows = await prisma.$queryRaw`
      SELECT r.id, r."productId", r."userId", r.rating, r.text, r."createdAt",
             u.id AS "user_id", u.f_name AS "user_f_name", u.l_name AS "user_l_name"
      FROM "Review" r
      LEFT JOIN "User" u ON u.id = r."userId"
      WHERE r.id = ${id}
    `;
    const r = rows[0];
    res.status(201).json({
      id: r.id, productId: r.productId, userId: r.userId,
      rating: r.rating, text: r.text, createdAt: r.createdAt,
      user: r.user_id ? { id: r.user_id, f_name: r.user_f_name, l_name: r.user_l_name } : null,
    });
  } catch (error) {
    if (error.message?.includes("unique") || error.code === "P2002")
      return res.status(409).json({ error: "You have already reviewed this product" });
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        store: { include: { contacts: true } },
        _count: { select: { orders: true } },
      },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
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
  try {
    const images = req.files?.length
      ? await Promise.all(req.files.map((f) => uploadToSupabase(f)))
      : [];
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
  try {
    const newImages = req.files?.length
      ? await Promise.all(req.files.map((f) => uploadToSupabase(f)))
      : undefined;
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
