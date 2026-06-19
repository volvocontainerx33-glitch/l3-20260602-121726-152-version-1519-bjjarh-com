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

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function resetTimer() {
            if (timer) {
                window.clearInterval(timer);
            }

            startTimer();
        }

        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                resetTimer();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                resetTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                resetTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var cardFilter = document.querySelector('[data-card-filter]');
    var yearFilter = document.querySelector('[data-filter-year]');
    var typeFilter = document.querySelector('[data-filter-type]');
    var cardList = document.querySelector('[data-card-list]');

    function filterCards() {
        if (!cardList) {
            return;
        }

        var keyword = cardFilter ? cardFilter.value.trim().toLowerCase() : '';
        var year = yearFilter ? yearFilter.value : '';
        var type = typeFilter ? typeFilter.value : '';
        var cards = cardList.querySelectorAll('[data-title]');

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-year')
            ].join(' ').toLowerCase();
            var passKeyword = !keyword || text.indexOf(keyword) !== -1;
            var passYear = !year || card.getAttribute('data-year') === year;
            var passType = !type || card.getAttribute('data-type') === type;

            card.classList.toggle('is-filtered-out', !(passKeyword && passYear && passType));
        });
    }

    [cardFilter, yearFilter, typeFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('input', filterCards);
            control.addEventListener('change', filterCards);
        }
    });

    document.addEventListener('error', function (event) {
        var target = event.target;

        if (target && target.tagName === 'IMG') {
            target.style.opacity = '0';
        }
    }, true);
})();
