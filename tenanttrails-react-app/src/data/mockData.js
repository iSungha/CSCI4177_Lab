export const initialUsers = [
  {
    id: 1,
    name: "Garry Sangha",
    email: "garrysangha@dal.ca",
    password: "password123",
  },
];

export const apartments = [
  {
    id: 1,
    name: "The Marlstone",
    address: "5540 Spring Garden Rd",
    neighbourhood: "Spring Garden",
    landlord: "Marlstone Residential",
    units: 104,
    yearBuilt: 1998,
    rating: 5.0,
    reviews: 1,
    tags: ["No AI summary yet"],
    aiSummary:
      "Tenants report a quiet, well-kept building with strong access to downtown services. Review volume is still low, so future tenants should ask for more recent feedback before signing.",
    aiIssues: ["Quiet", "Central location", "Limited review data"],
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Park Victoria",
    address: "1496 Carlton St",
    neighbourhood: "South End",
    landlord: "Victoria Living",
    units: 88,
    yearBuilt: 1985,
    rating: 4.5,
    reviews: 2,
    tags: ["Well maintained", "Quiet", "Expensive"],
    aiSummary:
      "Reviews suggest the building is well maintained and quiet, with good access to the South End. The main concern is higher rent compared with nearby options.",
    aiIssues: ["Well maintained", "Quiet", "Expensive"],
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Le Marchant Towers",
    address: "1585 Le Marchant St",
    neighbourhood: "West End",
    landlord: "Killam Properties",
    units: 88,
    yearBuilt: 1976,
    rating: 3.7,
    reviews: 3,
    tags: ["Good location", "Parking limited", "Aging building"],
    aiSummary:
      "Tenants consistently praise the location and proximity to Quinpool Road shops. Parking availability is a recurring complaint, with multiple reviews mentioning waitlists exceeding six months. The building shows its age in hallway carpeting and elevator reliability, but unit interiors have been progressively updated.",
    aiIssues: ["Good location", "Parking limited", "Aging building", "Maintenance delays"],
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Fenwick Tower",
    address: "5599 Fenwick St",
    neighbourhood: "Downtown",
    landlord: "Fenwick Holdings",
    units: 140,
    yearBuilt: 1971,
    rating: 3.3,
    reviews: 3,
    tags: ["Elevator issues", "Great views", "Security concerns"],
    aiSummary:
      "Reviews are mixed. Tenants like the views and downtown access, but several mention elevator delays, security concerns, and inconsistent maintenance response times.",
    aiIssues: ["Elevator issues", "Security concerns", "Great views"],
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Southpoint Apartments",
    address: "1050 South Park St",
    neighbourhood: "South End",
    landlord: "Southpoint Rentals",
    units: 72,
    yearBuilt: 2004,
    rating: 2.5,
    reviews: 4,
    tags: ["No AI summary yet"],
    aiSummary:
      "Reviews mention convenient location but recurring issues with noise, heating, laundry access, and slow maintenance. Future tenants should inspect carefully and ask about recent repairs.",
    aiIssues: ["Noise", "Heating issues", "Laundry problems", "Slow maintenance"],
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  },
];

export const initialReviews = [
  {
    id: 101,
    apartmentId: 3,
    userId: 1,
    author: "Alex Mitchell",
    rating: 4,
    body: "Good building overall. Management is professional and responsive within 48 hours for most issues. Parking situation is genuinely bad though. I waited five months for a spot.",
    date: "2026-04-12",
  },
  {
    id: 102,
    apartmentId: 3,
    userId: 2,
    author: "Garry Sangha",
    rating: 4,
    body: "Lived here for two years. Quiet neighbours, solid construction, and the Quinpool Road location is extremely convenient.",
    date: "2026-04-20",
  },
  {
    id: 103,
    apartmentId: 5,
    userId: 2,
    author: "Garry Sangha",
    rating: 2,
    body: "Decent location near the park, but the building has issues. Heater in my unit broke during winter and it took four days to fix.",
    date: "2026-05-02",
  },
  {
    id: 104,
    apartmentId: 4,
    userId: 2,
    author: "Garry Sangha",
    rating: 3,
    body: "The view from the 28th floor is incredible. You can see the harbour. Dartmouth and the MacNabs Island. Location is unbeatable.",
    date: "2026-05-05",
  },
  {
    id: 105,
    apartmentId: 2,
    userId: 1,
    author: "Alex Mitchell",
    rating: 5,
    body: "Very quiet building and well maintained. Expensive, but the location and cleanliness make it worth it.",
    date: "2026-05-07",
  },
];