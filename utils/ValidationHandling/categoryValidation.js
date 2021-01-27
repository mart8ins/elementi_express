const Joi = require("Joi");
const AppError = require("../ErrorHandling/AppError");

module.exports = function validateCategory(req, res, next) {
    if (req.body.newCategory) {
        const adminCategorySchema = Joi.object({
            newCategory: Joi.string().min(4)
        })
        const { error } = adminCategorySchema.validate(req.body);
        if (error) {
            const msg = error.details.map((er) => er.message).join(",");
            throw new AppError(msg, 404);
        } else {
            next();
        }
    } else {
        next();
    }
}