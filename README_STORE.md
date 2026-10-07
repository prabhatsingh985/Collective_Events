# CollectorEvents Online Collector Store ⚡🏎️⚽
**High-Fidelity Online Store for Hot Wheels / Die-Cast Toy Cars & Sports Trading Cards (Panini / Topps)**

A production-grade, collector-focused Next.js App Router frontend seamlessly integrated into the CollectorEvents platform. Built with Next.js 14, TypeScript (strict), Tailwind CSS, Zustand, and Framer Motion.

---

## 🏎️ Collector Cultural Identity & Design Direction

- **Hot Wheels Speed Lane**: Racing energy with `hw.orange` (`#ff5400`), `hw.yellow` (`#ffd000`), `hw.flame` (`#e01a00`), and carbon black accents. Displays authentic 1:64 scale casting names, Spectraflame paint, Real Riders rubber tire badges, unpunched short/long blister card conditions (MOC), and BIS Toy Safety compliance (IS 9873).
- **Trading Cards Vault Lane**: Stadium pack-rip energy with `cards.emerald` (`#00d4aa`), `cards.stadium` (`#0f172a`), and `cards.gold` (`#eab308`). Features holographic foil shine micro-interactions (`card-foil-shine`), Panini Prizm & Topps Chrome wax, PSA 10 Gem Mint and BGS 9.5 True Gem slabs with quad subgrades, and on-card autographs.
- **Urgency & Unique Quantity Lock**: Rare single cards and graded slabs (`isUniqueItem: true`) strictly lock quantity to 1 copy with an urgency indicator (*"Only 1 Available In Vault"*). Mainlines, sealed boxes, and protective supplies support standard quantity steppers.

---

## 📱 Pages Built & Routes

| Page Route | Purpose & Collector Features |
| :--- | :--- |
| **`/shop`** | **Home Page**: Dual-lane split hero (Hot Wheels Paddock vs Cards Stadium), interactive pack-opening teaser widget, live next drop countdown banner, curated shelves ($TH Vault, Rookies & Autos, Sealed Wax, New Arrivals, Supplies, Series navigation), and drop alerts signup. |
| **`/shop/hot-wheels`** | **Hot Wheels Catalog**: Multi-attribute filtering (Series: Super $TH, RLC, Car Culture; Packaging Condition: MOC, short card; Price range; In-stock only; Grid/List switcher). |
| **`/shop/cards`** | **Sports Cards Catalog**: Sport & League filters (Premier League, UCL, La Liga), Rookie RC shield toggle, Certified on-card auto toggle, Graded PSA/BGS filter. |
| **`/shop/sealed`** | **Factory Sealed Wax**: Hobby boxes, retail blasters, mega boxes with intact manufacturer hologram shrink-wrap. |
| **`/shop/graded`** | **Graded Slabs Vault**: PSA 10 Gem Mint and Beckett BGS 9.5 True Gem slabs with subgrades and verifiable cert numbers. |
| **`/shop/supplies`** | **Armored Supplies**: 0.50mm acid-free crystal PET clamshell protectors for Hot Wheels cards, 35pt magnetic one-touch card holders. |
| **`/shop/search`** | **Instant Search Results**: Filtered results page with live query sync and suggestion history. |
| **`/shop/products/[slug]`** | **Product Detail Page (PDP)**: Multi-angle interactive gallery with hover zoom lens, deep collector specs table, condition guide, Indian pincode delivery estimator (BlueDart Air), armored packaging promise, tabbed info (Details, Shipping, Q&A, Verified Reviews), Add to Cart & Buy Now. |
| **`/shop/drops`** | **Grail Drops Calendar**: Live & upcoming limited allocations with countdown timers, customer purchase limits, and priority waitlist join. |
| **`/shop/drops/[slug]`** | **Drop Detail**: Real-time stock allocation bar (e.g. 9 of 35 left), 10-minute cart reservation hold countdown, waitlist confirmation. |
| **`/shop/cart`** | **Full Cart Page**: Line items, quantity edit, save-for-later, free BlueDart shipping progress bar (₹999+), coupon validation (e.g. `CRATE10`, `MINT200`), 10-min reservation timer, high-value COD warning. |
| **`/shop/checkout`** | **Multi-Step Checkout**: Step 1 Address (saved address selector + new address modal), Step 2 Delivery (BlueDart Air Express vs Standard), Step 3 Payment (UPI with VPA check, Cards, Netbanking, COD with ₹7.5k rule), Step 4 Review & authorization. |
| **`/shop/order-success`** | **Order Confirmation**: Celebratory confetti, order number, printable tax invoice, live BlueDart AWB tracking. |
| **`/shop/account`** | **Collector Hub**: Order tracking timeline (*Packed → Label Generated → Picked Up → In Transit → Out for Delivery → Delivered*), Return/Replacement flow with photo upload UI, Wishlist, Saved addresses, Restock alerts, "Add to My Collection" button after delivery. |
| **`/shop/admin`** | **Seller / Admin Store Hub**: KPI metrics cards, 7-day revenue Recharts area chart, inline stock edit inventory table with low-stock badges, order dispatch status actions, drops scheduler, coupons manager, bulk CSV drag & drop import. |
| **Trust Pages** | `/shop/authenticity`, `/shop/shipping`, `/shop/returns`, `/shop/faq`, `/shop/about`, `/shop/contact`, `/shop/terms`, `/shop/privacy`. |

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom collector tokens (`hw`, `cards`, keyframes)
- **State Management**: Zustand (`lib/store/useStore.ts`) with `localStorage` persistence for:
  - Cart items & 10-minute drop reservation timer
  - Wishlist items
  - Recently viewed collector items
  - Recent search history
  - Customer addresses
  - Order history & return requests
- **Data Access Layer**: Clean Promise-based API layer (`lib/api/*.ts`) returning typed data models with realistic delays, ready for backend integration with zero UI changes.
- **Charts**: Recharts (`AreaChart`, `ResponsiveContainer`, `Tooltip`)
- **Micro-Interactions**: Framer Motion transitions, holographic foil sheen, 3D card tilt, confetti animations.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Visit [http://localhost:3000/shop](http://localhost:3000/shop) to experience the online store.
