# MONOCHROME STUDIO

A responsive fashion storefront prototype built with React, TypeScript, Vite, Tailwind CSS, and React Router.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`.

## Storefront

The site includes a brand-led homepage, collection listings, product details, journal, search, wishlist, shopping bag, account preview, and demo checkout. Product information lives in `src/data/products.ts`. Brand presentation and commerce-mode settings live in `src/storefront/config.ts`.

The catalog, newsletter feedback, customer account, bag, and wishlist are local prototype functionality. Bag and wishlist selections persist in browser local storage. Checkout only displays a demo confirmation: it does not place orders or collect payment information. Customer authentication, order management, inventory, and merchant subscriptions are not connected to production services.

## Routes

- `/` — Home
- `/shop`, `/new-arrivals`, `/women`, `/men`, `/collections` — Product listings
- `/product/:productId` — Product details
- `/search` — Search the catalog
- `/wishlist`, `/bag` — Saved items and bag
- `/checkout`, `/account` — Clearly marked prototype flows
- `/journal` — Studio journal

The app uses hash-based client routing so all routes work on static hosting without server-side rewrite configuration.
