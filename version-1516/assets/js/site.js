(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restart();
      });
    }

    restart();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchList = document.querySelector('[data-search-list]');
  var searchCount = document.querySelector('[data-search-count]');
  var searchClear = document.querySelector('[data-search-clear]');

  if (searchInput && searchList) {
    var cards = Array.prototype.slice.call(searchList.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    searchInput.value = initialQuery;

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function applySearch() {
      var query = normalize(searchInput.value);
      var count = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        var matched = !query || haystack.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          count += 1;
        }
      });

      if (searchCount) {
        searchCount.textContent = String(count);
      }
    }

    searchInput.addEventListener('input', applySearch);

    if (searchClear) {
      searchClear.addEventListener('click', function () {
        searchInput.value = '';
        applySearch();
        searchInput.focus();
      });
    }

    applySearch();
  }
}());
