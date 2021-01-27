module.exports = function catchAsync(fn) { // funkcija, kas kā argumentu pieņem funkciju
    return function (req, res, next) { // atgriež funkciju, kas sauc funkciju(kas ir iedota argumentā, jādublē argumentu skaits)
        fn(req, res, next).catch(e => next(e)); // funkcija tiek saukta, un tiek ķerts errors, ja tāds ir, ar callbacku errors tiek nodots error middlewaram
    }
}