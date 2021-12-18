const config = require("./config");
const express = require("express");
const userRouter = require("./routes/user");
const loaders = require("./loaders");
const bookRouter = require("./routes/book");
const app = express();

config();
loaders();

//middlewares
app.use(express.json());

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);

app.listen(process.env.PORT, () => {
  console.log(`The server is running!`);
});
