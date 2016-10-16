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

    fs.readFile(__dirname + "/data/audiodir.txt", "utf-8", function (err, data) {
        if (err) {
            throw err;
        }

        $musicDirectoryInput.val(data);

        if (data != "") {
            openDirectory(data);
        }
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
            fs.writeFileSync(__dirname + "/data/audiodir.txt", $musicDirectoryInput.val(), "utf-8");
            openDirectory($musicDirectoryInput.val());
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

    function openDirectory(path) {

        var $content = $(".content");

        var previous = null;
        function createPlaylistItem(name, path) {
            var $item = $("<div></div>");
            $item.addClass("content-item");

            $item.append("<i class='material-icons'></i><div class='content-item-text'>" + name + "</div>");

            $item.on("click", function() {
                $("#audio").attr("src", path + "/" + name);

                if (previous != null)
                    previous.removeClass("selected");

                $(this).addClass("selected");

                previous = $(this);
            });

            $content.append($item);
        }

        fs.readdir(path, function(err, rawFiles) {
            var files = [];

            for(var i = 0; i < rawFiles.length; i++) {
                var file = rawFiles[i];

                if (file.match(".mp3$")) {
                    files.push(file);
                    createPlaylistItem(file, path);
                }
            }

            // $("#audio").attr("src", path + "/foo.mp3");
            $(".behind-text").css("display", "Loading...");
        });

        $(".behind-text").text("Loading...");
    }
});