# STACKLY – Premium Food & Restaurant Website

**Taste the Excellence.** A complete multi-page restaurant frontend built with pure HTML5, CSS3 and Vanilla JavaScript (ES6+) — no frameworks. Animations powered by AOS and GSAP via CDN.

## Quick Start

No build step required.

```bash
# Option 1: just open index.html in a browser

# Option 2: serve locally (recommended, avoids any CORS quirks)
python3 -m http.server 8080
# → http://localhost:8080
```

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About | `about.html` |
| Services | `services.html` |
| Menu (filter/search/sort/cart) | `menu.html` |
| Pricing | `pricing.html` |
| Blog (filter/search/pagination) | `blog.html` |
| Blog Details (comments) | `blog-details.html` |
| Contact (validated form) | `contact.html` |
| Login (role-based demo) | `login.html` |
| Register (strength meter) | `register.html` |
| Forgot Password | `forgot-password.html` |
| 404 | `404.html` |
| User Dashboard | `dashboard/user-dashboard.html` |
| Admin Dashboard | `dashboard/admin-dashboard.html` |
| Seller Dashboard | `dashboard/seller-dashboard.html` |

## Demo Accounts (localStorage demo auth — NOT secure)

| Role | Email | Password |
|---|---|---|
| User | `user@stackly.com` | `User@123` |
| Admin | `admin@stackly.com` | `Admin@123` |
| Seller | `seller@stackly.com` | `Seller@123` |

Login redirects each role to its own dashboard. Registering a new account with a chosen role also routes correctly after login.

## Feature Map

- **Global**: branded preloader, sticky glass header, mobile hamburger nav, dropdown menu, scroll progress bar, back-to-top, toast notifications, cart drawer with localStorage persistence, quick-view modal, wishlist.
- **Home**: GSAP hero text reveal + parallax, animated counters, category filtering, countdown offers, auto-playing testimonial slider, FAQ accordion, newsletter validation.
- **Menu**: search, category filter, price/rating sort, add-to-cart, quantity controls, live totals (subtotal + GST + delivery).
- **Blog**: category filter, search, numbered pagination, comment form.
- **Dashboards**: sidebar panel switching, hand-rolled canvas charts (line/bar/donut) with no chart library, order status updates, product add/delete demos.

## Tech & Constraints

- HTML5 · CSS3 · Vanilla JS only — no React/Vue/jQuery/Bootstrap/Tailwind.
- AOS + GSAP (CDN) for animation; everything else is dependency-free.
- All images local WebP; icons via `assets/svg/sprite.svg`.
- Respects `prefers-reduced-motion`.
- Fully responsive: 1440 / 1024 / 768 / 425 / 375.

## Production Notes

- Auth, cart, orders and sessions are **frontend demos stored in localStorage**. For a real deployment, move authentication, authorization, payments and order processing to a secure backend.
- The checkout button, map block and image-upload zones are clearly marked stubs ready for backend integration.
