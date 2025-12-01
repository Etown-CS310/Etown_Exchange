# Etown_Exchange

Etown Exchange is a community-driven marketplace platform built for students at Elizabethtown College.  
It allows users to create accounts, post listings with images and prices, and communicate potential buyers.

## Features

- **User Authentication**  
  - Secure login using E-town school email via Firebase Authentication.
  - Automatically restricts access to verified student accounts.

- **Dashboard**  
  - Displays all active listings in a clean, responsive layout.
  - Users can browse items by title, price, and images.

- **Create Listings**  
  - Students can post items for sale with:
    - Title and description
    - Price
    - Item condition
    - Photos (stored in Firebase Storage)

- **My Listings**  
  - Dedicated page that displays all listings created by the logged-in user.
  - Users can edit or delete their own posts.

- **User Profile**  
  - View and update user information (name, photo, contact info).

- **Seller Contact Info**  
  - When viewing a listing, users can see the seller’s profile and contact details.
  - Helps buyers connect directly with sellers.

- **Responsive UI**  
  - Built with plain CSS for a lightweight, mobile-friendly interface.

## Tech Stack

- **Frontend:** React + TypeScript  
- **Styling:** Plain CSS  
- **Backend / Database:** Firebase Firestore  
- **Storage:** Firebase Storage  
- **Authentication:** Firebase Authentication  

## Getting Started

### Prerequisites
- Node.js   
- npm or yarn  
- Firebase project set up with Authentication, Firestore, and Storage enabled  

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/etown-exchange.git
   cd etown_exchange
   npm install
   npm start
   
  

  

