import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "DB1",
    })
    .then((c) => {
      console.log(`Connected with ${c.connection.host}`);
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
};
