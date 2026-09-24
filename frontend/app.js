const API_BASE = "https://eventribe-backend-v63h.onrender.com/api";

const state = {
  city: localStorage.getItem("eventribe_city") || "All Cities",
  category: "all",
  query: "",
};

async function api(path, opts) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

function qs(params) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && p.set(k, v));
  return p.toString();
}

// ---------------------------------------------------------------- Home page

async function renderHomePage() {
  const [cities, categories] = await Promise.all([
    api("/cities"),
    api("/categories"),
  ]);

  const citySelect = document.getElementById("citySelect");
  citySelect.innerHTML = ["All Cities", ...cities]
    .map((c) => `<option value="${c}" ${c === state.city ? "selected" : ""}>${c}</option>`)
    .join("");
  citySelect.addEventListener("change", () => {
    state.city = citySelect.value;
    localStorage.setItem("eventribe_city", state.city);
    loadEvents();
  });

  const chips = document.getElementById("chips");
  const allCats = [{ id: "all", label: "All", emoji: "✨" }, ...categories];
  chips.innerHTML = allCats
    .map(
      (c) =>
        `<button class="chip ${c.id === state.category ? "active" : ""}" data-cat="${c.id}">${c.emoji} ${c.label}</button>`
    )
    .join("");
  chips.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      chips.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadEvents();
    });
  });

  let debounce;
  document.getElementById("searchInput").addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.query = e.target.value;
      loadEvents();
    }, 250);
  });

  loadEvents();
}

async function loadEvents() {
  const grid = document.getElementById("grid");
  grid.innerHTML = `<div class="empty">Loading events…</div>`;
  try {
    const events = await api(
      `/events?${qs({ city: state.city, category: state.category, q: state.query })}`
    );
    if (!events.length) {
      grid.innerHTML = `<div class="empty">No events match those filters yet. Try another city or category.</div>`;
      return;
    }
    grid.innerHTML = events.map(renderCard).join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty">Couldn't reach the Eventribe API — make sure the backend is running on port 4000.<br><small>${err.message}</small></div>`;
  }
}

function renderCard(e) {
  const dateLabel = new Date(`${e.date}T${e.time}`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  return `
    <a class="card" href="event.html?id=${e.id}">
      <div class="card-art">${e.image}</div>
      <div class="card-body">
        <div class="card-cat">${e.category.toUpperCase()}</div>
        <div class="card-title">${e.title}</div>
        <div class="card-meta">${e.venue}, ${e.city}</div>
        <div class="card-meta">${dateLabel} · ${e.time}</div>
        <div class="card-foot">
          <div class="card-price"><small>from </small>₹${e.priceFrom}</div>
          <span class="btn">View</span>
        </div>
      </div>
    </a>`;
}

// ------------------------------------------------------------- Event page

let currentEvent = null;
let selectedTier = null;
let qty = 1;

async function renderEventPage() {
  const id = new URLSearchParams(location.search).get("id");
  const detail = document.getElementById("detail");
  if (!id) {
    detail.innerHTML = `<div class="empty">No event selected.</div>`;
    return;
  }
  try {
    currentEvent = await api(`/events/${id}`);
    selectedTier = currentEvent.tiers[0];
    drawEventPage();
  } catch (err) {
    detail.innerHTML = `<div class="empty">Couldn't load this event.<br><small>${err.message}</small></div>`;
  }
}

function drawEventPage() {
  const e = currentEvent;
  const dateLabel = new Date(`${e.date}T${e.time}`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  document.getElementById("detail").innerHTML = `
    <div>
      <div class="detail-art">${e.image}</div>
      <div class="card-cat">${e.category.toUpperCase()}</div>
      <h1>${e.title}</h1>
      <div class="meta-row">📍 ${e.venue}, ${e.city}</div>
      <div class="meta-row">🗓️ ${dateLabel} · ${e.time}</div>
      <p class="blurb">${e.blurb}</p>
    </div>
    <div class="panel">
      <h3>Select tickets</h3>
      <div id="tiers"></div>
      <div class="qty" style="margin-top:14px;">
        <button id="qtyMinus">–</button>
        <span id="qtyLabel">${qty}</span>
        <button id="qtyPlus">+</button>
      </div>
      <div class="total-row"><span>Total</span><span id="totalLabel">₹0</span></div>
      <div id="bookingForm"></div>
      <div id="bookingMsg"></div>
    </div>`;

  document.getElementById("tiers").innerHTML = e.tiers
    .map(
      (t) => `
      <div class="tier">
        <div>
          <div class="tier-name">${t.name} — ₹${t.price}</div>
          <div class="tier-avail">${t.available} left</div>
        </div>
        <input type="radio" name="tier" value="${t.id}" ${t.id === selectedTier.id ? "checked" : ""} />
      </div>`
    )
    .join("");

  document.querySelectorAll('input[name="tier"]').forEach((r) =>
    r.addEventListener("change", () => {
      selectedTier = e.tiers.find((t) => t.id === r.value);
      qty = 1;
      updateTotal();
    })
  );

  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    updateTotal();
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(selectedTier.available, qty + 1);
    updateTotal();
  });

  document.getElementById("bookingForm").innerHTML = `
    <div class="field"><label>Full name</label><input id="fName" placeholder="Your name" /></div>
    <div class="field"><label>Email</label><input id="fEmail" placeholder="you@example.com" /></div>
    <button class="btn" id="bookBtn" style="width:100%;">Book now</button>`;

  document.getElementById("bookBtn").addEventListener("click", submitBooking);

  updateTotal();
}

function updateTotal() {
  document.getElementById("qtyLabel").textContent = qty;
  document.getElementById("totalLabel").textContent = `₹${selectedTier.price * qty}`;
}

async function submitBooking() {
  const name = document.getElementById("fName").value.trim();
  const email = document.getElementById("fEmail").value.trim();
  const msg = document.getElementById("bookingMsg");

  try {
    const booking = await api("/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: currentEvent.id,
        tierId: selectedTier.id,
        quantity: qty,
        name,
        email,
      }),
    });
    document.querySelector(".panel").innerHTML = `
      <div class="confirm">
        <h3>You're in 🎟️</h3>
        <div class="code">${booking.id}</div>
        <p class="msg ok">${booking.quantity} × ${booking.tierName} — ₹${booking.total} total.<br/>Confirmation sent to ${booking.email}.</p>
        <a class="btn secondary" href="index.html">Browse more events</a>
      </div>`;
  } catch (err) {
    msg.innerHTML = `<div class="msg error">${err.message}</div>`;
  }
}
