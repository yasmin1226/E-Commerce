const mongoose = require("mongoose");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);

  console.log("uncaughtException ");
  process.exit(1); //1 nessasry
});
dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//console.log(process.env);
//connect to moongoose DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("db connect success");
  });
//.catch((err) => console.log("error"))

const port = process.env.PORT || 50000;
const server = app.listen(port, () => {
  console.log("server running");
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandler rejection");
  server.close(() => {
    process.exit(1); //1optional
  });
});
