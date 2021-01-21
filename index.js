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
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views")); // uzstāda to, ka tiek meklēts faili iekš views foldera
app.set("view engine", "ejs"); // specificē faila extension, lai turpmāk nav jānorāda

/* *********
middleware - operācijas, kas tiek sauktas starp request un response objektiem
************* */
app.use(express.urlencoded({ extended: true })); // request body parsers
app.use(express.static("public")); // static failu servēšana, public - root folderis


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


/* *********
ROUTES
************* */
const adminRoutes = require("./routes/admin");



app.use("/manage", adminRoutes);


app.get("/", (req, res) => {
    res.render("index")
})

app.listen(3000, () => {
    console.log("App started on port 3000")
})