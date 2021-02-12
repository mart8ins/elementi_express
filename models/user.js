const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true,
        minLength: [3, "Username must be at least 3 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required."]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [6, "Password must be at least 6 characters long"]
    },
    admin: false
})

// VALIDATES USER WHO WANTS TO LOGIN
userSchema.statics.validateUser = async function (username, password) {
    const checkUser = await this.findOne({ username: username });
    if (checkUser) {
        const isValid = await bcrypt.compare(password, checkUser.password);
        return isValid ? checkUser : false;
    }
}

module.exports = mongoose.model("User", userSchema);