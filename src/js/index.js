/**
 * Created by samuel on 10/10/16.
 */

const fs = require("fs");
const $ = require("jquery");

const electron = require('electron').remote;
const mainWindow = electron.getCurrentWindow();
var dialog = electron.dialog;

window.addEventListener("load", function () {
    var $musicDirectoryInput = $("#music-directory-input");
    var musicDirectory = "";

    fs.readFile(__dirname + "/data/audiodir.txt", "utf-8", function (err, data) {
        if (err) {
            throw err;
        }

        $musicDirectoryInput.val(data);

        if (data != "")
            $("#audio").attr("src", data + "/foo.mp3");
        $(".loading").toggleClass("ready");
    });

    $(".settings-button").on("click", function() {
        $(".settings").toggleClass("open");
    });

    $(".settings-shade").on("click", function() {
        $(".settings").toggleClass("open");
    });

    function changeDirectory() {
        if (fs.existsSync($musicDirectoryInput.val())) {
            musicDirectory = $musicDirectoryInput.val();
            fs.writeFileSync(__dirname + "/data/audiodir.txt", musicDirectory, "utf-8");
        } else
            dialog.showMessageBox(mainWindow, {
                type: "error",
                title: "Invalid Folder",
                message: "You have chose an invalid folder. Please choose another one",
                buttons: ["Ok"]
            });
    }

    $("#music-directory-button").on("click", changeDirectory);

    $(".folder-button").on("click", function () {
        $musicDirectoryInput.val(dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        })[0]);
    });
});