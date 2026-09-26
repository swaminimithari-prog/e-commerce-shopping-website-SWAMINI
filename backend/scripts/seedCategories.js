// scripts/seedCategories.js
// Run once from your backend root:  node scripts/seedCategories.js
const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Category = require("../models/Category");

async function seed() {
      await mongoose.connect(process.env.MONGO_DB_URI);
      console.log("Connected to MongoDB");

      const categories = [
            { name: "Men", slug: "men" },
            { name: "Women", slug: "women" },
      ];

      for (const cat of categories) {
            const existing = await Category.findOne({ slug: cat.slug });
            if (existing) {
                  console.log(`Already exists: ${cat.name} (${existing._id})`);
                  continue;
            }
            const created = await Category.create(cat);
            console.log(`Created: ${created.name} (${created._id})`);
      }

      await mongoose.disconnect();
      console.log("Done.");
}

seed().catch((err) => {
      console.error(err);
      process.exit(1);
});