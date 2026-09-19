document.addEventListener('DOMContentLoaded', () => {

  // custom frozen-glass cursor — only on real mouse pointers, not touch
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hasFinePointer && !prefersReducedMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.documentElement.classList.add('has-custom-cursor');

    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('is-active');
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));

    const animate = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    const hoverTargets = 'a, button, .pg-piece, .work-block, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.add('is-hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.remove('is-hovering');
    });
    // "coming soon" projects: turn the cursor into a label
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.coming-soon')) { cursor.classList.add('is-soon'); cursor.textContent = 'Currently building'; }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.coming-soon')) { cursor.classList.remove('is-soon'); cursor.textContent = ''; }
    });
  }

  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      links.classList.remove('open');
    }));
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 120px 0px' });
    revealEls.forEach(el => io.observe(el));

    window.setTimeout(() => {
      revealEls.forEach(el => el.classList.add('in-view'));
    }, 2500);
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // scroll-spy: highlight the nav anchor matching the section currently in view
  const anchorLinks = document.querySelectorAll('.nav-anchor');
  if (anchorLinks.length) {
    const sections = Array.from(anchorLinks)
      .map(a => document.getElementById(a.dataset.section))
      .filter(Boolean);

    const setActive = (id) => {
      anchorLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
    };

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(s => spy.observe(s));
    }

    // smooth-scroll on click, accounting for fixed nav height
    anchorLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.getElementById(a.dataset.section);
        if (!target) return;
        e.preventDefault();
        const navHeight = document.querySelector('.site-nav')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
        setActive(a.dataset.section);
      });
    });
  }

  // proj-sidebar: appears only once the hero has fully scrolled out of view —
  // the hero never shrinks or shares space with the sidebar.
  const sidebar = document.querySelector('.proj-sidebar');
  const heroEl = document.querySelector('.proj-hero');
  const footerEl = document.querySelector('.site-footer');
  let sidebarSuspended = false;
  if (sidebar && heroEl) {
    const toggleSidebar = () => {
      if (sidebarSuspended) return;
      const heroBottom = heroEl.getBoundingClientRect().bottom;
      const isCurrentlyShown = sidebar.classList.contains('is-visible');
      // show only once the hero has fully left the viewport — it never shrinks while
      // still visible. hysteresis: hiding requires scrolling back up past a small buffer.
      let shouldShow = isCurrentlyShown ? heroBottom <= 280 : heroBottom <= 220;
      // ...but stop the sidebar just above the footer, so it never overlaps it
      if (footerEl && footerEl.getBoundingClientRect().top <= window.innerHeight) shouldShow = false;
      if (shouldShow === isCurrentlyShown) return;
      sidebar.classList.toggle('is-visible', shouldShow);
    };
    window.addEventListener('scroll', toggleSidebar, { passive: true });
    window.addEventListener('resize', toggleSidebar);
    toggleSidebar();
  }

  // proj-sidebar-nav: fixed sidebar anchors + scroll-spy, scoped to project case-study sections
  const sidebarLinks = document.querySelectorAll('.proj-sidebar-nav a:not(.back-to-top)');
  if (sidebarLinks.length) {
    const sideSections = Array.from(sidebarLinks)
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    const setSideActive = (id) => {
      sidebarLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    const updateActiveOnScroll = () => {
      const triggerLine = window.scrollY + window.innerHeight * 0.35;
      let current = sideSections[0];
      for (const s of sideSections) {
        if (s.offsetTop <= triggerLine) current = s;
      }
      if (current) setSideActive(current.id);
    };

    if (sideSections.length) {
      window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
      updateActiveOnScroll();
    }

    sidebarLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 32;
        window.scrollTo({ top, behavior: 'smooth' });
        setSideActive(id);
      });
    });
  }

  // back-to-top: scrolls to the very top of the page (the hero), independent of the section anchors
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      // suspend the scroll-driven sidebar logic during this animation —
      // otherwise the generic scroll listener re-shows the sidebar mid-flight.
      sidebarSuspended = true;
      if (sidebar) {
        sidebar.classList.add('no-transition');
        sidebar.classList.remove('is-visible');
      }
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if (sidebar) sidebar.classList.remove('no-transition');
          sidebarSuspended = false;
        }, 600);
      });
    });
  }

});
