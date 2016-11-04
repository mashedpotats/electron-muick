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
    var dataFile = __dirname + "/data/audiodir.json";
    var json;

    fs.readFile(dataFile, "utf-8", function (err, data) {
        if (err) {
            throw err;
        }

        json = JSON.parse(data);
        $musicDirectoryInput.val(json.dir);

        if (json.dir != "") {
            openDirectory(json.dir);
        }
        $(".loading").toggleClass("ready");

        if (json.loop)
            $("#loop").toggleClass("active");
        if (json.shuffle)
            $("#shuffle").toggleClass("active");
    });

    $(".settings-button").on("click", function () {
        $(".settings").toggleClass("open");
    });

    $(".settings-shade").on("click", function () {
        $(".settings").toggleClass("open");
    });

    function changeDirectory() {
        if (fs.existsSync($musicDirectoryInput.val())) {
            json.dir = $musicDirectoryInput.val();
            openDirectory(json.dir);
        } else {
            dialog.showMessageBox(mainWindow, {
                type: "error",
                title: "Invalid Folder",
                message: "You have chose an invalid folder. Please choose another one",
                buttons: ["Ok"]
            });
            $musicDirectoryInput.val(json.dir);
        }
    }

    $("#music-directory-button").on("click", changeDirectory);

    $(".folder-button").on("click", function () {
        $musicDirectoryInput.val(dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        })[0]);
    });

    function openDirectory(path) {

        var $contentItems = $(".content-items");

        var index = 0;
        var songNumber = 0;
        var previous = null;

        function reset() {
            $contentItems.html("");
            $("#audio").attr("src", "");
        }

        reset();

        fs.readdir(path, function (err, rawFiles) {
            function createPlaylistItem(name, path) {
                var $item = $("<div></div>");
                $item.addClass("content-item");

                $item.append("<i class='material-icons'></i><div class='content-item-text'>" + name + "</div>");

                $item.data("path", path);
                $item.data("name", name);

                $contentItems.append($item);

                $item.on("click", function () {
                    playSong($(this).index());
                });
            }

            function playSong(i) {
                var $item = $(".content-items").children().eq(i);
                console.log(i);
                var data = $item.data();

                $("#audio").attr("src", data.path + "/" + data.name);

                if (previous != null)
                    previous.removeClass("selected");

                $item.addClass("selected");

                index = i;
                previous = $item;
            }

            String.prototype.replaceAll = function(str1, str2, ignore) {
                return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
            }

            var files = [];

            var compatibleFiles = ["wav", "wave", "mp3", "m4a", "m4b", "m4p", "m4v", "m4r", "3gp", "mp4", "acc", "ogg", "ogv", "oga", "ogx", "ogm", "spx", "opus", "webm"];
            for (var i = 0; i < rawFiles.length; i++) {
                var file = rawFiles[i];

                if (file.match(".(" + compatibleFiles.toString().replaceAll(",", "|") + ")$")) {
                    files.push(file);
                    songNumber++;
                }
            }

            for (i in files) {
                createPlaylistItem(files[i], path);
            }

            $(".behind-text").css("display", "none");
            $(".content").addClass("show");

            // audio listeners
            var $audio = $("#audio"); //define audio
            var audio = $audio[0]; // the non jQuery audio :D

            // start first song in list
            playSong(0);

            function random() {
                var randomSong = Math.floor(Math.random() * (files.length));
                if (randomSong == index)
                    return random();
                return randomSong;
            }

            $audio.on("ended", function () {
                setTimeout(function () {
                    if (audio.paused) { // make sure that the user hasn't restarted the current song
                        if (json.shuffle) { // if the user wants to shuffle
                            playSong(random());
                        } else if (index != songNumber - 1) // natural progression
                            playSong(index + 1);
                        else if (loop) // if looping, go back to the beginning
                            playSong(0);
                    }
                }, 1000);
            });

        });

        // quick options
        $("#loop").on("click", function () {
            $(this).toggleClass("active");
            json.loop = !json.loop;
        });

        $("#shuffle").on("click", function () {
            $(this).toggleClass("active");
            json.shuffle = !json.shuffle;
        });

        $(".behind-text").text("Loading...");
    }

    $(window).on("beforeunload", function () {
        fs.writeFileSync(dataFile, JSON.stringify(json));
    });
});