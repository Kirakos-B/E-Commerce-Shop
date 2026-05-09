# PROJECT_CONTEXT.md — Emu Shop 🦅
> **Purpose:** This file enables any future AI chat to instantly continue development with full context. Read this entirely before doing anything.

---

## Project Overview

**Name:** Emu Shop  
**Type:** Full-stack e-commerce web application for a tailor shop  
**GitHub:** https://github.com/Kirakos-B/E-Commerce-Shop.git  
**Developer OS:** Windows  
**Current Stage:** ~85% complete — backend fully done, frontend Steps 1–10 done, polish/fixes remaining  

### Main Goals
- A tailor shop web app where users can browse products, place regular orders (with or without an account), submit custom clothing orders with measurements, leave reviews, and share community posts.
- Admins get a full management panel with graphical dashboard, and can manage products, orders, custom orders, users, feedback, and posts.

### Two Actors
1. **User** — register, login, order products (guest checkout supported), submit custom orders, leave feedback, share posts, manage profile/sizes
2. **Admin** — full CRUD on everything, dashboard with charts, manage all entities

---

## Architecture & Tech Stack

### Monorepo Structure
```
E-Commerce-Shop/           ← git root, no package.json here
├── client/                ← Vite + React + TypeScript frontend
├── server/                ← Node + Express + TypeScript backend
├── .gitignore
├── .env.example
└── README.md
```

### Frontend (`client/`)
| Layer | Tech |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v3 + custom CSS classes |
| Routing | React Router DOM v6 |
| HTTP Client | Axios (with interceptors) |
| State | React Context (AuthContext + CartContext) |
| Charts | Recharts |
| Icons | Lucide React |
| UI Primitives | Radix UI (installed manually, no shadcn CLI preset) |
| Utilities | clsx + tailwind-merge (cn() helper) |
| Fonts | Google Fonts — Inter (sans) + Playfair Display (serif) |

### Backend (`server/`)
| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript (compiled with ts-node + nodemon in dev) |
| Database | MongoDB Atlas via Mongoose v9.6.1 |
| Auth | JWT (jsonwebtoken) + bcryptjs + httpOnly cookies |
| File Uploads | Multer (memory storage) + Cloudinary |
| Env | dotenv |
| CORS | cors package, origin: http://localhost:5173 |

### Color Theme
```
Primary (dark teal):   #004643  → Tailwind: bg-primary, text-primary
Primary light:         #006B65  → bg-primary-light
Primary dark:          #002E2C  → bg-primary-dark
Secondary (sand):      #F0EDE5  → bg-secondary, text-secondary
Secondary dark:        #D9D4C7  → bg-secondary-dark
```

---

## Full Folder Structure

### Backend (`server/src/`)
```
server/
├── src/
│   ├── config/
│   │   ├── db.ts              ← MongoDB connection (connectDB)
│   │   └── cloudinary.ts      ← Cloudinary config + connectCloudinary()
│   ├── controllers/
│   │   ├── authController.ts  ← register, login, logout, getMe, updateProfile, updatePassword
│   │   ├── productController.ts ← getProducts, getProduct, createProduct, updateProduct, deleteProduct
│   │   ├── orderController.ts ← createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, cancelOrder
│   │   ├── customOrderController.ts ← createCustomOrder, getMyCustomOrders, getAllCustomOrders, getCustomOrder, updateCustomOrder
│   │   ├── feedbackController.ts ← createFeedback, getProductFeedback, getAllFeedback, deleteFeedback
│   │   ├── postController.ts  ← createPost, getPosts, getAllPosts, likePost, approvePost, deletePost
│   │   ├── adminController.ts ← getDashboard, getAllUsers, getUser, updateUserRole, deleteUser, getSalesStats, getOrderStats
│   │   └── uploadController.ts ← uploadSingle, uploadMultiple
│   ├── middleware/
│   │   ├── auth.ts            ← protect, adminOnly, optionalProtect
│   │   ├── errorMiddleware.ts ← global error handler (4-param Express middleware)
│   │   └── upload.ts          ← multer config (memoryStorage, 5MB limit, image types only)
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── CustomOrder.ts
│   │   ├── Feedback.ts
│   │   └── Post.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── customOrderRoutes.ts
│   │   ├── feedbackRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── adminRoutes.ts
│   │   └── uploadRoutes.ts
│   ├── types/
│   │   └── index.ts           ← IUser, IProduct, IOrder, ICustomOrder, IFeedback, IPost + all enums
│   ├── utils/
│   │   ├── errorHandler.ts    ← AppError class
│   │   ├── jwt.ts             ← generateToken, sendTokenResponse
│   │   └── uploadToCloudinary.ts ← uploadToCloudinary, deleteFromCloudinary
│   └── index.ts               ← Express app entry point
├── .env                       ← NOT committed
├── nodemon.json
├── package.json
└── tsconfig.json
```

