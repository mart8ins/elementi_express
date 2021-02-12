// funkcija, kas kā argumentu pieņem funkciju
// atgriež funkciju, kas sauc funkciju(kas ir iedota argumentā, jādublē argumentu skaits)
// funkcija tiek saukta, un tiek ķerts errors, ja tāds ir, ar callbacku errors tiek nodots error middlewaram
module.exports = function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
};