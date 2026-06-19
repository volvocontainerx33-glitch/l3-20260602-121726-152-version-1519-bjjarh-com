import { H as Hls } from './hls-vendor.js';

function attachHls(video) {
  var source = video.getAttribute('data-hls');

  if (!source) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);

    video.addEventListener('emptied', function () {
      hls.destroy();
    }, { once: true });

    return;
  }

  video.src = source;
}

Array.prototype.slice.call(document.querySelectorAll('video[data-hls]')).forEach(attachHls);
