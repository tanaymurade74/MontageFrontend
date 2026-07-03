# Montage – Frontend

A photo gallery app. Sign in with Google, organize your photos into albums, upload images, tag and favorite them, leave comments, and share albums with others. Built with React and Bootstrap, backed by a REST API.

## Live Demo

[Live Demo](https://montage-frontend.vercel.app/)

## Quick Start

```bash
git clone https://github.com/tanaymurade74/MontageFrontend.git
cd MontageFrontend
npm install
```

Create a `.env` file in the project root, pointing at the backend:

```env
REACT_APP_API_URL=http://localhost:3000
```

> Replace with your deployed [backend](https://github.com/tanaymurade74/MontageBackend) URL in production (e.g. `https://montagebackend.onrender.com`).

Then start the app:

```bash
npm start
```

## Technologies

* React JS
* React Router
* Bootstrap
* Bootstrap Icons
* Axios
* React Toastify
* Create React App

## Features

**Authentication**

* Sign in with Google
* JWT token stored in the browser and sent with every request

**Albums**

* Create, view, and delete albums
* Share albums with other users by email
* View albums that have been shared with you

**Images**

* Upload images to an album
* Filter images by tags
* Mark images as favorites and view a favorites-only gallery
* Add comments to images
* Delete images

**General**

* Toast notifications for real-time feedback on actions

## API Reference

This app consumes the Montage backend REST API. The base URL is read from `REACT_APP_API_URL`, and a JWT token is sent in the `Authorization` header on every request.

### GET /auth/login · GET /auth/me
Start Google sign-in and fetch the current user.

### GET /albums · POST /album · DELETE /albums/:albumId
List, create, and delete albums.

### POST /albums/:albumId/share · GET /albums/shared
Share an album by email and view albums shared with you.

### POST /albums/:albumId/images · GET /albums/:albumId/images
Upload images to an album and list them (with optional tag filtering).

### PATCH /albums/:albumId/images/:imageId/favorite · POST /albums/:albumId/images/:imageId/comments
Toggle favorites and add comments on images.

> Full endpoint list: see the [backend repository](https://github.com/tanaymurade74/MontageBackend).
