require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ 
  origin: [
    "http://localhost:3000", 
    "https://techmarket-client.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean)
}));
app.use(express.json());

// ── MongoDB Client ──────────────────────────────────────────────────────────
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ── Seed Data (from static client data) ────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max",
    shortDescription: "Titanium design, A17 Pro chip, powerful camera system.",
    description: "Experience the ultimate iPhone with a strong and lightweight aerospace-grade titanium design. Powered by the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom.",
    price: 1199, category: "Phones", rating: 4.8,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    specs: { "Display": "6.7-inch Super Retina XDR OLED", "Processor": "A17 Pro Chip", "Camera": "48MP Main | 12MP Ultra Wide | 12MP Telephoto", "Storage": "256GB / 512GB / 1TB" }
  },
  {
    id: "macbook-pro-m3",
    title: "MacBook Pro 14\" M3",
    shortDescription: "Stunning Liquid Retina XDR display, blazing fast M3 chip.",
    description: "The 14-inch MacBook Pro blasts forward with the M3 chip, an incredibly advanced processor that brings massive speed and capability.",
    price: 1599, category: "Laptops", rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    specs: { "Display": "14.2-inch Liquid Retina XDR", "Processor": "Apple M3 Chip", "RAM": "8GB / 16GB / 24GB Unified Memory", "Battery": "Up to 22 Hours" }
  },
  {
    id: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 Headphones",
    shortDescription: "Industry-leading noise canceling and premium wireless audio.",
    description: "Rewriting the rules for distraction-free listening. Industry-leading noise cancellation with 8 microphones and exceptional sound quality.",
    price: 399, category: "Audio", rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    specs: { "Type": "Over-Ear Wireless", "Battery Life": "Up to 30 Hours", "Noise Cancelling": "Industry-leading Auto NC Optimizer", "Connectivity": "Bluetooth 5.2 | Multi-point" }
  },
  {
    id: "ipad-pro-m4",
    title: "iPad Pro 11\" M4",
    shortDescription: "Impossibly thin design with Tandem OLED and M4 performance.",
    description: "The all-new iPad Pro features the M4 chip, an Ultra Retina XDR display with Tandem OLED technology, and superfast Wi-Fi 6E.",
    price: 999, category: "Tablets", rating: 4.9,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    specs: { "Display": "11-inch Ultra Retina XDR (Tandem OLED)", "Processor": "Apple M4 Chip", "Storage": "256GB to 2TB", "Thickness": "5.3 mm" }
  },
  {
    id: "apple-watch-ultra-2",
    title: "Apple Watch Ultra 2",
    shortDescription: "The ultimate sports and adventure watch, rugged and capable.",
    description: "The most rugged and capable Apple Watch with all-new S9 SiP, the brightest Always-On Retina display, and double tap gesture.",
    price: 799, category: "Wearables", rating: 4.6,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80",
    specs: { "Case Size": "49mm Titanium Case", "Battery Life": "Up to 36 Hours", "Water Resistance": "100m Water Resistant", "GPS": "Precision Dual-frequency GPS" }
  },
  {
    id: "keychron-q1-pro",
    title: "Keychron Q1 Pro Keyboard",
    shortDescription: "Full metal custom mechanical keyboard with wireless capability.",
    description: "QMK/VIA wireless custom mechanical keyboard with full aluminum body, double-gasket structure, and hot-swappable switches.",
    price: 199, category: "Accessories", rating: 4.5,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    specs: { "Layout": "75% Layout", "Connectivity": "Bluetooth 5.1 & Type-C Wired", "Body": "CNC Machined Aluminum", "Hot-swappable": "Yes" }
  },
  {
    id: "samsung-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    shortDescription: "Galaxy AI is here. Welcome to the era of mobile AI.",
    description: "Galaxy S24 Ultra features a titanium exterior, 6.8-inch flat display, and built-in S Pen for gaming and productivity.",
    price: 1299, category: "Phones", rating: 4.8,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
    specs: { "Display": "6.8-inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "Camera": "200MP Main | 50MP Periscope", "Storage": "256GB / 512GB / 1TB" }
  },
  {
    id: "dji-mini-4-pro",
    title: "DJI Mini 4 Pro",
    shortDescription: "Mini to the max with omnidirectional active obstacle sensing.",
    description: "DJI's most advanced mini-camera drone with omnidirectional obstacle sensing and ActiveTrack 360° with Trace Mode.",
    price: 759, category: "Drones", rating: 4.9,
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&auto=format&fit=crop&q=80",
    specs: { "Weight": "Under 249 g", "Video": "4K/60fps HDR", "Flight Time": "Up to 34 minutes", "Sensing": "Omnidirectional" }
  },
  {
    id: "lg-c3-oled",
    title: "LG C3 55-inch OLED evo TV",
    shortDescription: "Our best-selling OLED TV just got better.",
    description: "LG OLED evo C-Series powered by the a9 AI Processor Gen6 with Brightness Booster for luminous picture and high contrast.",
    price: 1499, category: "Displays", rating: 4.8,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    specs: { "Display": "55-inch OLED evo", "Resolution": "4K Ultra HD", "Refresh Rate": "120Hz Native", "Processor": "a9 AI Processor Gen6" }
  },
  {
    id: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S",
    shortDescription: "The iconic mouse, remastered for ultimate tactility.",
    description: "MX Master 3S with Quiet Clicks, 8,000 DPI track-on-glass sensor, and precision for any workflow.",
    price: 99, category: "Accessories", rating: 4.9,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=600&auto=format&fit=crop&q=80",
    specs: { "Sensor": "8000 DPI Darkfield", "Buttons": "7 buttons, Quiet Clicks", "Battery": "Up to 70 days", "Connectivity": "Bluetooth & Logi Bolt" }
  },
  {
    id: "nintendo-switch-oled",
    title: "Nintendo Switch - OLED Model",
    shortDescription: "Play at home or on the go with a vibrant OLED screen.",
    description: "The Nintendo Switch OLED Model with 7-inch OLED screen for immersive gaming at home or on the go.",
    price: 349, category: "Gaming", rating: 4.7,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&auto=format&fit=crop&q=80",
    specs: { "Display": "7-inch OLED touch screen", "Storage": "64GB Internal", "Audio": "Enhanced audio", "Stand": "Wide adjustable stand" }
  },
];

