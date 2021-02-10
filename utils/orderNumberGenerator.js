/* GENERATES NEW ORDER NUMMBER IS ASCENDING COUNT */

module.exports = function (oldOrderNumber) {
    let orderNumber = oldOrderNumber; // E and ...... (number)
    let number = parseInt(orderNumber.slice(1)); // slices everything behind E letter
    number++;
    let newNo = "E" + number.toString();
    return newNo;
}