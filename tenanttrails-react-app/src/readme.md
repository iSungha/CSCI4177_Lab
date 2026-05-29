# TenantTrails React App

Lab 2 React app for TenantTrails.

## Features

- Landing page
- Sign In page with validation
- Sign Up page with validation
- AuthContext for shared user state
- Protected Dashboard route
- Dashboard with username and sign out
- Apartment card grid
- Search, neighbourhood filter, and sort
- Mock local data source

## Mock Data / No SQL Database

This lab version does not use a real SQL or NoSQL database.

The app uses:

- `src/data/mockData.js` as seed data
- `localStorage` as a browser-based mock NoSQL database

Default demo users are loaded from `mockData.js`. New accounts created through the Sign Up page are stored in `localStorage`.

Demo login:

- Email: `garrysangha@dal.ca`
- Password: `password123`

## Image Credits

Apartment images are loaded from Unsplash image URLs for demo purposes.

Unsplash License:
https://unsplash.com/license

Image source:
https://unsplash.com/