### Frontend (`client/src/`)
```
client/src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         ← sticky, auth-aware, cart count, mobile menu, dropdown
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx     ← wraps Navbar + children + Footer
│   │   ├── AdminSidebar.tsx   ← nav links with active highlight
│   │   └── AdminLayout.tsx    ← sidebar + main content area
│   └── shared/
│       ├── ProtectedRoute.tsx ← redirects if not auth or not admin
│       ├── Spinner.tsx        ← sm/md/lg sizes
│       ├── ProductCard.tsx    ← image, badges, rating, price, add-to-cart
│       ├── StatusBadge.tsx    ← color-coded status pill
│       └── StatCard.tsx       ← admin dashboard stat card with icon
├── context/
│   ├── AuthContext.tsx        ← user, token, login, register, logout, isAuthenticated, isAdmin
│   └── CartContext.tsx        ← items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice
├── hooks/                     ← (empty, reserved for future custom hooks)
├── lib/
│   └── utils.ts               ← cn() helper (clsx + tailwind-merge)
├── pages/
│   ├── user/
│   │   ├── Home.tsx           ← hero, features bar, categories, featured products, CTA
│   │   ├── Shop.tsx           ← grid, search, category tabs, price filter, pagination
│   │   ├── ProductDetail.tsx  ← images, quantity, add-to-cart, reviews section
│   │   ├── Cart.tsx           ← item list, quantity controls, order summary
│   │   ├── Checkout.tsx       ← guest info (if not logged in), shipping, payment method, notes
│   │   ├── OrderConfirmation.tsx
│   │   ├── CustomOrder.tsx    ← 3-step form: Design → Measurements → Review
│   │   ├── CustomOrderConfirmation.tsx
│   │   ├── Profile.tsx        ← 3 tabs: Profile / My Sizes / Password
│   │   ├── MyOrders.tsx       ← order list with status badges
│   │   ├── OrderDetail.tsx    ← full order detail + cancel
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Community.tsx      ← posts feed, create post, like/unlike, delete own post
│   └── admin/
│       ├── Dashboard.tsx      ← stat cards, revenue line chart, orders pie chart, recent orders, low stock
│       ├── AdminProducts.tsx  ← table + modal form (create/edit/delete)
│       ├── AdminOrders.tsx    ← table with inline status dropdowns
│       ├── AdminCustomOrders.tsx ← table + modal (review, price, notes, delivery date)
│       ├── AdminUsers.tsx     ← table, role change, delete (can't delete self)
│       ├── AdminFeedback.tsx  ← list with delete
│       └── AdminPosts.tsx     ← pending vs approved sections, approve/delete
├── services/
│   ├── api.ts                 ← axios instance, token interceptor, 401 handler
│   ├── productService.ts      ← getProducts, getProduct
│   ├── orderService.ts        ← createOrder, getMyOrders, getOrder, cancelOrder
│   ├── customOrderService.ts  ← createCustomOrder, getMyCustomOrders, getCustomOrder
│   ├── feedbackService.ts     ← createFeedback, getProductFeedback, deleteFeedback
│   ├── postService.ts         ← getPosts, createPost, likePost, deletePost
│   ├── userService.ts         ← getMe, updateProfile, updatePassword
│   └── adminService.ts        ← getDashboard, getAllUsers, updateUserRole, deleteUser, getAllOrdersAdmin, updateOrderStatus, getAllCustomOrdersAdmin, updateCustomOrderAdmin, getAllFeedbackAdmin, deleteFeedbackAdmin, getAllPostsAdmin, approvePost, deletePostAdmin, createProductAdmin, updateProductAdmin, deleteProductAdmin
├── types/
│   └── index.ts               ← User, Product, Order, CustomOrder, Feedback, Post, CartItem, Address, Sizes, ApiResponse, ProductCategory
├── utils/                     ← (empty, reserved)
├── App.tsx                    ← all routes defined here
├── main.tsx                   ← wraps App in AuthProvider + CartProvider
└── index.css                  ← Tailwind directives + custom @layer components
```

