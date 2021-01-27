const Joi = require("Joi");
const AppError = require("../ErrorHandling/AppError");

module.exports = function validateProduct(req, res, next) {
    //validation for input value when creating new product or category, usin "Joi" dependencie
    if (req.body.newProduct) {
        const adminProductSchema = Joi.object({
            newProduct: Joi.object({
                brand: Joi.string().min(3).alphanum().required(),
                model: Joi.string().min(2).alphanum().required(),
                newPrice: Joi.number().min(0).required(),
                oldPrice: Joi.string().allow(""),
                category: Joi.string().min(4),
                onSale: Joi.boolean(),
                description: Joi.string()
            })
        })
        const validationResult = adminProductSchema.validate(req.body);
        const { error } = validationResult; // error ir array ar objektiem, erroriem
        if (error) {
            const msg = error.details.map(el => el.message).join(","); // izmapojam cauri un atgriežam error msg, ja ir vairāki, tad join
            throw new AppError(msg, 404)
        } else {
            next();
        }
    } else {
        next();
    }
}