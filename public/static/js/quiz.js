$(document).ready(function() {

    var questionHeight;
    var access_token
    var seconds = 5;
    var clicked = false;
    var answer;
    var answers = ['a', 'b', 'c', 'd'];
    var score = 0;
    var count = 0;
    var user = 'dude';
    var playlistName;
    var tracks = [];
    var audiotag = document.createElement("AUDIO");
    var delay_run = true;

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
        console.log ("countdown")
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
        $('#message').html("You didn't select a playlist...");
        $('#countdown').hide();
        setTimeout(function() {
            console.log($(window)[0])
            $(window)[0].location.replace('/lobby')
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

    function newXHR (method, url, sender, handler) {
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            handleRes(req, handler)
        }
        req.open(method, url, true)
        sender(req)
    }

    function handleRes(req, handler) {
        if( req.readyState !== XMLHttpRequest.DONE ) {
            return
        }
        if(req.status === 200) {
            handler (req)
        }
    }

    function playSong(url) {
        audiotag.pause();
        audiotag.src = url;


        var playPromise = audiotag.play();

    
        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
        if (playPromise !== undefined) {
            playPromise.then(function () {
                audiotag.play();
                // Automatic playback started!
            }).catch(function (error) {
               audiotag.play();
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
        }

        
                
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
            $(event.target.id).removeClass('hover');
            showCorrectAnswer(event.target.id);
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
        }, 1200);
    }

    function updateScore() {
        $('#score').html('Score: ' + score);
        if (count < tracks.length) {
            $('#counter').html('Question: ' + (count + 1));
        }
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

    function sendScoreToDB() {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('giving up :( cannot create');
            return false;
        }

        var message = user + ":" + score;
        console.log(message)
        xhr.onreadystatechange = handleDBUpdate;
        xhr.open('POST', '/leaders');
        xhr.send('score=' + message);
    }

    function handleDBUpdate(req) {
      var req_targ = req.target; //whyyyy
      if (req_targ.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (req_targ.status === 200) {
        console.log("success");
        }
    }

    function playWrapper() {
        console.log("playWrapper");
        playSong(tracks[count].url);
    }

    function createQuestion() {
        if (count == tracks.length) {
            audiotag.pause();
            sendScoreToDB();
            $('#quiz').fadeOut(function() {
                $('#welcome').fadeIn();
                $('#user').html('Wow ' + user + '!');
                $('#message').html('You answered all ' + (count) + ' questions....<br>Your final score was ' + score + '!<br><br> <u><a id ="lobby" href="lobby.html">Return to the Lobby</a></u>');
                $('#countdown').html('');
                setTimeout(function() {
                    console.log($(window)[0])
                    $(window)[0].location.replace('/lobby')
                }, 5000);
            });
        } else {
            if (delay_run === true) {
                console.log("first run");
                delay_run = false;
                setTimeout( playWrapper, 5000);
            } else {
                playSong(tracks[count].url);
            }
            //getRelatedArtists(tracks[count].artist_id).then(function(response) {
            var response = {}
            switch (playlistName) {
                case 'turnt':
                    var response = {
                        artists: [
                            { name: 'B.o.B' },
                            { name: 'Fetty Wap' },
                            { name: 'Kendrick Lamar' },
                            { name: 'Lil Uzi Vert' },
                            { name: 'Migos' },
                            { name: 'Flo Rida' },
                            { name: 'Pitbull' },
                            { name: 'A$AP Rocky' },
                            { name: 'Post Malone' },
                            { name: 'Lane Harrison' },
                            { name: '21 Savage' },
                            { name: 'Tupac' },
                            { name: 'Dr. Dre' },
                            { name: 'DJ Khaled' },
                            { name: 'Quavo' },
                            { name: 'Eminem' },
                            { name: 'Young Thug' },
                            { name: 'Logic' },
                            { name: 'Yo Gotti' },
                            { name: 'Tay-K' },
                            { name: 'Rich The Kid' },
                            { name: 'Kid Cudi' },
                            { name: 'Ludacris' },
                            { name: 'Travis Scott' },
                            { name: 'Rae Sremmurd' },
                            { name: 'Nicki Minaj' },
                            { name: 'Cardi B' },
                            { name: 'Kanye West' },
                            { name: 'Future' },
                            { name: '6LACK' },
                            { name: 'Pressa' },
                            { name: 'Trippie Redd' },
                            { name: 'YG' },
                            { name: 'Ty Dolla $ign' },
                            { name: 'ScHoolboy Q' },
                            { name: 'Vince Staples' },
                            { name: 'A Boogie Wit da Hoodie' },
                            { name: 'G-Unit' },
                            { name: '50 Cent' },
                            { name: 'Drake' }]
                    }
                    break
                case 'top':
                    var response = {
                        artists: [
                            { name: 'Charlie Puth' },
                            { name: 'Khalid' },
                            { name: 'Imagine Dragons' },
                            { name: 'Cardi B' },
                            { name: 'Maroon 5' },
                            { name: 'Avicii' },
                            { name: 'SZA' },
                            { name: 'Niall Horan' },
                            { name: 'Demi Lovato' },
                            { name: 'Lane Harrison' },
                            { name: '21 Savage' },
                            { name: 'Diplo' },
                            { name: 'Kendrick Lamar' },
                            { name: 'Eminem' },
                            { name: 'Alessia Cara' },
                            { name: 'NF' },
                            { name: 'Kygo' },
                            { name: 'Lorde' },
                            { name: 'Taylor Swift' },
                            { name: 'Katy Perry' },
                            { name: 'Ke$ha' },
                            { name: 'Post Malone' },
                            { name: 'Ed Sheeran' },
                            { name: 'Fall Out Boy' },
                            { name: 'Portugal. The Man' },
                            { name: 'Justin Bieber' },
                            { name: 'Jason Derulo' },
                            { name: 'blackbear' },
                            { name: 'Lauv' },
                            { name: 'DJ Snake' },
                            { name: 'Halsey' },
                            { name: 'ZAYN' },
                            { name: 'Macklemore' },
                            { name: 'Nicki Minaj' },
                            { name: 'Ariana Grande' },
                            { name: 'Miley Cyrus' },
                            { name: 'Pitbull' },
                            { name: 'Logic' },
                            { name: 'Sam Smith' }]
                    }
                    break
                case 'hot':
                    var response = {
                        artists: [
                            { name: 'Blake Shelton' },
                            { name: 'Luke Bryan' },
                            { name: 'Maren Morris' },
                            { name: 'Vince Gill' },
                            { name: 'Tim McGraw' },
                            { name: 'Faith Hill' },
                            { name: 'Sam Hunt' },
                            { name: 'Jon Pardi' },
                            { name: 'Cole Swindell' },
                            { name: 'Jackie Lee' },
                            { name: 'Old Dominion' },
                            { name: 'Granger Smith' },
                            { name: 'Luke Combs' },
                            { name: 'Kelsea Ballerini' },
                            { name: 'Kenny Chesney' },
                            { name: 'Billy Currington' },
                            { name: 'Florida Georgia Line' },
                            { name: 'Thomas Rhett' },
                            { name: 'Kane Brown' },
                            { name: 'Morgan Evans' },
                            { name: 'Dustin Lynch' },
                            { name: 'Jason Aldean' },
                            { name: 'Parmalee' },
                            { name: 'Dylan Scott' },
                            { name: 'Brett Young' },
                            { name: 'Kip Moore' },
                            { name: 'LANCO' },
                            { name: 'Hunter Hayes' },
                            { name: 'Russell Dickerson' },
                            { name: 'Ryan Hurd' },
                            { name: 'Jordan Davis' },
                            { name: 'Chris Young' },
                            { name: 'Shania Twain' },
                            { name: 'Miranda Lambert' },
                            { name: 'Willie Nelson' },
                            { name: 'Chase Rice' },
                            { name: 'Chris Bandi' },
                            { name: 'Ryan Kinder' },
                            { name: 'Chris Lane' },
                            { name: 'Lane Harrison' }]
                    }
                    break
                case 'solid':
                    var response = {
                        artists: [
                            { name: 'Imagine Dragons' },
                            { name: 'The Killers' },
                            { name: 'Sum 41' },
                            { name: 'Marilyn Manson' },
                            { name: 'Muse' },
                            { name: 'Queens of the Stone Age' },
                            { name: 'MISSIO' },
                            { name: 'The White Stripes' },
                            { name: 'Linkin Park' },
                            { name: 'Jimmy Eat World' },
                            { name: 'Incubus' },
                            { name: 'Rage Against the Machine' },
                            { name: 'System of a Down' },
                            { name: 'Nirvana' },
                            { name: 'Red Hot Chili Peppers' },
                            { name: 'Sublime' },
                            { name: 'Green Day' },
                            { name: 'Fall Out Boy' },
                            { name: 'Jet' },
                            { name: 'Rise Against' },
                            { name: 'Shinedown' },
                            { name: 'Limp Bizkit' },
                            { name: '3 Doors Down' },
                            { name: 'Thirty Seconds to Mars' },
                            { name: 'Blur' },
                            { name: 'The Black Keys' },
                            { name: 'blink-182' },
                            { name: 'Avenged Sevenfold' },
                            { name: 'The Smashing Pumpkins' },
                            { name: 'Pearl Jam' },
                            { name: 'Alice in Chains' },
                            { name: 'Trapt' },
                            { name: 'Korn' },
                            { name: 'Guns N\' Roses' },
                            { name: 'Stone Temple Pilots' },
                            { name: 'Three Days Grace' },
                            { name: 'Kings of Leon' },
                            { name: 'Arctic Monkeys' },
                            { name: 'Metallica' },
                            { name: 'Lane Harrison' }]
                    }
                    break
                case 'fresh':
                    var response = {
                        artists: [
                            { name: 'Avicii' },
                            { name: 'Diplo' },
                            { name: 'La Roux' },
                            { name: 'Kygo' },
                            { name: 'David Guetta' },
                            { name: 'Calvin Harris' },
                            { name: 'Bebe Rexha' },
                            { name: 'Cash Cash' },
                            { name: 'Throttle' },
                            { name: 'Marshmello' },
                            { name: 'Hardwell' },
                            { name: 'Alan Walker' },
                            { name: 'Bali Bandits' },
                            { name: 'AxMod' },
                            { name: 'SWACQ' },
                            { name: 'Tony Silanto' },
                            { name: 'Autograf' },
                            { name: 'KRANE' },
                            { name: 'Max Styler' },
                            { name: 'Afrojack' },
                            { name: 'Skrillex' },
                            { name: 'Steve Aoki' },
                            { name: 'DJ Licious' },
                            { name: 'Audien' },
                            { name: 'Disciples' },
                            { name: 'Carnage' },
                            { name: 'Alok' },
                            { name: 'Snails' },
                            { name: 'John Christian' },
                            { name: 'Beau Collins' },
                            { name: 'Raz Nitzan' },
                            { name: '7 Skies' },
                            { name: 'CID' },
                            { name: 'Illenium' },
                            { name: 'SLANDER' },
                            { name: 'AC Slater' },
                            { name: 'Tchami' },
                            { name: 'Hot Shade' },
                            { name: 'Dillon Francis' },
                            { name: 'Lane Harrison' }]
                    }
                    break
                default:
                    var response = {}
                    break
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

    //getAT(function(){})
    newXHR ('GET', '/getGameData', function(req){req.send()}, function(req){
        var data = JSON.parse(req.responseText)
        user = data.name
        playlistName = data.playlist
        console.log('playlist: ' + playlistName)
        switch (playlistName) {
            case 'turnt':
                tracks = tracks2
                break
            case 'top':
                tracks = tracks1
                break
            case 'hot':
                tracks = tracks3
                break
            case 'solid':
                tracks = tracks4
                break
            case 'fresh':
                tracks = tracks5
                break
            default:
                tracks = []
                break
        }
        if (tracks.length <= 0) {
            noPlaylists()
        } else {
            displayWelcome()
            shuffleArray(tracks)
            createQuestion()
        }
    })

    function getAT(callback) {
        newXHR ('GET', '/accessToken', function(req){req.send()}, function(req){
            var rt = req.responseText
            if (rt) {
                access_token = rt
                console.log(rt)
                callback()
            } else {
                console.log('no access_token')
            }
        }) 
    }
    //-- Today's Top Hits --
    
// hot
    var tracks1 = [
        { name: 'How Long', artist: 'Charlie Puth', artist_id: 'Charlie Puth', url: 'https://p.scdn.co/mp3-preview/8857931984acbbcca43e73745084cc76aba25845?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Young Dumb and Broke', artist: 'Khalid', artist_id: 'Khalid', url: 'https://p.scdn.co/mp3-preview/6f984c9c6e43eccb00fefdce091212f08887258a?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Bodak Yellow', artist: 'Cardi B', artist_id: 'Cardi B', url: 'https://p.scdn.co/mp3-preview/35254f7611813c692709161d41cb04a694c9b5fa?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Love Galore', artist: 'SZA', artist_id: 'SZA', url: 'https://p.scdn.co/mp3-preview/34ee046041c05b75609bd7eec1e97b6c7cb4fe4f?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Good Old Days', artist: 'Macklemore', artist_id: 'Macklemore', url: 'https://p.scdn.co/mp3-preview/382e98fe869bf3ce35acf0f01b09cc199a3292be?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Havana', artist: 'Camila Cabello', artist_id: 'Camila Cabello', url: 'https://p.scdn.co/mp3-preview/1f789c77d7e08e3328de28114f4ef7a2e840b631?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Perfect', artist: 'Ed Sheeran', artist_id: 'Ed Sheeran', url: 'https://p.scdn.co/mp3-preview/9779493d90a47f29e4257aa45bc6146d1ee9cb26?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Questions', artist: 'Chris Brown', artist_id: 'Chris Brown', url: 'https://p.scdn.co/mp3-preview/94c692b2db1bd951be264d9420b02af12f4f8240?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Easy Love', artist: 'Lauv', artist_id: 'Lauv', url: 'https://p.scdn.co/mp3-preview/79fd7debbc7b26c8acb5448a13e5bc4cc11c3225?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'What About Us', artist: 'P!nk', artist_id: 'P!nk', url: 'https://p.scdn.co/mp3-preview/444931f5decdb6bbaeade77d1bcbb82f5258c1cf?cid=f067d80090d34e11b883b81236ad9316' }
    ]

//     //     -- Get Turnt --
    var tracks2 = [
        { name: 'Slippery', artist: 'Migos', artist_id: 'Migos', url: 'https://p.scdn.co/mp3-preview/25bf4c7c13f59a0bd7f0ce023a524892a7216872?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Gucci Gang', artist: 'Lil Pump', artist_id: 'Lil Pump', url: 'https://p.scdn.co/mp3-preview/a6d17f8c01dacc5b570438b8547c28539e1896ea?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'March Madness', artist: 'Future', artist_id: 'Future', url: 'https://p.scdn.co/mp3-preview/c18456723a2560161a736a91cff96d84b658d854?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Butterfly Effect', artist: 'Travis Scott', artist_id: 'Travis Scott', url: 'https://p.scdn.co/mp3-preview/626db743053d334941ffe68648be4a339ecd69db?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'No Flockin', artist: 'Kodak Black', artist_id: 'Kodak Black', url: 'https://p.scdn.co/mp3-preview/ab8322b29b28cd0610593ddf7f736631c8bbfca8?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'The Way Life Goes', artist: 'Lil Uzi Vert', artist_id: 'Lil Uzi Vert', url: 'https://p.scdn.co/mp3-preview/4d282cabd448444f2618fdb05302bc1cd8ecc64e?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Plain Jane', artist: 'A$AP Ferg', artist_id: 'A$AP Ferg', url: 'https://p.scdn.co/mp3-preview/044999082327cc7c53905cdecff0630705109d65?cid=f067d80090d34e11b883b81236ad9316' },
        { name: '1942 Flows', artist: 'Meek Mill', artist_id: 'Meek Mill', url: 'https://p.scdn.co/mp3-preview/d63b48b11ef3afeedda4aa60d5d4cd034cb97bc0?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Everybody Mad', artist: 'O.T. Genasis', artist_id: 'O.T. Genasis', url: 'https://p.scdn.co/mp3-preview/1ab74d31b596f2391f7d05924f934a491cd4d542?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'I Got a Stick', artist: 'YBN Nahmir', artist_id: 'YBN Nahmir', url: 'https://p.scdn.co/mp3-preview/107441ee7f211f44f994b1cac032f100ef9e8c97?cid=f067d80090d34e11b883b81236ad9316' }
    ]
//
//     // -- country --
    var tracks3 = [
        { name: 'The Rest of Our Life', artist: 'Tim McGraw', artist_id: 'Tim McGraw', url: 'https://p.scdn.co/mp3-preview/e468f42357ae4b03cad36c1de64f2ae407f1d27a?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'All the Pretty Girls', artist: 'Kenny Chesney', artist_id: 'Kenny Chesney', url: 'https://p.scdn.co/mp3-preview/bc8fea30888dba8ab9eeacad1683d51fbfaf0d37?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Kiss Somebody', artist: 'Morgan Evans', artist_id: 'Morgan Evans', url: 'https://p.scdn.co/mp3-preview/d66c7765fe45acfe1288eaf1baaa6be7da8a9463?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'They Don\'t Know', artist: 'Jason Aldean', artist_id: 'Jason Aldean', url: 'https://p.scdn.co/mp3-preview/da71c28feaa15303a454afef9f73dd97d9dd76a8?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Hooked', artist: 'Dylan Scott', artist_id: 'Dylan Scott', url: 'https://p.scdn.co/mp3-preview/d2419d8b66eb08b7d566208d4bcf813fdb2b38df?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Be with Me', artist: 'Old Dominion', artist_id: 'Old Dominion', url: 'https://p.scdn.co/mp3-preview/ba4aeac16c18f2590693abe8f1d22651e7fd391b?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Dear Hate', artist: 'Maren Morris', artist_id: 'Maren Morris', url: 'https://p.scdn.co/mp3-preview/e82aab24039e83da8ee0cdd10bf4097c41339ae9?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Greatest Love Story', artist: 'LANCO', artist_id: 'LANCO', url: 'https://p.scdn.co/mp3-preview/0be63634aed195b2463a8faab7b032963321e416?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'The Long Way', artist: 'Brett Eldredge', artist_id: 'Brett Eldredge', url: 'https://p.scdn.co/mp3-preview/bb9dae141e6796c24e3e60eadc5ca863ce788f6e?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Man Enough Now', artist: 'Chris Bandi', artist_id: 'Chris Bandi', url: 'https://p.scdn.co/mp3-preview/7a19ff57c92c3ea0b73832499fc33c166d966a75?cid=f067d80090d34e11b883b81236ad9316' }
    ]
//
//
// // -- Rock Solid --
    var tracks4 = [
        { name: 'Everlong', artist: 'Foo Fighters', artist_id: 'Foo Fighters', url: 'https://p.scdn.co/mp3-preview/4a2dc307a71393a695d69b16407cd73e1e234941?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Numb', artist: 'Linkin Park', artist_id: 'Linkin Park', url: 'https://p.scdn.co/mp3-preview/e6ccf7717f8a167bfea4afc1bf7da1a0cd707fbb?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Uprising', artist: 'Muse', artist_id: 'Muse', url: 'https://p.scdn.co/mp3-preview/104ad0ea32356b9f3b2e95a8610f504c90b0026b?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Sex on Fire', artist: 'Kings of Leon', artist_id: 'Kings of Leon', url: 'https://p.scdn.co/mp3-preview/8cca3506fa42dd9cc51a761386d064b502d1a4c6?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Hail to the King', artist: 'Avenged Sevenfold', artist_id: 'Avenged Sevenfold', url: 'https://p.scdn.co/mp3-preview/7a8932458d8ea00a425b629f43c4d44af0c9a029?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Sail', artist: 'AWOLNATION', artist_id: 'AWOLNATION', url: 'https://p.scdn.co/mp3-preview/6f5f2bfd5287c6daac7d493cca5b10aaa4041859?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Song 2', artist: 'Blur', artist_id: 'Blur', url: 'https://p.scdn.co/mp3-preview/183c0855e94b58dcb267e2b0721d4a3c99260acf?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Headstrong', artist: 'Trapt', artist_id: 'Trapt', url: 'https://p.scdn.co/mp3-preview/08bf3158a4f3982b85c728831a10c20fd62f0ada?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Seven Nation Army', artist: 'The White Stripes', artist_id: 'The White Stripes', url: 'https://p.scdn.co/mp3-preview/82731065c728a8e9baf09f4e1af235265cd19054?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Under the Bridge', artist: 'Red Hot Chili Peppers', artist_id: 'Red Hot Chili Peppers', url: 'https://p.scdn.co/mp3-preview/90e41778392f27b6f7dd82db4c90916b3727aa6a?cid=f067d80090d34e11b883b81236ad9316' }
    ]
    //
    // // -- Fresh Electronic --
    var tracks5 = [
        { name: 'Jealousy', artist: 'Disciples', artist_id: 'Disciples', url: 'https://p.scdn.co/mp3-preview/54ec39c06dbf95fd446b4ea013cd0de24fb6db61?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Don\'t Stop', artist: 'Tiesto', artist_id: 'Tiesto', url: 'https://p.scdn.co/mp3-preview/d4f773a62ecf14ba158bc4274307264552a13c93?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Fever', artist: 'Nora En Pure', artist_id: 'Nora En Pure', url: 'https://p.scdn.co/mp3-preview/da6a0f8e569df008d674cd5f2bc68edd6e91514e?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Revolt', artist: 'John Christian', artist_id: 'John Christian', url: 'https://p.scdn.co/mp3-preview/61ccf3cc620b18647206f5cec1e43864f95fefb9?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Time For the Techno', artist: 'Carnage', artist_id: 'Carnage', url: 'https://p.scdn.co/mp3-preview/d7156297749bce53139e445bc4c65c8b9f6bb537?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Time', artist: 'Z.Tao', artist_id: 'Z.Tao', url: 'https://p.scdn.co/mp3-preview/c11d4ff9e1aa8c2ee4baf0c3df0e4155d7a93c4d?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Save My Soul', artist: 'Tuff London', artist_id: 'Tuff London', url: 'https://p.scdn.co/mp3-preview/c3f6bdb89269ed30749cae3b91fe0abe23f943a4?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'I Can\'t Stop', artist: 'DJ Licious', artist_id: 'DJ Licious', url: 'https://p.scdn.co/mp3-preview/9e36480e6eb0ba22a6e8fa698141940185d86165?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'The Impact', artist: 'SWACQ', artist_id: 'SWACQ', url: 'https://p.scdn.co/mp3-preview/65876eb6b4a42e4ac4898739dba208964770ed7b?cid=f067d80090d34e11b883b81236ad9316' },
        { name: 'Love Me', artist: 'Beau Collins', artist_id: 'Beau Collins', url: 'https://p.scdn.co/mp3-preview/7c31ce17179b51b8b0b520b1639787d11e8ca949?cid=f067d80090d34e11b883b81236ad9316' }
    ]
});
