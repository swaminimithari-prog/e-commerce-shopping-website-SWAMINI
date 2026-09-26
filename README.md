# BuyBloom — MERN E-Commerce Website

A full-stack e-commerce site: Node.js/Express/MongoDB backend (REST API) + a
Vite-served HTML/CSS/JS frontend.

## Project structure

```
backend/     Express + Mongoose REST API (auth, products, cart, orders, tickets, admin)
frontend/    Vite dev server + static HTML/CSS/JS pages (multi-page site, no framework)
```

### frontend/ layout
```
frontend/
  *.html            all pages (index, login, cart, checkout, admin pages, etc.)
  src/assets/css/    stylesheets
  src/assets/js/     shared + page scripts (jQuery, content.js, cart logic, etc.)
  src/assets/img/    images
  public/            static files served as-is by Vite
```
Pages fetch small reusable fragments at runtime (`header.html`, `footer.html`,
`slider.html`, `content.html`, `contentDetails.html`) and inject them with
`innerHTML` — this is why those files stay at the top level of `frontend/`
instead of `src/pages/`, and why they are plain files rather than Vite
"entries".

## Prerequisites
- Node.js 18+
- A MongoDB connection string (MongoDB Atlas or local `mongod`)

## 1. Backend setup
```bash
cd backend
npm install
```
Edit `backend/.env`:
```
PORT=5000
MONGO_DB_URI=<your MongoDB connection string>
JWT_SECRET=<any long random string>
```
Run it:
```bash
npm run dev      # nodemon, auto-restart
# or
npm start        # plain node
```
API base URL: `http://localhost:5000/api/...`

## 2. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Open the printed URL (default `http://localhost:5173`). The pages call the
API at `http://localhost:5000/api/...`, so the backend must be running too.

## What was fixed
This copy of the project had files that pointed at the wrong locations, so
pages loaded with missing CSS/JS/images and the API server crashed on boot:
- `frontend/*.html` linked to `css/…`, `js/…`, `img/…` folders that didn't
  exist inside `frontend/` — the real files lived only under
  `frontend/src/assets/…`. All links were repointed to `src/assets/...`.
- `content.js`, `contentDetails.js`, `orderPlaced.js` were missing from
  `frontend/` entirely (they only existed at the old project root) — copied
  into `frontend/src/assets/js/` and their `<script src>` paths fixed.
- `backend/routes/ticketRoutes.js` required `../controllers/ticketController`,
  but the file on disk was named `TicketController.js`. This works on
  Windows (case-insensitive filesystem) but crashes immediately with
  `MODULE_NOT_FOUND` on Linux/macOS/most hosting providers. Renamed the file
  to match.
- Removed duplicate/legacy loose copies of every HTML/CSS/JS file that used
  to sit at the project root outside `frontend/` and `backend/` (plus a
  stray `HIIIIIIIIIII/` folder), since they were unused, unlinked
  duplicates that only added confusion about which copy was "the real one".

Both `npm run dev` (frontend) and `node index.js` (backend) have been
verified to start cleanly after these fixes.
