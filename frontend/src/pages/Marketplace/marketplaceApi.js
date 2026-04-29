import { dummyProducts } from "./marketplaceData";
import API_BASE from "../../config";

const BASE = `${API_BASE}/api/products`;

export const fetchProducts = () =>
  fetch(BASE)
    .then((r) => r.json())
    .then((real) => {
      const realIds = new Set((Array.isArray(real) ? real : []).map((p) => p.id));
      const extras = dummyProducts.filter((d) => !realIds.has(d.id));
      return [...(Array.isArray(real) ? real : []), ...extras];
    })
    .catch(() => dummyProducts);

export const fetchProduct = (id) =>
  fetch(`${BASE}/${id}`).then((r) => r.json());

// POST create product (multipart)
export const createProduct = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === "images") {
      val.forEach((file) => form.append("images", file));
    } else if (key === "locations") {
      form.append("locations", JSON.stringify(val));
    } else if (val !== undefined && val !== null) {
      form.append(key, val);
    }
  });
  return fetch(BASE, { method: "POST", body: form }).then((r) => r.json());
};

export const updateProduct = (id, data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === "images") {
      val.forEach((file) => form.append("images", file));
    } else if (key === "locations") {
      form.append("locations", JSON.stringify(val));
    } else if (val !== undefined && val !== null) {
      form.append(key, val);
    }
  });
  return fetch(`${BASE}/${id}`, { method: "PUT", body: form }).then((r) => r.json());
};

export const deleteProduct = (id) =>
  fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.json());

export const fetchStore = (ownerId) =>
  fetch(`${BASE}/store/${ownerId}`).then((r) => r.json());

// Fetches store by store ID and increments visit count
export const fetchStoreById = (storeId) =>
  fetch(`${BASE}/store/view/${storeId}`).then((r) => r.json());

export const createStore = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === "image" && val) form.append("image", val);
    else if (key === "contacts") form.append("contacts", JSON.stringify(val));
    else if (val !== undefined && val !== null) form.append(key, val);
  });
  return fetch(`${BASE}/store`, { method: "POST", body: form })
    .then(async (r) => {
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || `Server error: ${r.status}`);
      return body;
    })
    .catch((err) => {
      console.error("createStore error:", err);
      throw err;
    });
};

export const updateStore = (id, data) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === "image" && val) form.append("image", val);
    else if (key === "contacts") form.append("contacts", JSON.stringify(val));
    else if (val !== undefined && val !== null) form.append(key, val);
  });
  return fetch(`${BASE}/store/${id}`, { method: "PUT", body: form }).then((r) => r.json());
};

export const placeOrder = (data) =>
  fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const fetchStoreOrders = (storeId) =>
  fetch(`${BASE}/orders/store/${storeId}`).then((r) => r.json());

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then((r) => r.json());

export const fetchReviews = (productId) =>
  fetch(`${BASE}/${productId}/reviews`).then((r) => r.json());

export const postReview = (productId, data) =>
  fetch(`${BASE}/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteReview = (reviewId) =>
  fetch(`${BASE}/reviews/${reviewId}`, { method: "DELETE" }).then((r) => r.json());

export const fetchFavourites = (userId) =>
  fetch(`${BASE}/favourites/${userId}`).then((r) => r.json());

export const toggleFavourite = (storeId, userId) =>
  fetch(`${BASE}/favourites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeId, userId }),
  }).then((r) => r.json());
