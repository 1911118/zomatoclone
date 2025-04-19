# Zomato Clone

A modern restaurant discovery and management platform built with HTML, CSS, and JavaScript.

## Features

- 🍽️ Restaurant listing with search and filters
- 📱 Responsive design for all devices
- 🔍 Real-time search with debouncing
- 📊 Pagination with "Load More" functionality
- 🎨 Modern UI with animations and transitions
- 🔒 Secure admin panel with JWT authentication

## Project Structure

```
zomato-clone/
├── frontend/
│   ├── css/
│   │   ├── style.css
│   │   ├── admin.css
│   │   └── dashboard.css
│   ├── js/
│   │   └── main.js
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── add-restaurant.html
│   │   └── edit-restaurant.html
│   └── index.html
└── README.md
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/1911118/zomatoclone.git
   cd zomatoclone
   ```

2. Open `frontend/index.html` in your browser to view the frontend.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Create a Vercel account at [vercel.com](https://vercel.com)

3. Connect your GitHub repository to Vercel

4. Add environment variables in Vercel:
   - `API_BASE_URL`: Your Railway backend URL (e.g., `https://your-backend.up.railway.app/api`)

5. Deploy!

### Backend (Railway)

1. Create a Railway account at [railway.app](https://railway.app)

2. Connect your backend repository

3. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CORS_ORIGIN`: Your Vercel frontend URL

4. Deploy!

## Environment Variables

### Frontend (.env)
```
API_BASE_URL=https://your-backend.up.railway.app/api
```

### Backend (.env)
```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-frontend.vercel.app
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 