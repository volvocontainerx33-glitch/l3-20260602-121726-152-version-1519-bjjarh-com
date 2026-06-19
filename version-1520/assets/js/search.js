(function () {
    var input = document.querySelector('[data-site-search]');
    var button = document.querySelector('[data-site-search-button]');
    var results = document.querySelector('[data-site-search-results]');
    var data = window.siteMovieSearch || [];

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function card(movie) {
        return [
            '<article class="movie-card compact-card">',
            '<a class="poster-wrap" href="' + escapeHtml(movie.url) + '">',
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="poster-glow"></span>',
            '</a>',
            '<div class="card-body">',
            '<div class="card-tags"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
            '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.summary) + '</p>',
            '<div class="card-meta"><span>' + escapeHtml(movie.genre) + '</span><strong>' + escapeHtml(movie.rating) + '</strong></div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function runSearch() {
        if (!input || !results) {
            return;
        }

        var query = input.value.trim().toLowerCase();
        var matched = query
            ? data.filter(function (movie) {
                return movie.text.indexOf(query) !== -1;
            }).slice(0, 80)
            : data.slice(0, 24);

        results.innerHTML = '<div class="movie-grid compact-grid">' + matched.map(card).join('') + '</div>';
    }

    if (input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';

        if (q) {
            input.value = q;
        }

        input.addEventListener('input', runSearch);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                runSearch();
            }
        });
    }

    if (button) {
        button.addEventListener('click', runSearch);
    }

    if (input && input.value) {
        runSearch();
    }
})();
