function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

ready(function () {
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  setupHero();
  setupFilters();
});

function setupHero() {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));

  if (!slides.length || !dots.length) {
    return;
  }

  var index = 0;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      show(i);
    });
  });

  setInterval(function () {
    show(index + 1);
  }, 5200);
}

function setupFilters() {
  var panel = document.querySelector(".filter-panel");

  if (!panel) {
    return;
  }

  var input = panel.querySelector(".filter-input");
  var year = panel.querySelector(".filter-year");
  var type = panel.querySelector(".filter-type");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-card"));
  var empty = document.querySelector(".empty-state");

  function matchYear(card, value) {
    if (!value) {
      return true;
    }
    var current = Number(card.getAttribute("data-year") || 0);
    if (value === "old") {
      return current < 2020;
    }
    return String(current) === value;
  }

  function apply() {
    var q = input ? input.value.trim().toLowerCase() : "";
    var y = year ? year.value : "";
    var t = type ? type.value : "";
    var shown = 0;

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-type") || "",
        card.getAttribute("data-genre") || "",
        card.getAttribute("data-year") || ""
      ].join(" ").toLowerCase();
      var typeText = (card.getAttribute("data-type") || "") + " " + (card.getAttribute("data-genre") || "");
      var ok = (!q || text.indexOf(q) !== -1) && matchYear(card, y) && (!t || typeText.indexOf(t) !== -1);
      card.style.display = ok ? "" : "none";
      if (ok) {
        shown += 1;
      }
    });

    if (empty) {
      empty.style.display = shown ? "none" : "block";
    }
  }

  [input, year, type].forEach(function (el) {
    if (el) {
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    }
  });

  apply();
}

function applySearchQuery() {
  ready(function () {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var input = document.querySelector(".filter-input");

    if (input && q) {
      input.value = q;
      input.dispatchEvent(new Event("input"));
    }
  });
}

function initPlayer(videoId, url) {
  ready(function () {
    var video = document.getElementById(videoId);

    if (!video) {
      return;
    }

    var shell = video.closest(".player-shell");
    var overlay = shell ? shell.querySelector(".play-overlay") : null;
    var loaded = false;
    var hls = null;

    function attach() {
      if (loaded) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      loaded = true;
    }

    function start() {
      attach();
      video.setAttribute("controls", "controls");
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playing = video.play();
      if (playing && typeof playing.catch === "function") {
        playing.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  });
}
