import mongoose from "mongoose";
import dotenv from "dotenv";
// dotenv.config();
export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL);
        const coonection = mongoose.connection;
        coonection.on("connected", () => {
            console.log("Database Connection Successfull");
        })
        coonection.on("error", (err) => {
            console.log("Database Connection Failed", err);;
            process.exit();
        })
    } catch (error) {
        console.log("Database Connection Failed", error);
    }
}

// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();
// const MONGODB_URI = process.env.MONGO_URL;

// if (!global.mongoose) {
//   global.mongoose = { conn: null, promise: null };
// }

// export async function connect() {
//   if (global.mongoose.conn) {
//     return global.mongoose.conn;
//   }

//   if (!global.mongoose.promise) {
//     global.mongoose.promise = mongoose
//       .connect(MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then((mongoose) => mongoose);
//   }

//   global.mongoose.conn = await global.mongoose.promise;
//   return global.mongoose.conn;
// }
