const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./api/routes/books");
const userRoutes = require("./api/routes/users");
const ordersRoutes = require("./api/routes/orders");

mongoose.connect("mongodb+srv://michal:michal@antykwariat-6qcux.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/orders", ordersRoutes);

app.use((req, res, next)=> {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=> {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
