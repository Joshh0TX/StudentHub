const BASE = "http://localhost:5000/api/products";

export const fetchProducts = () =>
  fetch(BASE).then((r) => r.json());

export const fetchProduct = (id) =>
  fetch(`${BASE}/${id}`).then((r) => r.json());

export const createProduct = (data) =>
  fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateProduct = (id, data) =>
  fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteProduct = (id) =>
  fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.json());

export const fetchStore = (ownerId) =>
  fetch(`${BASE}/store/${ownerId}`).then((r) => r.json());

export const createStore = (data) =>
  fetch(`${BASE}/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateStore = (id, data) =>
  fetch(`${BASE}/store/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

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
