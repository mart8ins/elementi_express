const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
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