// ── DB Connection & Server Start ────────────────────────────────────────────
async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");

    const db = client.db(process.env.DB_NAME);
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");
    const categoriesCollection = db.collection("categories");

    // Seed products if collection is empty
    const count = await productsCollection.countDocuments();
    if (count === 0) {
      await productsCollection.insertMany(SEED_PRODUCTS);
      console.log(`🌱 Seeded ${SEED_PRODUCTS.length} products into MongoDB.`);
    }

    // Seed default categories if collection is empty
    const categoryCount = await categoriesCollection.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = ["Phones", "Laptops", "Audio", "Tablets", "Wearables", "Accessories", "Gaming", "Displays", "Drones", "Other"];
      await categoriesCollection.insertMany(
        defaultCategories.map((name) => ({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          createdAt: new Date(),
        }))
      );
      console.log(`🌱 Seeded ${defaultCategories.length} categories into MongoDB.`);
    }

    // ── Health Check ──────────────────────────────────────────────────────
    app.get("/", (req, res) => {
      res.json({ status: "ok", message: "TechMarket API is running 🚀" });
    });

    // ════════════════════════════════════════════════════════════════════════
    // PRODUCTS ROUTES
    // ════════════════════════════════════════════════════════════════════════

    // GET /products — All products (with optional search & category filter)
    app.get("/products", async (req, res) => {
      try {
        const { search, category } = req.query;
        const filter = {};

        if (category && category !== "All") {
          filter.category = category;
        }
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { shortDescription: { $regex: search, $options: "i" } },
          ];
        }

        const products = await productsCollection.find(filter).toArray();
        res.json(products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch products" });
      }
    });

    // GET /products/:id — Single product by custom string id or ObjectId
    app.get("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        let product = await productsCollection.findOne({ id });

        // Fallback: try MongoDB ObjectId
        if (!product && ObjectId.isValid(id)) {
          product = await productsCollection.findOne({ _id: new ObjectId(id) });
        }

        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch product" });
      }
    });

    // POST /products — Add new product (admin only — no auth middleware for now)
    app.post("/products", async (req, res) => {
      try {
        const product = req.body;

        if (!product.title || !product.price || !product.category) {
          return res.status(400).json({ error: "title, price, and category are required" });
        }

        // Generate string id from title if not provided
        if (!product.id) {
          product.id = product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        }
        product.rating = product.rating || 5.0;
        product.createdAt = new Date();

        const result = await productsCollection.insertOne(product);
        res.status(201).json({ insertedId: result.insertedId, ...product });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add product" });
      }
    });

    // PUT /products/:id — Update product
    app.put("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        delete updates._id; // prevent overwriting _id

        const result = await productsCollection.findOneAndUpdate(
          { id },
          { $set: { ...updates, updatedAt: new Date() } },
          { returnDocument: "after" }
        );

        if (!result) return res.status(404).json({ error: "Product not found" });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update product" });
      }
    });

    // DELETE /products/:id — Delete product
    app.delete("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await productsCollection.deleteOne({ id });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json({ success: true, message: `Product '${id}' deleted.` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete product" });
      }
    });

    // ════════════════════════════════════════════════════════════════════════
    // CATEGORIES ROUTES
    // ════════════════════════════════════════════════════════════════════════

    // GET /categories — All categories
    app.get("/categories", async (req, res) => {
      try {
        const categories = await categoriesCollection
          .find()
          .sort({ name: 1 })
          .toArray();
        res.json(categories);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch categories" });
      }
    });

    // POST /categories — Create a new category
    app.post("/categories", async (req, res) => {
      try {
        const { name } = req.body;
        if (!name || !name.trim()) {
          return res.status(400).json({ error: "Category name is required" });
        }

        const trimmed = name.trim();
        const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const result = await categoriesCollection.updateOne(
          { slug },
          {
            $setOnInsert: { name: trimmed, slug, createdAt: new Date() },
          },
          { upsert: true }
        );

        const category = await categoriesCollection.findOne({ slug });
        if (result.upsertedCount === 0) {
          return res.status(409).json({ error: `Category "${trimmed}" already exists`, category });
        }
        res.status(201).json(category);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create category" });
      }
    });

    // DELETE /categories/:slug — Delete a category
    app.delete("/categories/:slug", async (req, res) => {
      try {
        const { slug } = req.params;
        const result = await categoriesCollection.deleteOne({ slug });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Category not found" });
        }
        res.json({ success: true, message: `Category '${slug}' deleted.` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete category" });
      }
    });

    // ════════════════════════════════════════════════════════════════════════
    // ORDERS ROUTES
    // ════════════════════════════════════════════════════════════════════════

    // GET /orders — All orders
    app.get("/orders", async (req, res) => {
      try {
        const { email } = req.query;
        const filter = email ? { "contact.email": email } : {};
        const orders = await ordersCollection
          .find(filter)
          .sort({ createdAt: -1 })
          .toArray();
        res.json(orders);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch orders" });
      }
    });

    // GET /orders/:id — Single order
    app.get("/orders/:id", async (req, res) => {
      try {
        const { id } = req.params;
        let order = null;

        if (ObjectId.isValid(id)) {
          order = await ordersCollection.findOne({ _id: new ObjectId(id) });
        }
        if (!order) {
          order = await ordersCollection.findOne({ orderId: id });
        }

        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch order" });
      }
    });

    // POST /orders — Place a new order
    app.post("/orders", async (req, res) => {
      try {
        const { contact, shipping, payment, items, subtotal, tax, total } = req.body;

        if (!items || items.length === 0) {
          return res.status(400).json({ error: "Order must contain at least one item" });
        }

        const order = {
          orderId: "TM" + Math.random().toString(36).substring(2, 9).toUpperCase(),
          contact,
          shipping,
          payment: { method: payment, cardLast4: null }, // never store full card data
          items,
          subtotal,
          tax,
          total,
          status: "pending",
          createdAt: new Date(),
        };

        const result = await ordersCollection.insertOne(order);
        res.status(201).json({
          insertedId: result.insertedId,
          orderId: order.orderId,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to place order" });
      }
    });

    // PATCH /orders/:id/status — Update order status (admin)
    app.patch("/orders/:id/status", async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const result = await ordersCollection.findOneAndUpdate(
          { orderId: id },
          { $set: { status, updatedAt: new Date() } },
          { returnDocument: "after" }
        );

        if (!result) return res.status(404).json({ error: "Order not found" });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update order status" });
      }
    });

    // ── Start Listening ───────────────────────────────────────────────────
    app.listen(PORT, () => {
      console.log(`🚀 TechMarket server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
