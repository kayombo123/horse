(function () {
  'use strict';

  var PAGE_SIZE = 6;
  var grid = document.getElementById('portfolio-grid');
  var loadMoreWrap = document.getElementById('load-more-wrap');
  var loadMoreBtn = document.getElementById('load-more-btn');
  var offset = 0;
  var totalFetched = 0;
  var hasMore = true;

  var PLACEHOLDER_IMAGE = 'https://placehold.co/800x500/0D0D0D/0A84E8?text=Project';

  function renderCard(project) {
    var card = document.createElement('article');
    card.className = 'portfolio-card';
    var imgUrl = project.image_url || PLACEHOLDER_IMAGE;
    var link = project.case_study_url || '#';
    var tag = (project.tag || 'project').toLowerCase();
    card.innerHTML =
      '<img class="portfolio-card-image" src="' + escapeAttr(imgUrl) + '" alt="' + escapeAttr(project.title || 'Project') + '" loading="lazy" width="800" height="500">' +
      '<div class="portfolio-card-body">' +
      '<span class="portfolio-card-tag">' + escapeHtml(tag) + '</span>' +
      '<h3>' + escapeHtml(project.title || 'Project') + '</h3>' +
      '<p>' + escapeHtml(project.description || '') + '</p>' +
      '<a href="' + escapeAttr(link) + '" target="_blank" rel="noopener">View Case Study</a>' +
      '</div>';
    return card;
  }

  function escapeAttr(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fetchProjects(append) {
    if (!append) {
      offset = 0;
      totalFetched = 0;
      if (grid) grid.innerHTML = '';
    }
    if (!loadMoreBtn) return;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading…';

    var url = '/api/projects?limit=' + PAGE_SIZE + '&offset=' + offset;
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data.projects || data.data || []);
        list.forEach(function (p) {
          if (grid) grid.appendChild(renderCard(p));
        });
        totalFetched += list.length;
        hasMore = list.length === PAGE_SIZE;
        offset += PAGE_SIZE;
        if (loadMoreWrap) loadMoreWrap.hidden = !hasMore || list.length === 0;
      })
      .catch(function () {
        if (grid && totalFetched === 0) {
          grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--color-muted);">Unable to load portfolio. Check the API and Supabase setup.</p>';
        }
        if (loadMoreWrap) loadMoreWrap.hidden = true;
      })
      .finally(function () {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More';
      });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      fetchProjects(true);
    });
  }

  fetchProjects(false);
})();
