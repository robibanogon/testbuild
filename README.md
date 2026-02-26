# Gadget Store - E-commerce Website

A simple e-commerce website for selling gadgets, built with Node.js, Express, and PostgreSQL.

## Features

- 🛍️ Browse products by category
- 🛒 Shopping cart functionality
- 💳 Checkout and order placement
- 📦 Inventory management
- 🎨 Responsive design
- 💾 PostgreSQL database integration

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Dependencies**: pg, dotenv, cors, body-parser

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 🚨 PostgreSQL Not Installed?

If you don't have PostgreSQL installed, see **[INSTALL_POSTGRESQL.md](INSTALL_POSTGRESQL.md)** for detailed installation instructions.

**Quick Install (macOS):**
- **Easiest**: Download [Postgres.app](https://postgresapp.com/) - No terminal commands needed!
- **Alternative**: Install via Homebrew (see INSTALL_POSTGRESQL.md)

## Installation

1. **Clone the repository** (or navigate to the project directory)

```bash
cd gadget-ecommerce
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up PostgreSQL database**

First, ensure PostgreSQL is running. Then create the database using one of these methods:

**Method 1 - Using createdb command:**
```bash
createdb gadget_store
```

**Method 2 - Using psql:**
```bash
psql -U postgres
```
Then in the PostgreSQL prompt:
```sql
CREATE DATABASE gadget_store;
\q
```

**Method 3 - Using Postgres.app (macOS):**
1. Open Postgres.app
2. Double-click on a database to open psql
3. Run: `CREATE DATABASE gadget_store;`
4. Type `\q` to exit

4. **Configure environment variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gadget_store
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=3000
```

5. **Initialize the database**

**Automated Setup (Recommended):**
```bash
npm run setup-db
```

This script will:
- Create the database if it doesn't exist
- Run all SQL migrations
- Insert sample data
- Verify the setup

**Manual Setup (if automated fails):**

If psql is available:
```bash
psql -U postgres -d gadget_store -f database/schema.sql
```

If using Postgres.app:
```bash
/Applications/Postgres.app/Contents/Versions/latest/bin/psql -d gadget_store -f database/schema.sql
```

Alternative - Manual import:
1. Open your PostgreSQL client (psql, pgAdmin, or Postgres.app)
2. Connect to the `gadget_store` database
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL commands

## Running the Application

1. **Start the server**

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

2. **Access the application**

Open your browser and navigate to:

```
http://localhost:3000
```

## Project Structure

```
gadget-ecommerce/
├── database/
│   ├── db.js              # Database connection configuration
│   └── schema.sql         # Database schema and sample data
├── public/
│   ├── index.html         # Home page
│   ├── products.html      # Products listing page
│   ├── cart.html          # Shopping cart page
│   ├── checkout.html      # Checkout page
│   ├── styles.css         # CSS styles
│   └── app.js             # Frontend JavaScript
├── server.js              # Express server and API routes
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## API Endpoints

### Products

- `GET /api/products` - Get all products (optional query: `?category_id=1`)
- `GET /api/products/:id` - Get a single product by ID

### Categories

- `GET /api/categories` - Get all categories

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details by ID

## Database Schema

### Tables

1. **categories** - Product categories
2. **products** - Product information
3. **orders** - Customer orders
4. **order_items** - Items in each order

## Sample Data

The database comes pre-populated with:

- 5 product categories (Smartphones, Laptops, Tablets, Accessories, Wearables)
- 10 sample products with stock quantities
- Placeholder images for products

## Usage

### Shopping Flow

1. Browse products on the home page or products page
2. Filter products by category
3. Add products to cart
4. View cart and adjust quantities
5. Proceed to checkout
6. Fill in shipping information
7. Place order

### Cart Management

- Cart data is stored in browser's localStorage
- Cart persists across page refreshes
- Cart count is displayed in the navigation bar

## Development

### Adding New Products

You can add new products directly to the database:

```sql
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity)
VALUES ('Product Name', 'Description', 99.99, 1, 'image_url', 50);
```

### Modifying the Schema

If you need to modify the database schema:

1. Update `database/schema.sql`
2. Drop and recreate the database
3. Run the initialization script again

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check your `.env` file credentials
- Ensure the database exists: `psql -l`

### Port Already in Use

If port 3000 is already in use, change the PORT in your `.env` file:

```env
PORT=3001
```

### Missing Dependencies

If you encounter module errors, reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- User authentication and accounts
- Product search functionality
- Order history and tracking
- Admin panel for product management
- Payment gateway integration
- Product reviews and ratings
- Wishlist functionality
- Email notifications

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!