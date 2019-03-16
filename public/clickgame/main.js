$(function() {
    window.sound = true; // initially allow sound
    
    function initGame() {
        // hide the start page, load the stats tab and set time based on user settings.
        $("#game").hide();
        $("#tab").removeAttr("hidden");
        $(".play").removeAttr("hidden");
        $("#score").text("Score: 0");
        $("#accuracy").text("Accuracy: 100.00%");
        $("#minutes").text($("#minute-setting").val());
        $("#seconds").text($("#second-setting").val());
    }
    function makeNewCircle() {
        // make a new circle with random x and y coordinates
        x = Math.floor(440 * Math.random());
        y = Math.floor(440 * Math.random());
        $(".play").append("<span class='circle' style='margin-top: " + y + "px; margin-left: " + x + "px;'></span>");
        
    }
    function timer(time, game, create, score) {
        // Timer in stats tab that counts down.
        var seconds = $("#seconds").text();
        var minutes = $("#minutes").text();
        if(seconds === "00") {
            if(minutes === "0") {
                // When time hits 0, reset the the game, clear the interval that is counting time and stop the function.
                reset(create, game, score);
                clearInterval(time);
                return;
            } else {
                $("#minutes").text(minutes - 1);
                $("#seconds").text("59");
            }
        } else {
            if(seconds <= 10) {
                $("#seconds").text("0" + (seconds - 1));
            } else {
                $("#seconds").text(seconds - 1);
            }
        }
    }
    function reset(create, game, score) {
        // remove all circles still on the screen. Hide the playing area and show the main screen again
        $(".circle").remove();
        $("#tab").attr("hidden", "hidden");
        $(".play").attr("hidden", "hidden");
        $("#game").show();
        // remove click listeners and clear timed interval functions
        $(".play").off("click");
        clearInterval(game);
        clearInterval(create);
        // update highscore if your current score is greater than the high score
        if($("#highscore").text() < score) {
            $("#highscore").text(score);
        }
        // ask to play again
        $("h2").text("Play Again?");
        // after playing one game at least, show the score of your most recent game. Hidden initially.
        $("#end-score").text($("#score").text());
        $("#end-score").removeAttr("hidden", "hidden");
        $("#game").css("margin-top", "35%");
    }

    function updateAccuracy(clicked, missed) {
        // updates the accuracy in the stats tab. the amount of circles you correctly clicked divided by the missed and incorrect clicks as a percentage
        $("#accuracy").text("Accuracy: " + (clicked/(clicked + missed) * 100).toFixed(2) + "%");
    }
    function updateScore(score) {
        // shows your current score in the stats tab
        $("#score").text("Score: " + score);
    }

    $(".start").click(function() {
        // reset all game variables back to 0.
        var  score = 0,
            missed = 0,
           clicked = 0,   
         successNb = 0, // counter
         failureNb = 0; // counter
        // create arrays with success and failure sounds. an array was used to allow sounds to play over eachother before finishing
        const success = [new Audio('sounds/success.wav'), new Audio('sounds/success.wav'), new Audio('sounds/success.wav'), new Audio('sounds/success.wav'), new Audio('sounds/success.wav')],
              failure = [new Audio('sounds/failure.wav'), new Audio('sounds/failure.wav')];
        
        // change the maximum amount of circles on the screen based on difficulty
        var difficulty = $(this).text();
        if(difficulty === "Easy") {
            var circles = 3;
        } else if(difficulty === "Medium") {
            var circles = 6;
        } else {
            var circles = 9;
        }
        // initialize the game with the current score of 0
        initGame();
        // add a click listener to the whole game area
        $(".play").on('click', function(e) {
            if(e.target !== this) { // is the clicked event a circle?
                // if so, play the success sound, remove the circle and update score and accuracy
                if(window.sound) {
                    // looping through the success sound array so that multiple success sounds can be played at once
                    success[ successNb++ % success.length ].play();
                }
                e.target.remove();
                score++;
                updateScore(score);
                clicked++;
                updateAccuracy(clicked, missed);
            } else {
                // the user clicked but it was not a circle. update accuracy and play a failure sound
                if(window.sound) {
                    failure[ failureNb++ % failure.length ].play();
                }
                missed++;
                updateAccuracy(clicked, missed);
            }
           
        });
        // create, game, and time variables are set to the setinterval function's return value so that they can be stopped when the game stops
        var create = setInterval(function() {
            // makes new circles upto a maximum amount on the screen at once. For easy, it is 3, medium 6, hard 9.
            if($(".circle").length != circles) {
                makeNewCircle();
            }
            // the speed at which they are created is also dependent on difficulty. for easy it is 1 circle each second, for medium it is 2 circles each second, and hard it is 3 circles each second.
        }, 3000/circles);

        var game = setInterval(function() {
            // checks the size of the circle. if it is 0, delete it, play the failure sound and update accuracy.
            $(".circle").each(function() {
                if(!$(this).width()) {
                    if(window.sound) {
                        failure[ failureNb++ % failure.length ].play();
                    }
                    $(this).remove();
                    missed++;
                    updateAccuracy(clicked, missed);
                }
                // if circle size is not 0, then decrease the size by 1px every 60ms. 
                $(this).width($(this).width() - 1);
                $(this).height($(this).height() - 1);
            });
        }, 60);

        var time = setInterval(function() {
            // updates the timer every second, passing in the variables for the setinterval functions so that it can call reset using them to clear them.
            timer(time, game, create, score);
        }, 1000)

        $(".end").on("click", function() {
            // quit button. resets game and clears intervals. 
            clearInterval(time);
            reset(create, game, score);
        });
    });

    $("#settings").on("click", function() {
        // settings button on home page. when clicked, hides home page and shows settings page
        $("#game").hide();
        $("#settings-page").removeAttr("hidden", "hidden");
    });
    $("input").on("keydown", function(event) { // only allow numbers to be set for time values
            // Allow only backspace and delete
        if ( event.keyCode == 46 || event.keyCode == 8 ) {
                // let it happen, don't do anything
        }
        else {
                // Ensure that it is a number and stop the keypress
            if (event.keyCode < 48 || event.keyCode > 57 ) {
                event.preventDefault(); 
            }   
        }
    });
    
    $("#toggle-sound").click(function() {
        // when the user clicks on the sound button, toggle the icon and sound setting.
        $("#sound-button").toggleClass("fa-volume-up").toggleClass("fa-volume-off");
        window.sound = !window.sound;
    });
    $("#second-setting").on("input", function() {
        // only allow seconds values of 00-59
        if($(this).val() > 59) {
            $(this).val(59);
        }
    });
    $("#back").on("click", function() {
        // when clicking back on settings page, fix/interpret any weird user inputs such as no input for time.
        var seconds = $("#second-setting").val()
        if(seconds.length === 0) {
            $("#second-setting").val("00")
        } else if(seconds.length === 1) {
            $("#second-setting").val("0" + seconds);
        }
        if($("#minute-setting").val().length === 0) {
            $("#minute-setting").val("0")
        }
        // show main screen again and hide settings page.
        $("#game").show();
        $("#settings-page").attr("hidden", "hidden");
    });
    $("#about").on("click", function() {
        $("#settings-page").attr("hidden", "hidden");
        $("#about-page").removeAttr("hidden");
    });
    $("#back-about").on("click", function() {
        $("#settings-page").removeAttr("hidden");
        $("#about-page").attr("hidden", "hidden");
    })
});