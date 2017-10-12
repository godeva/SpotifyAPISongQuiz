$(document).ready(function() {

    var questionHeight;
    var seconds = 5;
    var clicked = false;
    var answer;
    var answers = ['a', 'b', 'c', 'd'];
    var score = 0;
    var count = 0;
    var user = 'dude';
    var playlists = [];
    var tracks = [];

    //var params = getHashParams();

    //var access_token = params.access_token,
    //    error = params.error;

    function shuffleArray(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function getRandomNumber(max) {
        return Math.floor(Math.random() * (max - 1));
    }

    if ($(window).width() < 1024) {
        questionHeight = 3;
    } else {
        questionHeight = 2;
    }

    function countdown() {
        var counter = setInterval(function() {
                seconds--;
                if (seconds < 1) {
                    clearInterval(counter);
                    $('#welcome').fadeOut(function() {
                        initialiseTracker();
                        $('#quiz').fadeIn();
                        var trackHeight = parseInt($("#track").css("font-size"));
                        // var playlistHeight = parseInt($("#playlist").css("font-size"));
                        // var quizHeight = trackHeight + playlistHeight;
                        var quizHeight = trackHeight;
                        $('#track').css('bottom', trackHeight + 'px');
                        // $('#track').css('bottom', playlistHeight + 'px');
                        $('#question').height(quizHeight * questionHeight);
                    });
                } else {
                    $('#countdown').html(seconds.toString()).removeClass('animated zoomIn').hide().show().addClass('animated zoomIn');
                }
            },
            800);
    }

    
    function noPlaylists() {
        $('#welcome').fadeIn();
        $('#user').html('So ' + user+ ', this is awkward....');
        $('#message').html('You have no playlists...');
        $('#countdown').hide();
        setTimeout(function() {
        }, 4000);
    }

    function displayWelcome() {
        $('#user').html('Welcome, ' + user + '!');
        $('#message').html('The quiz will begin in');
        setTimeout(function() {
            $('#welcome').fadeIn(function() {
                countdown();
            });
        }, 500);
    }

    function initialiseTracker() {
        $('#score').html('Score: ' + 0);
        $('#counter').html('Question: ' + 1);
    }

/*
    function getPlaylists() {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                playlists = response.items;
            }
        });
    }
*/
/*
    function getTracks() {
        var promise = Promise.resolve(null);

        playlists.forEach(function(playlist) {
            promise = promise.then(function() {
                return getTrack(playlist.name, playlist.tracks.href);
            });
        });

        return promise.then(function() {
            return true;
        });
    }
*/
/*
    function getTrack(playlist, url) {
        return $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                setTracks(playlist, response.items);
                if (response.next != null) {
                    getTrack(playlist, response.next);
                }
            }
        });
    }
*/
/*
    function setTracks(playlist, list) {
        var promise = Promise.resolve(null);

        list.forEach(function(track) {
            promise = promise.then(function() {
                if (track.track != null) {
                    return tracks.push({
                        playlist: playlist,
                        name: track.track.name,
                        artist: track.track.artists[0].name,
                        artist_id: track.track.artists[0].id,
                        asked: false
                    })
                }
            });
        });

        return promise.then(function() {
            return true;
        });
    }
*/
/*
    function getRelatedArtists(id) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + id + '/related-artists',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
    }
*/
    $('.answer').click(function(event) {
        event.preventDefault();
        if (!clicked) {
            clicked = true;
            setTimeout(function() {
                $(event.target.id).removeClass('hover');
                showCorrectAnswer(event.target.id);
            }, 500);
        }
    });

    function showCorrectAnswer(picked_answer) {
        $('#' + answer).addClass('correct');
        setTimeout(function() {
            clicked = false;
            $('#' + answer).removeClass('correct');
            if (picked_answer == answer) {
                score++;
            }
            updateScore();
            createQuestion();
        }, 1000);
    }

    function updateScore() {
        $('#score').html('Score: ' + score);
        $('#counter').html('Question: ' + (count + 1));
    }

    function setAnswer(response) {
        var randomNumber = getRandomNumber(4);
        answer = answers[randomNumber];
        $('#' + answer).html(tracks[count].artist);
        switch (answer){
            case 'a':
                fillNotAnswer($('#b'),  $('#c'),  $('#d'), response)
                break
            case 'b':
                fillNotAnswer($('#a'),  $('#c'),  $('#d'), response)
                break
            case 'c':
                fillNotAnswer($('#a'),  $('#b'),  $('#d'), response)
                break
            case 'd':
                fillNotAnswer($('#a'),  $('#b'),  $('#c'), response)
                break
        }
    }

    function fillNotAnswer(ele1, ele2, ele3, response) {
        var index = 0
        var numNotAnswer = 0
        while (numNotAnswer < 3) {
            if (response.artists[index].name !== tracks[count].artist) {
                var ele
                switch (numNotAnswer) {
                    case 0:
                        ele = ele1
                        break
                    case 1:
                        ele = ele2
                        break
                    case 2:
                        ele = ele3
                        break
                    default:
                        break
                }
                ele.html(response.artists[index].name);
                numNotAnswer++
            }
            index++
        }
    }

    function createQuestion() {
        if (count == tracks.length) {
            $('#quiz').fadeOut(function() {
                $('#welcome').fadeIn();
                $('#user').html('Wow ' + user + '!');
                $('#message').html('You answered all ' + (count) + ' questions....<br>Your final score was ' + score + '!');
                $('#countdown').html('');
                setTimeout(function() {
                }, 5000);
            });
        } else {
            //getRelatedArtists(tracks[count].artist_id).then(function(response) {
                var response = {
                    artists:[
                    {name: 'Charlie Puth'},
                    {name: 'Khalid'},
                    {name: 'Imagine Dragons'},
                    {name: 'Cardi B'},
                    {name: 'Maroon 5'},
                    {name: 'Avicii'},
                    {name: 'SZA'},
                    {name: 'Niall Horan'},
                    {name: 'Demi Lovato'},
                    {name: 'Lane Harrison'}]
                }
                shuffleArray(response.artists);
                $('#track').html(tracks[count].name);
                //$('#playlist').html(tracks[count].playlist);
                setAnswer(response);
                count++;
            //});
        }
    }
/*
    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            getUser().then(function() {
                getPlaylists().then(function() {
                    if (playlists.length == 0) {
                        //noPlaylists();
                        displayWelcome();
                        tracks = [
                        {name: 'dwa', artist: 'justin bieber', artist_id: 'ggawdaiubwda'},
                        {name: 'dws', artist: 'taylor swift', artist_id: 'ggawdaiubwda'}
                        ]
                        shuffleArray(tracks);
                        createQuestion();
                    } else {
                        displayWelcome();
                        getTracks().then(function() {
                            shuffleArray(tracks);
                            createQuestion();
                        });
                    }
                });
            });
        }
    }
    */
    //getUser(function () {
    displayWelcome();
    tracks = [
        {name: 'How Long', artist: 'Charlie Puth', artist_id: 'Charlie Puth'},
        {name: 'Young Dumb and Broke', artist: 'Khalid', artist_id: 'Khalid'},
        {name: 'Thunder', artist: 'Imagine Dragons', artist_id: 'Imagine Dragons'},
        {name: 'Bodak Yellow', artist: 'Cardi B', artist_id: 'Cardi B'},
        {name: 'What Loves Do', artist: 'Maroon 5', artist_id: 'Maroon 5'},
        {name: 'Lonely Together', artist: 'Avicii', artist_id: 'Avicii'},
        {name: 'Love Galore', artist: 'SZA', artist_id: 'SZA'},
        {name: 'Too Much To Ask', artist: 'Niall Horan', artist_id: 'Niall Horan'},
        {name: 'Sorry Not Sorry', artist: 'Demi Lovato', artist_id: 'Demi Lovato'},
        {name: 'Sativa', artist: 'Jhene Aeiko', artist_id: 'Jhene Aeiko'}
    ]
    shuffleArray(tracks);
    createQuestion();
    //}
});
