# The Bake Factory Website — Modular Architecture

A premium, modern multi-page web application for **The Bake Factory** café in Gachibowli, Hyderabad.

---

## 📁 Project Directory Layout

```
bake-factory-website/
│
├── index.html                   # Main Landing Page
│
├── pages/                       # Multi-page Application Views
│   ├── menu.html               # Full Interactive Menu & Live Search
│   ├── about.html              # Café Story & Culinary Mission
│   ├── gallery.html            # Lightbox Photo Viewer & Slider
│   ├── reviews.html            # Guest Ratings & Testimonials
│   ├── reservation.html        # Table Booking Form with WhatsApp Integration
│   └── contact.html            # Location, Map, Opening Hours & Support
│
├── css/                         # Clean Vanilla CSS Stylesheets
│   ├── style.css               # Core Styles, Variables, Components, Layouts
│   ├── responsive.css          # Mobile Navigation & Responsive Breakpoints
│   └── animations.css          # Keyframes, Scroll Reveal & Hover Micro-interactions
│
├── js/                          # Modular JavaScript Codebase
│   ├── main.js                 # Header Scroll, Mobile Nav & Global Modals
│   ├── menu.js                 # Asynchronous JSON Fetching, Search, Cart Drawer & WhatsApp Checkout
│   ├── reservation.js          # Booking Date Restrictions & WhatsApp Payload Handler
│   └── gallery.js              # Lightbox Image Viewer & Keyboard Slider Controls
│
├── data/                        # Structured JSON Data Store
│   └── menu.json               # 66 Complete Menu Items with Pricing & Tags
│
├── assets/                      # Optimized Media Assets
│   └── images/                 # High Quality Food, Bakery, & Ambience Images
│
└── README.md                    # Project Architecture & Setup Guide
```

---

## ⚡ Features & Capabilities

- **JSON-Driven Menu System (`menu.json`):** 66 dishes categorized into Breakfast, Pizzas, Sandwiches, Burgers, Salads, Fries, Coffee, and House Specials.
- **Interactive Cart & WhatsApp Ordering:** Real-time quantity increment/decrement, live price calculation, and direct formatted WhatsApp message generation.
- **Table Booking System:** Live date validation enforcing current date onwards and instant WhatsApp table reservation.
- **Responsive & Accessible Design:** Touch-friendly mobile navigation drawer, bottom mobile quick action bar, keyboard traps, and high accessibility compliance.
- **Performance Optimized:** Clean Vanilla CSS and native JS without heavy external dependencies.

---

## 🚀 Running Locally

Launch any static web server in the `bake-factory-website` directory:

```bash
# Using npx http-server
npx http-server . -p 8080

# Or using Python
python -m http.server 8080
```

Open your browser at `http://localhost:8080` to experience the website!
