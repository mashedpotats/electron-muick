/**
 * Created by samuel on 10/10/16.
 */
window.addEventListener("load", function () {

    const fs = require("fs");

    fs.readFile(__dirname + "/data/audiodir.txt", "utf-8", function (err, data) {
        if (err) {
            throw err;
        }

        document.querySelector(".loading").classList.add("ready");
    });
});