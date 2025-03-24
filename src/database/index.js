// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";

const connectToDb = async () => {
  const DbUrl = `${process.env.connectionString}`;
  mongoose
    .connect(DbUrl)
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err));
};

export default connectToDb;