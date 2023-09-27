const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const webhookRoutes = require("./Routes/webhookRoutes");
const superAdminRoutes = require("./Routes/superAdminRoutes");
const condoAdminRoutes = require("./Routes/condoAdminRoutes");
const userRoutes = require("./Routes/userRoutes");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/webhook", webhookRoutes);
app.use("/superAdmin", superAdminRoutes);
app.use("/condoAdmin", condoAdminRoutes);
app.use("/user", userRoutes);




app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
