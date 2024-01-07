
const config = require("./utils/config");
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add other options if necessary
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(config.PORT, () => {
      console.log(`Server running on ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error Connecting to MongoDB", error);
  });