---

## Database Schema (MongoDB / Mongoose)

### User
```
name: String (required)
email: String (required, unique, lowercase)
password: String (required, select: false, hashed with bcrypt salt 12)
role: 'user' | 'admin' (default: 'user')
avatar: String?
phone: String?
address: { street, city, state, country, zip }?
sizes: { chest, waist, hips, shoulder, inseam }? (all Number, in cm)
timestamps: true
methods: comparePassword(candidatePassword) → Promise<boolean>
```

### Product
```
name: String (required)
description: String (required)
price: Number (required, min 0)
category: enum ['suits','shirts','trousers','dresses','jackets','traditional','accessories','other']
images: [String] (Cloudinary URLs)
stock: Number (default 0)
ratings: { average: Number (default 0), count: Number (default 0) }
isFeatured: Boolean (default false)
isAvailable: Boolean (default true)
timestamps: true
index: { name: 'text', description: 'text' } for keyword search
```

### Order
```
user: ObjectId ref User (optional — guest checkout)
guestInfo: { name, email, phone }? (required if no user)
items: [{ product: ObjectId, name, image, price, quantity }]
shippingAddress: { street, city, state, country, zip } (all required)
paymentMethod: 'cash' | 'card' | 'transfer' (required)
paymentStatus: 'unpaid' | 'paid' | 'refunded' (default: 'unpaid')
orderStatus: 'pending'|'confirmed'|'processing'|'shipped'|'delivered'|'cancelled' (default: 'pending')
totalPrice: Number (required, calculated server-side)
notes: String?
timestamps: true
```
**Important:** Stock is auto-decremented when order is created.

### CustomOrder
```
user: ObjectId ref User (optional)
guestInfo: { name, email, phone }?
designDescription: String (required)
fabric: 'cotton'|'silk'|'wool'|'linen'|'polyester'|'blend'|'other' (required)
color: String (required)
measurements: { chest, waist, hips, shoulder, inseam, height, weight, notes }? (all optional)
referenceImages: [String]
estimatedPrice: Number?
finalPrice: Number?
status: 'pending'|'reviewing'|'approved'|'in_progress'|'ready'|'delivered'|'cancelled' (default: 'pending')
adminNotes: String?
deliveryDate: Date?
timestamps: true
```

### Feedback
```
user: ObjectId ref User (required)
product: ObjectId ref Product (optional)
order: ObjectId ref Order (optional)
rating: Number (1-5, required)
comment: String (required)
timestamps: true
unique index: { user, product } sparse — one review per product per user
```
**Important:** Creating feedback auto-updates Product.ratings.average and ratings.count.

### Post
```
user: ObjectId ref User (required)
caption: String (required)
images: [String]
likes: [ObjectId ref User]
isApproved: Boolean (default: false) ← must be approved by admin before showing in feed
timestamps: true
```

