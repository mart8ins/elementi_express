const Joi = require("Joi");

module.exports = function registrationValidation(req, res, next) {
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