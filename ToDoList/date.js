module.exports.getDate = getDate;
function getDate() {
var today = new Date();
    var options = {
        weekday: "long",
    };
    let day = today.toLocaleDateString("en-us",options)
    return day;
}
module.exports.getDay =getDay;
function getDay () {
    var today = new Date();
    var options = {
        weekday: "long",
    };
    let day = today.toLocaleDateString("en-us",options)
    return day;
}