---

## API Routes Reference

### Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /register | Public | Register new user |
| POST | /login | Public | Login, returns JWT |
| POST | /logout | Private | Clears token cookie |
| GET | /me | Private | Get current user |
| PUT | /me | Private | Update profile/address |
| PUT | /password | Private | Change password |

### Products — `/api/products`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | / | Public | Get all (filter: keyword, category, price, page) |
| GET | /:id | Public | Get single product |
| POST | / | Admin | Create product |
| PUT | /:id | Admin | Update product |
| DELETE | /:id | Admin | Delete product + Cloudinary images |

### Orders — `/api/orders`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | / | Public+optionalAuth | Create order (guest or user) |
| GET | /my | Private | Get my orders |
| GET | /:id | Private | Get single order (owner or admin) |
| PUT | /:id/cancel | Private | Cancel order |
| GET | / | Admin | Get all orders |
| PUT | /:id/status | Admin | Update orderStatus + paymentStatus |

### Custom Orders — `/api/custom-orders`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | / | Public+optionalAuth | Submit custom order |
| GET | /my | Private | Get my custom orders |
| GET | /:id | Private | Get single (owner or admin) |
| GET | / | Admin | Get all custom orders |
| PUT | /:id | Admin | Update status, price, notes, delivery |

### Feedback — `/api/feedback`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | / | Private | Create feedback |
| GET | /product/:productId | Public | Get product reviews |
| GET | / | Admin | Get all feedback |
| DELETE | /:id | Private | Delete (owner or admin) |

### Posts — `/api/posts`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | / | Public | Get approved posts only |
| POST | / | Private | Create post (pending approval) |
| GET | /all | Admin | Get all posts including unapproved |
| PUT | /:id/like | Private | Toggle like |
| PUT | /:id/approve | Admin | Approve post |
| DELETE | /:id | Private | Delete (owner or admin) |

### Admin — `/api/admin`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /dashboard | Admin | Full dashboard data |
| GET | /users | Admin | All users |
| GET | /users/:id | Admin | Single user |
| PUT | /users/:id/role | Admin | Update role |
| DELETE | /users/:id | Admin | Delete user |
| GET | /stats/sales | Admin | Sales by date range |
| GET | /stats/orders | Admin | Orders by status + top products |

### Upload — `/api/upload`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /single | Private | Upload 1 image → Cloudinary URL |
| POST | /multiple | Private | Upload up to 10 images → URLs |

---

## Auth Strategy

- JWT stored in **localStorage** (`token` key) AND sent as **httpOnly cookie**
- Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request
- On 401 response: clears localStorage, redirects to `/login`
- `protect` middleware: checks Authorization header first, then cookie
- `optionalProtect` middleware: attaches user if token present, silently continues as guest if not — used on POST /orders and POST /custom-orders
- `adminOnly` middleware: checks `req.user.role === 'admin'`
- Passwords: bcrypt with salt rounds 12, `select: false` on schema

---

## State Management

### AuthContext
- Persists to localStorage (`token`, `user` keys)
- Loaded from localStorage on app start (useEffect)
- Exposes: `user`, `token`, `loading`, `login()`, `register()`, `logout()`, `isAuthenticated`, `isAdmin`

### CartContext
- Persists to localStorage (`cart` key)
- Loaded via useState initializer (lazy init from localStorage)
- Exposes: `items`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `totalItems`, `totalPrice`

---

## Frontend Routing (App.tsx)

