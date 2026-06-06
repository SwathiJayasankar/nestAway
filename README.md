# NestAway 🏠

NestAway is a premium Airbnb-style full-stack web application designed for discovering, booking, and hosting unique stays around the world. It provides a seamless experience for users to explore properties by various categories, read reviews, and manage their own listings.

## ✨ Features

- **Dynamic Homepage**: Explore listings immediately at the root path (`/`).
- **Category Filtering**: High-end filtering system for stays (Rooms, Beach, Arctic, Castles, etc.).
- **Smart Search**: Search for destinations by name, location, or country.
- **Review System**: Leave star ratings and descriptive reviews for each stay.
- **Interactive Maps**: Every listing features a map powered by **Leaflet.js** and **OpenStreetMap**.
- **User Authentication**: Secure sign-up/login with **Passport.js**.
- **Image Uploads**: Integrated with **Cloudinary** for reliable cloud storage of property photos.
- **Responsive Design**: Premium aesthetics built with **Bootstrap 5** and custom CSS, featuring glassmorphism and smooth transitions.

## 🛠️ Tech Stack

- **Frontend**: EJS, HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Auth**: Passport.js with Local Strategy.
- **Storage**: Multer and Multer-Storage-Cloudinary.
- **Mapping**: Leaflet.js and Nominatim API.
- **Utilities**: Joi (Validation), Connect-Flash (Messaging), EJS-Mate (Layouts).

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB instance running locally or in the cloud.
- A Cloudinary account for photo hosting.

### Installation

1. **Clone the repo**
   ```bash
   git clone <your-repository-url>
   cd "Project Abnb"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   CLOUD_NAME=your_cloud_name
   CLOUD_API_KEY=your_api_key
   CLOUD_API_SECRET=your_api_secret
   # MongoDB connection string
   # MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
   ```

4. **Initialize Sample Data** (Optional)
   ```bash
   node init/index.js
   ```

5. **Run the application**
   ```bash
   node app.js
   ```
   Open `http://localhost:8080` in your browser.

## 📂 Project Structure

- `/routes`: Route definitions for Listings, Reviews, and Users.
- `/models`: MongoDB/Mongoose schemas.
- `/views`: EJS templates (Layouts, Includes, and Pages).
- `/public`: Static assets (CSS, JS, and client-side scripts).
- `/middleware`: Application-level and route-level middlewares.
- `/utils`: Helper functions and error handlers.

## 📄 License

This project is licensed under the [ISC License](LICENSE).
