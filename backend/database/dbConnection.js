// backend/database/dbConnection.js
import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Hospital_Management_System_Deployed",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.error("Error connecting to database:", err);
      process.exit(1);
    });
};