```
Public:
  /                    → MainLayout > Home
  /shop                → MainLayout > Shop
  /shop/:id            → MainLayout > ProductDetail
  /cart                → MainLayout > Cart
  /checkout            → MainLayout > Checkout (guest + user)
  /order-confirmation/:id → MainLayout > OrderConfirmation
  /custom-order        → MainLayout > CustomOrder
  /custom-order/confirmation/:id → MainLayout > CustomOrderConfirmation
  /posts               → MainLayout > Community
  /login               → Login (no layout)
  /register            → Register (no layout)

Protected (ProtectedRoute):
  /profile             → MainLayout > Profile
  /my-orders           → MainLayout > MyOrders
  /my-orders/:id       → MainLayout > OrderDetail

Admin Only (ProtectedRoute adminOnly):
  /admin/dashboard     → AdminLayout > Dashboard
  /admin/products      → AdminLayout > AdminProducts
  /admin/orders        → AdminLayout > AdminOrders
  /admin/custom-orders → AdminLayout > AdminCustomOrders
  /admin/users         → AdminLayout > AdminUsers
  /admin/feedback      → AdminLayout > AdminFeedback
  /admin/posts         → AdminLayout > AdminPosts

Catch-all:
  *                    → NotFound
```

---

## Environment Variables

### `server/.env` (NOT committed, must be created manually)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://amanuelgetu_e-commerce:<password>@cluster0.dgiyyjw.mongodb.net/emu-shop
JWT_SECRET=emu_shop_super_secret_key_2024
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

**Critical:** `dotenv.config()` uses explicit path: `path.resolve(__dirname, '../.env')` — this is required because nodemon runs from `server/` directory.

### `client/` — no .env needed currently
- API base URL is hardcoded as `http://localhost:5000/api` in `client/src/services/api.ts`
- Will need a `.env` with `VITE_API_URL` for production deployment

---

## Installation & Running

```bash
# Clone
git clone https://github.com/Kirakos-B/E-Commerce-Shop.git
cd E-Commerce-Shop

# Backend
cd server
npm install
# Create server/.env with all required variables
npm run dev     # runs on http://localhost:5000

# Frontend (separate terminal)
cd client
npm install
npm run dev     # runs on http://localhost:5173
```

### Backend scripts (`server/package.json`)
```json
"dev": "nodemon",
"build": "tsc",
"start": "node dist/index.js"
```

### `server/nodemon.json`
```json
{ "watch": ["src"], "ext": "ts", "exec": "ts-node src/index.ts" }
```

### `server/tsconfig.json` key settings
```json
{ "target": "ES2020", "module": "commonjs", "outDir": "./dist", "rootDir": "./src", "strict": true, "esModuleInterop": true }
```

---

## Features Implemented ✅

### Backend (100% complete)
- ✅ Express server with MongoDB connection
- ✅ Full User model with bcrypt password hashing
- ✅ JWT authentication (register, login, logout, getMe, updateProfile, updatePassword)
- ✅ Product CRUD with text search, category/price filtering, pagination
- ✅ Order system (user + guest checkout, stock management, status tracking)
- ✅ Custom Order system (measurements, fabric, color, admin review workflow)
- ✅ Feedback system with auto product rating calculation
- ✅ Post system with admin approval workflow and likes
- ✅ Admin dashboard with MongoDB aggregations (revenue, sales by month, orders by status, top products)
- ✅ File uploads via Multer + Cloudinary (single + multiple, auto-optimization)
- ✅ Role-based access control (protect, adminOnly, optionalProtect middleware)
- ✅ Global error handler with AppError class
- ✅ All routes tested in Postman with collection variables

