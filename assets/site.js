(() => {
  'use strict';

  document.documentElement.classList.add('js');

  function initialise() {
    const menuToggle = document.getElementById('menu-toggle');
    const navigation = document.getElementById('primary-nav');

    if (menuToggle && navigation) {
      const setMenuOpen = (open) => {
        menuToggle.setAttribute('aria-expanded', String(open));
        navigation.classList.toggle('is-open', open);
      };

      menuToggle.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
      });
      navigation.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a')) {
          setMenuOpen(false);
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
          setMenuOpen(false);
          menuToggle.focus();
        }
      });
      document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
          setMenuOpen(false);
        }
      });
    }

    const talks = Array.from(document.querySelectorAll('article.talk')).map((element) => {
      const start = Date.parse(element.dataset.start || '');
      const end = Date.parse(element.dataset.end || '');
      return {
        element,
        id: element.id,
        title: (element.dataset.title || '').trim(),
        speaker: (element.dataset.speaker || '').trim(),
        location: (element.dataset.location || '').trim(),
        start,
        end,
        dated: Number.isFinite(start) && Number.isFinite(end) && end > start,
      };
    });
    const datedTalks = talks.filter((talk) => talk.dated).sort((a, b) => a.start - b.start);
    const search = document.getElementById('talk-search');
    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    const resetFilters = document.getElementById('reset-filters');
    const programmeTools = document.getElementById('programme-tools');
    const programmeContent = document.getElementById('programme-content');
    const programmePending = document.getElementById('programme-pending');
    const programmeTitle = document.getElementById('programme-title');
    const programmeName = programmeTitle ? programmeTitle.textContent.trim() : '';
    const validFilters = new Set(['all', 'upcoming', 'past']);
    let activeFilter = 'all';

    const normalise = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    talks.forEach((talk) => {
      talk.searchText = normalise([talk.title, talk.speaker, talk.location].join(' '));
    });

    function applyFilters(now = Date.now()) {
      const words = normalise(search ? search.value.trim() : '').split(/\s+/).filter(Boolean);
      let visibleCount = 0;

      talks.forEach((talk) => {
        const matchesText = words.every((word) => talk.searchText.includes(word));
        const matchesStatus = activeFilter === 'all'
          || (talk.dated && (activeFilter === 'past' ? talk.end <= now : talk.end > now));
        const visible = matchesText && matchesStatus;
        talk.element.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      filterButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter));
      });
      if (resultsCount) {
        resultsCount.textContent = `Showing ${visibleCount} of ${talks.length} ${talks.length === 1 ? 'talk' : 'talks'}.`;
      }
      if (noResults) noResults.hidden = visibleCount > 0 || talks.length === 0;
    }

    if (search) search.addEventListener('input', () => applyFilters());
    filterButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        if (validFilters.has(button.dataset.filter)) {
          activeFilter = button.dataset.filter;
          applyFilters();
        }
      });
    });
    if (resetFilters) {
      resetFilters.addEventListener('click', (event) => {
        event.preventDefault();
        if (search) search.value = '';
        activeFilter = 'all';
        applyFilters();
        if (search) search.focus();
      });
    }
    if (programmeTools) programmeTools.hidden = talks.length === 0;
    if (programmeContent) programmeContent.hidden = talks.length === 0;
    if (programmePending) programmePending.hidden = talks.length > 0;

    const nextLabel = document.getElementById('next-label');
    const nextTitle = document.getElementById('next-title');
    const nextDescription = document.getElementById('next-description');
    const nextLink = document.getElementById('next-link');
    const announcementLink = nextLink ? {
      href: nextLink.getAttribute('href'),
      target: nextLink.getAttribute('target'),
      text: nextLink.textContent,
    } : null;
    if (nextLink) {
      nextLink.addEventListener('click', () => {
        if ((nextLink.getAttribute('href') || '').startsWith('#')) {
          if (search) search.value = '';
          activeFilter = 'all';
          applyFilters();
        }
      });
    }
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    function refreshProgramme() {
      const now = Date.now();
      const nextTalk = datedTalks.find((talk) => talk.end > now);

      datedTalks.forEach((talk) => {
        const past = talk.end <= now;
        const inProgress = talk.start <= now && !past;
        talk.element.classList.toggle('is-past', past);
        talk.element.classList.toggle('is-next', talk === nextTalk);
        const status = talk.element.querySelector('[data-talk-status]');
        if (status) status.textContent = past ? 'Past talk' : inProgress ? 'In progress' : 'Upcoming';
      });

      if (datedTalks.length > 0 && nextLabel && nextTitle && nextDescription) {
        if (nextTalk) {
          nextLabel.textContent = nextTalk.start <= now ? 'Happening now' : 'Next seminar';
          nextTitle.textContent = nextTalk.title;
          nextDescription.textContent = [
            nextTalk.speaker,
            dateFormatter.format(new Date(nextTalk.start)),
            nextTalk.location,
          ].filter(Boolean).join(' · ');
          if (nextLink && nextTalk.id) {
            nextLink.setAttribute('href', `#${encodeURIComponent(nextTalk.id)}`);
            nextLink.removeAttribute('target');
            nextLink.textContent = 'View talk →';
          }
        } else {
          nextLabel.textContent = 'Looking ahead';
          nextTitle.textContent = 'Next seminar to be announced.';
          nextDescription.textContent = 'No further talks are currently announced. Join the mailing list for new dates and seminar announcements.';
          if (nextLink && announcementLink) {
            if (announcementLink.href === null) nextLink.removeAttribute('href');
            else nextLink.setAttribute('href', announcementLink.href);
            if (announcementLink.target === null) nextLink.removeAttribute('target');
            else nextLink.setAttribute('target', announcementLink.target);
            nextLink.textContent = announcementLink.text;
          }
        }
      }

      document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = String(new Date(now).getFullYear());
      });
      applyFilters(now);
    }

    function downloadCalendar() {
      const downloadLink = document.getElementById('calendar-download');
      if (!downloadLink || datedTalks.length === 0) return;

      const escapeText = (value) => String(value)
        .replace(/\\/g, '\\\\')
        .replace(/\r\n|\r|\n/g, '\\n')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,');
      const utcDate = (timestamp) => new Date(timestamp).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      const stamp = utcDate(Date.now());
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Kuantum//Seminar Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${escapeText(programmeName ? `KUANTUM Seminar · ${programmeName}` : 'KUANTUM Seminar')}`,
      ];

      datedTalks.forEach((talk) => {
        const identity = encodeURIComponent(talk.id || [talk.title, talk.speaker].join('-'));
        lines.push(
          'BEGIN:VEVENT',
          `UID:${identity}-${utcDate(talk.start)}@kuantum-seminar.local`,
          `DTSTAMP:${stamp}`,
          `DTSTART:${utcDate(talk.start)}`,
          `DTEND:${utcDate(talk.end)}`,
          `SUMMARY:${escapeText(talk.title)}`,
          `DESCRIPTION:${escapeText(talk.speaker ? `Speaker: ${talk.speaker}` : 'KUANTUM Seminar')}`,
          `LOCATION:${escapeText(talk.location)}`,
          'END:VEVENT',
        );
      });
      lines.push('END:VCALENDAR');

      // RFC 5545 limits each physical line to 75 UTF-8 octets, including
      // the leading space on continuation lines. Never split a code point.
      const encoder = new TextEncoder();
      const foldLine = (line) => {
        const folded = [];
        let current = '';
        let bytes = 0;
        for (const character of line) {
          const size = encoder.encode(character).length;
          if (bytes + size > 75) {
            folded.push(current);
            current = ' ';
            bytes = 1;
          }
          current += character;
          bytes += size;
        }
        folded.push(current);
        return folded.join('\r\n');
      };
      const calendar = `${lines.map(foldLine).join('\r\n')}\r\n`;
      const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
      downloadLink.href = url;
      const calendarName = normalise(programmeName).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'seminar';
      downloadLink.download = `kuantum-${calendarName}.ics`;
      downloadLink.hidden = false;
      window.addEventListener('pagehide', (event) => {
        if (!event.persisted) URL.revokeObjectURL(url);
      });
    }

    refreshProgramme();
    downloadCalendar();
    window.setInterval(() => {
      if (!document.hidden) refreshProgramme();
    }, 60000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshProgramme();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
