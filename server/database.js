const mongoose = require("mongoose");

exports.connect = function ({
  protocol = "mongodb",
  url = "",
  username,
  password,
}) {
  const dburl = `${protocol}://${username}:${password}@${url}`;

  mongoose.connect(dburl);

  mongoose.connection.on("open", function () {
    console.log("Database connected");
  });

  mongoose.connection.on("close", function () {
    console.log("Database disconnected");
  });

  mongoose.connection.on("error", function (err) {
    console.error(err);
  });

  process.on("SIGINT", function () {
    mongoose.disconnect.close(() => {
      console.log("Database disconnected");
    });
  });
};

exports.disconnect = function () {
  mongoose.disconnect.close(function () {
    console.log("Database discconnected");
  });
};