### Frontend (Steps 1–10 complete)
- ✅ Vite + React + TypeScript scaffold
- ✅ Tailwind CSS v3 with custom color theme
- ✅ Google Fonts (Inter + Playfair Display)
- ✅ AuthContext + CartContext with localStorage persistence
- ✅ Axios instance with auth interceptor + 401 handler
- ✅ React Router v6 with all routes
- ✅ ProtectedRoute component (auth + admin guards)
- ✅ Navbar (sticky, responsive, mobile menu, cart count badge, user dropdown)
- ✅ Footer
- ✅ MainLayout + AdminLayout + AdminSidebar
- ✅ Login + Register pages
- ✅ Home page (hero, features, categories, featured products, CTA)
- ✅ Shop page (product grid, search, category tabs, price filter, pagination)
- ✅ Product Detail page (images, quantity selector, add to cart, reviews)
- ✅ Cart page (item management, quantity controls, order summary)
- ✅ Checkout page (guest info optional, shipping, payment method, notes)
- ✅ Order Confirmation page
- ✅ Custom Order — 3-step form (Design → Measurements → Review)
- ✅ Custom Order Confirmation page
- ✅ Profile page (3 tabs: Profile / My Sizes / Password)
- ✅ My Orders page (order list with status badges)
- ✅ Order Detail page (full detail + cancel)
- ✅ Community page (posts feed, create post, like/unlike)
- ✅ Product reviews section on Product Detail page
- ✅ Admin Dashboard (8 stat cards, revenue line chart, orders pie chart, recent orders table, low stock alert)
- ✅ Admin Products (table + create/edit/delete modal)
- ✅ Admin Orders (inline status dropdowns)
- ✅ Admin Custom Orders (review modal with all fields)
- ✅ Admin Users (role management, delete protection for self)
- ✅ Admin Feedback (list + delete)
- ✅ Admin Posts (pending/approved sections, approve + delete)

---

## Features NOT Yet Implemented ❌

- ❌ Payment gateway integration (placeholder cash/card/transfer exists)
- ❌ Image upload UI in frontend (Cloudinary upload works via API, but no frontend upload component yet — AdminProducts uses URL input field as workaround)
- ❌ My Custom Orders page for users (backend route exists at GET /api/custom-orders/my, frontend page not built yet)
- ❌ Admin Stats page (`/admin/stats` in sidebar links to placeholder)
- ❌ Post image upload in Community page (shows "coming soon" message)
- ❌ Home page aesthetic improvements (noted as TODO)
- ❌ Checkout form localization for Ethiopia (currency, address fields)
- ❌ Email notifications (order confirmation, status updates)
- ❌ Production deployment setup
- ❌ Search functionality in admin pages
- ❌ Order tracking page (beyond basic status)

---

## Known Issues / Technical Debt

1. **Checkout Ethiopia localization** — form placeholders/defaults don't reflect Ethiopian context (Birr currency, regional address format). Marked as TODO for final polish.

2. **Payment integration** — currently only cash/card/transfer selector with no real payment processing. Need to integrate a payment gateway (e.g., Chapa for Ethiopia) before production.

3. **Image upload in AdminProducts** — uses comma-separated URL input instead of actual file upload widget. Should be replaced with Cloudinary upload component using the existing `/api/upload/multiple` endpoint.

4. **Home page aesthetics** — functional but noted as needing visual improvements. TODO for polish pass.

5. **TypeScript casting in AdminOrders/AdminCustomOrders** — some populated fields use `unknown` casts because the Order/CustomOrder types don't include the populated user object. Should be fixed with proper populated interfaces.

6. **No loading states in some admin pages** — some update operations don't show per-row loading indicators.

7. **`verbatimModuleSyntax` in tsconfig** — all type imports in the frontend must use `import type { }` syntax. This has caught several developers off guard.

---

## Project Decisions

### Why `optionalProtect` middleware?
Orders and custom orders support both logged-in users and guests. Rather than two separate routes, a single middleware conditionally attaches `req.user` if a valid token is present, then the controller checks `req.user` vs `req.body.guestInfo`.

### Why Tailwind v3 (not v4)?
Tailwind v4 removed `tailwind.config.js` and `npx tailwindcss init`. The project uses v3 for stability and compatibility with the standard config pattern.

### Why manual Radix install (not shadcn CLI)?
The new shadcn CLI v4 shows named presets (Nova, Vega, etc.) that confused the setup. Manual installation of Radix primitives + clsx + tailwind-merge gives the same functionality with full control.

### Why explicit dotenv path?
`dotenv.config({ path: path.resolve(__dirname, '../.env') })` is required because `__dirname` resolves to `server/src/` at runtime (ts-node), so the `.env` file at `server/.env` needs the explicit `../` path.

