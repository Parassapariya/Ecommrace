const express = require("express");
const app = express();
const port = 8000;
require('dotenv').config();

const connectedDb = require("./src/DB/ConnectedDb");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const userRoutes = require("./src/routes/userRoutes");
const productRoute = require("./src/routes/productRoutes");
const cartRoute = require ('./src/routes/cartRoutes');
const paymentRoute = require ('./src/routes/paymentRoute');

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

//defult frontend route
app.get("/",(req,res)=>{
  res.send("Success");
})

// Routes
app.use("/api/users", userRoutes);
app.use("/api/product", productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/payment', paymentRoute);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
