# Eventribe (eventribe.in) — demo

A small full-stack demo inspired by the UI/UX patterns of thumpn.com (dark
theme, city + category filters, event cards, ticket booking flow) — rebranded
as **eventribe.in**, with an independent Express API and vanilla-JS frontend.
All events are fictional demo data, not copied from any reference site.

## Structure

```
eventribe/
  backend/     Express REST API (in-memory data)
  frontend/    Plain HTML/CSS/JS site that calls the API
```

## Run the backend

```bash
cd backend
npm install
npm start
```

Starts the API at `http://localhost:4000`. Endpoints:

- `GET  /api/cities`
- `GET  /api/categories`
- `GET  /api/events?city=&category=&q=`
- `GET  /api/events/:id`
- `POST /api/bookings`   `{ eventId, tierId, quantity, name, email }`
- `GET  /api/bookings/:id`

## Run the frontend

The frontend is static — no build step. Easiest way to serve it (so
`fetch` works without CORS/file:// issues):

```bash
cd frontend
npx serve .
# or: python3 -m http.server 5173
```

Then open the printed local URL. It expects the API at
`http://localhost:4000` (see `API_BASE` in `app.js` — change it if you
run the backend elsewhere).

## What changed from the reference UI

- Rebranded name/logo throughout to **eventribe.in**
- Original color tokens, type pairing (Space Grotesk + Inter), and card layout
- Original demo events, categories and copy — nothing scraped or reused
- No "Shadow"-style AI companion feature (out of scope for this demo)

## Ideas to extend

- Swap the in-memory arrays in `backend/data.js` for a real database
- Add auth so bookings attach to a logged-in user
- Add a "My Bookings" page using `GET /api/bookings/:id`