### JWT in both cookie and localStorage
Token is sent as httpOnly cookie (for security) AND returned in response body for storage in localStorage. Axios interceptor reads from localStorage for the `Authorization` header. This dual approach supports both browser environments.

### Why `select: false` on password?
Mongoose field-level security — password is never returned in any query unless explicitly requested with `.select('+password')`.

### Mongoose v9 pre-save hook pattern
Mongoose v9 handles async errors in hooks automatically. The `next(err)` pattern was removed from the pre-save hook to avoid TypeScript type conflicts. Simple async/await without try/catch works correctly.

---

## Codebase Conventions

### TypeScript
- `import type { }` for all type-only imports (enforced by `verbatimModuleSyntax`)
- Backend types in `server/src/types/index.ts`
- Frontend types in `client/src/types/index.ts`
- `AuthRequest` extends Express `Request` with optional `user?: IUser`

### Naming
- Files: PascalCase for components (`ProductCard.tsx`), camelCase for services/utils (`productService.ts`)
- Components: PascalCase
- Functions: camelCase
- Types/Interfaces: PascalCase with `I` prefix for Mongoose documents (`IUser`, `IProduct`)

### Error Handling (Backend)
- All async controller functions wrapped in try/catch → `next(error)`
- Custom `AppError(message, statusCode)` for known errors
- Global `errorMiddleware` catches all errors, returns `{ success: false, message, stack? }`
- Stack trace only shown in `development` mode

### Error Handling (Frontend)
- Axios errors typed as `(err as { response?: { data?: { message?: string } } })?.response?.data?.message`
- Shown in red alert boxes within forms
- 401 global handler in axios interceptor

### API Response Format (Backend)
```json
// Success
{ "success": true, "data": ... }

// Error
{ "success": false, "message": "...", "stack": "..." }
```

### Styling Patterns
```css
/* Custom utility classes in index.css */
.btn-primary    /* teal bg, sand text, hover darker */
.btn-secondary  /* transparent bg, teal border, hover fill */
.input-field    /* full width, border, focus ring */
.card           /* white bg, rounded-xl, shadow-sm, border */
```

### Service Pattern (Frontend)
```ts
// All services follow this pattern:
export const functionName = async (params): Promise<ReturnType> => {
  const { data } = await api.get/post/put/delete('/endpoint');
  return data.specificField;
};
```

---

## Postman Collection Setup

Collection: **Emu Shop API**

### Collection Variables
| Variable | Value |
|---|---|
| `base_url` | `http://localhost:5000` |
| `token` | _(auto-filled by Login Tests script)_ |
| `product_id` | _(auto-filled by Create Product Tests script)_ |
| `order_id` | _(auto-filled by Create Order Tests script)_ |
| `custom_order_id` | _(auto-filled by Create Custom Order Tests script)_ |
| `feedback_id` | _(auto-filled by Create Feedback Tests script)_ |
| `post_id` | _(auto-filled by Create Post Tests script)_ |
| `user_id` | _(auto-filled by Get All Users Tests script)_ |

### Login Test Script
```js
const res = pm.response.json();
if (res.token) { pm.collectionVariables.set("token", res.token); }
```

---

## Current Priorities (What To Do Next)

### Immediate — Polish & Fixes
1. **My Custom Orders page** — create `client/src/pages/user/MyCustomOrders.tsx` and add route `/my-custom-orders` (backend already done)
2. **Image upload component** — replace URL text input in AdminProducts with a proper file upload that calls `/api/upload/multiple`
3. **Admin Stats page** — build `client/src/pages/admin/AdminStats.tsx` with detailed sales charts (backend `/api/admin/stats/sales` and `/api/admin/stats/orders` already done)
4. **Checkout Ethiopia fix** — update currency display, default country to Ethiopia, adjust address field labels
5. **Home page aesthetic improvements** — better hero section, real product images, more visual polish

