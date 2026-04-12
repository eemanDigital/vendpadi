require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Vendor = require("./models/Vendor");

const migrateTrials = async () => {
  await connectDB();
  
  console.log("Starting trial migration...");
  
  const result = await Vendor.updateMany(
    {
      isAdmin: { $ne: true },
      $or: [
        { "trial.active": { $exists: false } },
        { trial: null },
        { trial: undefined }
      ]
    },
    {
      $set: {
        trial: {
          active: true,
          plan: "premium",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          used: true,
          reminderSent: false
        }
      }
    }
  );
  
  console.log(`Migration complete! Updated ${result.modifiedCount} vendors with premium trials.`);
  
  await mongoose.connection.close();
  process.exit(0);
};

migrateTrials().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
