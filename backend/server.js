const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");
const { cities, categories, events, bookings } = require("./data");

const app = express();
app.use(cors());
app.use(express.json());

// -- Reference data -----------------------------------------------------

app.get("/api/cities", (req, res) => res.json(cities));
app.get("/api/categories", (req, res) => res.json(categories));

// -- Events ---------------------------------------------------------------

app.get("/api/events", (req, res) => {
  const { city, category, q } = req.query;
  let results = events;

  if (city && city !== "All Cities") {
    results = results.filter((e) => e.city === city);
  }
  if (category && category !== "all") {
    results = results.filter((e) => e.category === category);
  }
  if (q) {
    const needle = q.toLowerCase();
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(needle) ||
        e.venue.toLowerCase().includes(needle) ||
        e.city.toLowerCase().includes(needle)
    );
  }

  res.json(results);
});

app.get("/api/events/:id", (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

// -- Bookings ---------------------------------------------------------------

app.post("/api/bookings", (req, res) => {
  const { eventId, tierId, quantity, name, email } = req.body;

  const event = events.find((e) => e.id === eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const tier = event.tiers.find((t) => t.id === tierId);
  if (!tier) return res.status(404).json({ error: "Ticket tier not found" });

  const qty = Number(quantity) || 0;
  if (qty < 1) return res.status(400).json({ error: "Quantity must be at least 1" });
  if (qty > tier.available) {
    return res.status(400).json({ error: `Only ${tier.available} tickets left in this tier` });
  }
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  tier.available -= qty;

  const booking = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    eventId,
    eventTitle: event.title,
    tierId,
    tierName: tier.name,
    quantity: qty,
    unitPrice: tier.price,
    total: tier.price * qty,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  bookings.set(booking.id, booking);
  res.status(201).json(booking);
});

app.get("/api/bookings/:id", (req, res) => {
  const booking = bookings.get(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Eventribe API running on http://localhost:${PORT}`);
});
