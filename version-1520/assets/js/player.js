(function () {
    var video = document.getElementById('movie-player');
    var button = document.querySelector('[data-video-play]');

    if (!video) {
        return;
    }

    var stream = video.getAttribute('data-stream');
    var ready = false;

    function setup() {
        if (ready || !stream) {
            return;
        }

        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(stream);
            hls.attachMedia(video);
        } else {
            video.src = stream;
        }
    }

    function playVideo() {
        setup();

        if (button) {
            button.classList.add('is-hidden');
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    }

    if (button) {
        button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (button && !video.ended) {
            button.classList.remove('is-hidden');
        }
    });
})();
