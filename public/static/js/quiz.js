$(document).ready(function() {

    var questionHeight;
    var seconds = 5;
    var clicked = false;
    var answer;
    var answers = ['a', 'b', 'c', 'd'];
    var score = 0;
    var count = 0;
    var user = 'bob';
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
        $('#user').html('So ' + user.id + ', this is awkward....');
        $('#message').html('You have no playlists...');
        $('#countdown').hide();
        setTimeout(function() {
        }, 4000);
    }

    function displayWelcome() {
        $('#user').html('Welcome, ' + user.id + '!');
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
    function getUser() {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                user = response;
            }
        });
    }
*/
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

    function setAnswer() {
        var randomNumber = getRandomNumber(4);
        answer = answers[randomNumber];
        $('#' + answer).html(tracks[count].artist);
    }

    function createQuestion() {
        if (count == tracks.length) {
            $('#quiz').fadeOut(function() {
                $('#welcome').fadeIn();
                $('#user').html('Wow ' + user.id + '!');
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
                console.log(count)
                console.log(tracks[count])
                $('#track').html(tracks[count].name);
                //$('#playlist').html(tracks[count].playlist);
                $('#a').html(response.artists[0].name);
                $('#b').html(response.artists[1].name);
                $('#c').html(response.artists[2].name);
                $('#d').html(response.artists[3].name);
                setAnswer();
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
    displayWelcome();
    //-- Today's Top Hits --
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

//     //     -- Get Turnt --
//     tracks = [
//         {name: 'Rockstar', artist: 'Post Malone', artist_id: 'Post Malone'},
//         {name: 'Slippery', artist: 'Migos', artist_id: 'Migos'},
//         {name: 'Gucci Gang', artist: 'Lil Pump', artist_id: 'Lil Pump'},
//         {name: 'Headlines', artist: 'Drake', artist_id: 'Drake'},
//         {name: 'March Madness', artist: 'Future', artist_id: 'Future'},
//         {name: 'Butterfly Effect', artist: 'Travis Scott', artist_id: 'Travis Scott'},
//         {name: 'No Flockin', artist: 'Kodak Black', artist_id: 'Kodak Black'},
//         {name: 'The Way Life Goes', artist: 'Lil Uzi Vert', artist_id: 'Lil Uzi Vert'},
//         {name: 'Plain Jane', artist: 'A$AP Ferg', artist_id: 'A$AP Ferg'},
//         {name: 'Ex Calling', artist: '6LACK', artist_id: '6LACK'}
//     ]
//
//     // -- Today's Top Hits --
//     tracks = [
//         {name: 'What Makes You Country', artist: 'Luke Bryan', artist_id: 'Luke Bryan'},
//         {name: 'The Rest of our Life', artist: 'Tim McGraw', artist_id: 'Tim McGraw'},
//         {name: 'Body Like a Backroad', artist: 'Sam Hunt', artist_id: 'Sam Hunt'},
//         {name: 'Back to Us', artist: 'Rascal Flatts', artist_id: 'Rascal Flatts'},
//         {name: 'All the Pretty Girls', artist: 'Kenny Chesney', artist_id: 'Kenny Chesney'},
//         {name: 'Unforgettable', artist: 'Thomas Rhett', artist_id: 'Thomas Rhett'},
//         {name: 'Smooth', artist: 'Florida Georgia Line', artist_id: 'Florida Georgia Line'},
//         {name: 'Kiss Somebody', artist: 'Morgan Evans', artist_id: 'Morgan Evans'},
//         {name: 'They Dont Know', artist: 'Jason Aldean', artist_id: 'Jason Aldean'},
//         {name: 'Hooked', artist: 'Dylan Scott', artist_id: 'Dylan Scott'}
//     ]
//
//
// // -- Rock Solid --
// tracks = [
//     {name: 'Everlong', artist: 'Foo Fighters', artist_id: 'Foo Fighters'},
//     {name: 'Numb', artist: 'Linkin Park', artist_id: 'Linkin Park'},
//     {name: 'Uprising', artist: 'Muse', artist_id: 'Muse'},
//     {name: 'Pardon Me', artist: 'Incubus', artist_id: 'Incubus'},
//     {name: 'Miss Murder', artist: 'AFI', artist_id: 'AFI'},
//     {name: 'Savior', artist: 'Rise Against', artist_id: 'Rise Against'},
//     {name: 'Self Esteem', artist: 'The Offspring', artist_id: 'The Offspring'},
//     {name: 'Sex on Fire', artist: 'Kings of Leon', artist_id: 'Kings of Leon'},
//     {name: 'Hail to the King', artist: 'Avenged Sevenfold', artist_id: 'Avenged Sevenfold'},
//     {name: 'Even Flow', artist: 'Pearl Jam', artist_id: 'Pearl Jam'}
// ]
//
// // -- Fresh Electronic --
// tracks = [
//     {name: 'Jealousy', artist: 'Disciples', artist_id: 'Disciples'},
//     {name: 'Dont Stop', artist: 'Tiesto', artist_id: 'Tiesto'},
//     {name: 'Fever', artist: 'Nora En Pure', artist_id: 'Nora En Pure'},
//     {name: 'Resolve', artist: 'Audien', artist_id: 'Audien'},
//     {name: 'Revolt', artist: 'John Christian', artist_id: 'John Christian'},
//     {name: 'Time For the Techno', artist: 'Carnage', artist_id: 'Carnage'},
//     {name: 'Love Me', artist: 'Beau Collins', artist_id: 'Beau Collins'},
//     {name: 'Once Upon a Time', artist: '7 Skies', artist_id: '7 Skies'},
//     {name: 'Brooke', artist: 'AxMod', artist_id: 'AxMod'},
//     {name: 'Nobody But You', artist: 'KRANE', artist_id: 'KRANE'}
// ]

    shuffleArray(tracks);
    createQuestion();
});
