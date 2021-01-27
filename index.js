/* *********
express
************* */
const express = require("express");
const app = express();

/* *********
express setup
************* */
const ejsMate = require("ejs-mate"); // template funkcijas
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views")); // uzstāda to, ka tiek meklēts faili iekš views foldera
app.set("view engine", "ejs"); // specificē faila extension, lai turpmāk nav jānorāda


/* *********
middleware - operācijas, kas tiek sauktas starp request un response objektiem
************* */
app.use(express.urlencoded({ extended: true })); // request body parsers
app.use(express.static("public")); // static failu servēšana, public - root folderis
app.use(methodOverride("_method")); // lai var izmantot update and delete verbus
app.use(morgan('tiny')) // izlogo konkrētus propertijus konsolē

/* *********
MONGO datu bāze
************* */
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/elementi", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});

/******************
ERROR HANDLING SETUP
********************/
const AppError = require("./utils/ErrorHandling/AppError");


/* *********
ROUTES IMPORTS 
************* */
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const homeRoutes = require("./routes/home");


/* *********
ROUTES USE
************* */
app.use("/", homeRoutes);
app.use("/manage", adminRoutes);
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);


/* *********
ERROR MIDLLEWARE 
************* */
app.use((err, req, res, next) => {
    console.log(err)
    const { message = "Something went wrong!", status = 500 } = err;
    res.render("error", { message, status })
    next(err);
})

/* *********
 IF PAGE NOT FOUND PAGE 
************* */
app.use((req, res) => {
    throw new AppError("Page no found", 404)
})


app.listen(3000, () => {
    console.log("App started on port 3000")
})