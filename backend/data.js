// In-memory demo data for Eventribe. All events are fictional, created for
// this demo — none of this is copied from any reference site's listings.

const cities = ["Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad", "Goa"];

const categories = [
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "comedy", label: "Comedy", emoji: "🎤" },
  { id: "sports", label: "Sports", emoji: "🏟️" },
  { id: "festivals", label: "Festivals", emoji: "🎉" },
  { id: "theatre", label: "Theatre", emoji: "🎭" },
  { id: "workshops", label: "Workshops", emoji: "🛠️" },
];

let events = [
  {
    id: "evt-1001",
    title: "Monsoon Beats Rooftop Sessions",
    category: "music",
    city: "Mumbai",
    venue: "Skyline Terrace, Lower Parel",
    date: "2026-10-04",
    time: "19:30",
    priceFrom: 899,
    image: "🎧",
    blurb: "Indie and electronica acts trade sets as the city lights come up behind them.",
    tiers: [
      { id: "ga", name: "General Entry", price: 899, available: 120 },
      { id: "vip", name: "VIP Deck", price: 2199, available: 24 },
    ],
  },
  {
    id: "evt-1002",
    title: "Open Mic Uproar",
    category: "comedy",
    city: "Bengaluru",
    venue: "The Backyard Club, Indiranagar",
    date: "2026-10-11",
    time: "20:00",
    priceFrom: 349,
    image: "🎙️",
    blurb: "Ten comics, five minutes each, zero mercy. A rowdy night of new material.",
    tiers: [{ id: "ga", name: "General Entry", price: 349, available: 80 }],
  },
  {
    id: "evt-1003",
    title: "City Sprint Marathon",
    category: "sports",
    city: "Delhi NCR",
    venue: "Jawaharlal Nehru Stadium",
    date: "2026-11-02",
    time: "05:30",
    priceFrom: 599,
    image: "🏃",
    blurb: "10K and half-marathon routes through the city's autumn morning light.",
    tiers: [
      { id: "10k", name: "10K Run", price: 599, available: 500 },
      { id: "half", name: "Half Marathon", price: 999, available: 300 },
    ],
  },
  {
    id: "evt-1004",
    title: "Harvest Lantern Festival",
    category: "festivals",
    city: "Pune",
    venue: "Riverside Grounds",
    date: "2026-10-18",
    time: "17:00",
    priceFrom: 449,
    image: "🏮",
    blurb: "Food stalls, craft markets and a thousand lanterns released at dusk.",
    tiers: [
      { id: "day", name: "Day Pass", price: 449, available: 200 },
      { id: "weekend", name: "Weekend Pass", price: 799, available: 150 },
    ],
  },
  {
    id: "evt-1005",
    title: "Shadows of Kalidasa",
    category: "theatre",
    city: "Hyderabad",
    venue: "Ravindra Bharathi",
    date: "2026-10-25",
    time: "18:30",
    priceFrom: 499,
    image: "🎭",
    blurb: "A modern retelling of a classic, staged with shadow-puppet projections.",
    tiers: [
      { id: "balcony", name: "Balcony", price: 499, available: 90 },
      { id: "stalls", name: "Stalls", price: 899, available: 60 },
    ],
  },
  {
    id: "evt-1006",
    title: "Clay & Kiln: Pottery Weekend",
    category: "workshops",
    city: "Goa",
    venue: "Studio Terracotta, Assagao",
    date: "2026-11-08",
    time: "10:00",
    priceFrom: 1299,
    image: "🏺",
    blurb: "A two-day hands-on wheel-throwing workshop, glazing included.",
    tiers: [{ id: "seat", name: "Workshop Seat", price: 1299, available: 15 }],
  },
  {
    id: "evt-1007",
    title: "Bassline Underground",
    category: "music",
    city: "Bengaluru",
    venue: "Warehouse 9, Whitefield",
    date: "2026-10-31",
    time: "22:00",
    priceFrom: 1199,
    image: "🔊",
    blurb: "A Halloween warehouse rave with three rooms and a bass-heavy lineup.",
    tiers: [
      { id: "ga", name: "General Entry", price: 1199, available: 300 },
      { id: "vip", name: "VIP + Fast Lane", price: 2499, available: 40 },
    ],
  },
  {
    id: "evt-1008",
    title: "Stand-Up Showdown: Finals Night",
    category: "comedy",
    city: "Mumbai",
    venue: "Canvas Laugh Club, BKC",
    date: "2026-10-15",
    time: "20:30",
    priceFrom: 699,
    image: "🏆",
    blurb: "Six finalists, one trophy, and an audience vote that decides it.",
    tiers: [{ id: "ga", name: "General Entry", price: 699, available: 70 }],
  },
];

const bookings = new Map();

module.exports = { cities, categories, events, bookings };
