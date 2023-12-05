"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function calculateRestaurant(restaurant, mealperiod) {
}
function processFiles() {
    console.log("hi");
    var files = fs.readdirsync('./activity-data');
    var data = [];
    files.forEach(function (file) {
        var filePath = path.join('./activity-data', file);
        console.log(filePath);
    });
    return data;
}
processFiles();
