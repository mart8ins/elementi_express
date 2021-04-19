require('dotenv').config();
/* *********
express
************* */
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const dbUrl = process.env.MONGO_DB_URL || "mongodb://localhost:27017/elementi";


/* *********
MONGO datu bāze
************* */
const mongoose = require("mongoose");
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});

/* *********
MONGO STORE
************* */
const MongoStore = require("connect-mongo")(session);

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
COOKIES parser
************* */
app.use(cookieParser());
const secret = process.env.SECRET || "realybadsecret";

/* *********
express session
************* */
const sessionOptions = {
    secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection, mongoUrl: dbUrl, touchAfter: 24 * 3600 }),
    cookie: { maxAge: 180 * 60 * 1000 }
}
app.use(session(sessionOptions));

/* *********
flash messages
************* */
app.use(flash());

/******************
ERROR HANDLING SETUP
********************/
const AppError = require("./utils/ErrorHandling/AppError");

/* *********
locals
************* */
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.product_to_cart = req.flash("product_to_cart");
    res.locals.userLoggedIn = req.session.user_id;
    res.locals.userLoggedInName = req.session.user_name;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.orderNo = req.session.orderNo;
    req.session.cart ? res.locals.cart_total = req.session.cart.cartTotals.quantity : res.locals.cart_total = null;
    next();
})


/* *********
ROUTES IMPORTS 
************* */
const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
const shoppingRoutes = require("./routes/shopping");


/* *********
ROUTES USE
************* */
app.use("/", homeRoutes);
app.use("/manage", adminRoutes);
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/user", userRoutes);
app.use("/shopping", shoppingRoutes);



/* *********
 IF PAGE NOT FOUND PAGE 
************* */
app.use((req, res) => {
    throw new AppError("Page no found", 404);
})


/* *********
ERROR MIDLLEWARE 
************* */
app.use((err, req, res, next) => {
    const { message = "Something went wrong!", status = 500 } = err;
    res.render("error", { message, status })
})

const port = 3000;
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})