### Medium Priority
6. **Payment integration** — integrate Chapa (Ethiopian payment gateway) or Stripe
7. **Frontend image upload UI** — upload widget in Community posts and product creation
8. **Email notifications** — order confirmation, status change emails (nodemailer)

### Lower Priority
9. **Production deployment** — Render/Railway for backend, Vercel/Netlify for frontend
10. **Environment variables** — add `VITE_API_URL` to client for production

---

## Session Continuation Notes

### For the next AI chat session:
1. **DO NOT** change the color theme, folder structure, or any existing working components
2. The backend is **100% complete** — do not touch it unless fixing a specific bug
3. All TypeScript type imports in `client/` must use `import type { }` syntax
4. Tailwind custom colors (`primary`, `secondary`, etc.) are defined in `client/tailwind.config.js`
5. The `cn()` utility is at `client/src/lib/utils.ts` (not `client/src/utils/`)
6. Admin pages all live in `client/src/pages/admin/` and must be wrapped in `<ProtectedRoute adminOnly><AdminLayout>...</AdminLayout></ProtectedRoute>`
7. User pages live in `client/src/pages/user/` and use `<MainLayout>` wrapper

### Files most likely to be modified next:
- `client/src/App.tsx` — adding new routes
- `client/src/pages/user/MyCustomOrders.tsx` — NEW file to create
- `client/src/pages/admin/AdminStats.tsx` — NEW file to create
- `client/src/pages/admin/AdminProducts.tsx` — image upload enhancement
- `client/src/pages/user/Checkout.tsx` — Ethiopia localization
- `client/src/pages/user/Home.tsx` — aesthetic improvements

### Critical assumptions:
- Developer is on **Windows** — use separate `mkdir` commands, not chained
- Run `npm run dev` from inside `client/` or `server/`, NOT from root
- Two terminals must be open simultaneously (one per server)
- MongoDB Atlas cluster: `cluster0.dgiyyjw.mongodb.net`, database: `emu-shop`
- Cloudinary folder structure: `emu-shop/products/`, `emu-shop/general/`, etc.

### Things that must NOT change:
- The `optionalProtect` middleware approach for guest checkout
- The dual JWT storage (cookie + localStorage) pattern
- Mongoose pre-save hook without try/catch (Mongoose v9 requirement)
- `dotenv.config({ path: path.resolve(__dirname, '../.env') })` explicit path
- Tailwind v3 (not v4)
- `import type` for all TypeScript type imports in frontend

### Git commit history summary:
```
feat: initial project scaffold — Vite client + Express server
feat: backend scaffold — Express server + MongoDB connection
feat: user model + JWT auth (register, login, logout, getMe)
feat: order & custom order models + routes
feat: feedback & posts models + routes
feat: admin routes + dashboard stats
feat: file uploads with Multer + Cloudinary
feat: frontend scaffold — folder structure, types, axios, router
feat: auth context, cart context, login & register pages
feat: navbar, footer, main layout and admin layout
feat: home page, shop page and product detail page
feat: cart, checkout and order confirmation pages
feat: custom order multi-step form + confirmation page
feat: profile, my orders and order detail pages
feat: community posts and product reviews
feat: admin dashboard with charts and stats
feat: all admin management pages (products, orders, custom orders, users, feedback, posts)
```

Next commit should be: `feat: my custom orders page + admin stats page + image upload UI`

---

## TODO List (Tracked)
```
📝 Checkout defaults & labels tailored for Ethiopia
📝 Payment integration (real payment gateway — Chapa recommended for Ethiopia)
📝 Home page aesthetic improvements
📝 My Custom Orders page for users ← NEXT
📝 Admin Stats page ← NEXT
📝 Image upload UI (replace URL input in AdminProducts) ← NEXT
📝 Post image upload in Community
📝 Email notifications
📝 Production deployment
```
