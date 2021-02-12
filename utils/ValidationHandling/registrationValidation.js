const Joi = require("Joi");
const User = require("../../models/user");

module.exports = async function registrationValidation(req, res, next) {
    const { username, email } = req.body;
    const ifUserNameExists = await User.findOne({ username });
    const ifUserEmailExists = await User.findOne({ email });

    // checks if username or email already registred
    if (ifUserNameExists) {
        req.flash("error", "Username is already taken!");
        res.redirect("/auth/register");
        next();
    }
    if (ifUserEmailExists) {
        req.flash("error", "This email is already registred!");
        res.redirect("/auth/register");
        next();
    }

    // if username and email does not match some existing in db then checks for standart validation
    if (req.body) {
        const registerSchema = Joi.object({
            username: Joi.string().min(3).required(),
            password: Joi.string().min(6).required(),
            email: Joi.string().email()
        })
        const validationResult = registerSchema.validate(req.body);
        if (validationResult.error) {
            req.flash("error", validationResult.error.details[0]["message"]);
            res.redirect("/auth/register");
        } else {
            next();
        }
    } else {
        next();
    }
}