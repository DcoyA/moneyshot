/* ============================================
   main.js — 헬로미디어 랜딩페이지 인터랙션
   ============================================ */

(function () {
  'use strict';

  /* ─── 1. 헤더 스크롤 효과 ─── */
  const header = document.querySelector('.site-header');
  function handleHeaderScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ─── 2. 햄버거 메뉴 ─── */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // 메뉴 링크 클릭 시 닫기
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── 3. FAQ 아코디언 ─── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // 다른 아이템 닫기
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-q');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // 현재 아이템 토글
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ─── 4. 샘플 필터 ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sampleCards = document.querySelectorAll('.sample-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      // 버튼 active 상태
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // 카드 필터
      sampleCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard .3s ease';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── 5. 플로팅 CTA 표시/숨김 ─── */
  const floatingCta = document.getElementById('floatingCta');

  function handleFloatingCta() {
    if (!floatingCta) return;
    const scrolled = window.scrollY > 400;
    floatingCta.classList.toggle('visible', scrolled);
  }

  window.addEventListener('scroll', handleFloatingCta, { passive: true });
  handleFloatingCta(); // 초기 실행

  /* ─── 6. 부드러운 앵커 스크롤 (구형 브라우저 대비) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* ─── 7. 스크롤 인 애니메이션 (IntersectionObserver) ─── */
  const observeTargets = document.querySelectorAll(
    '.pain-card, .diff-card, .process-step, .target-item, .sample-card, .package-card'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    observeTargets.forEach(function (el) {
      el.classList.add('pre-animate');
      observer.observe(el);
    });
  }

  /* ─── 8. 카드 페이드인 CSS 주입 ─── */
  const style = document.createElement('style');
  style.textContent = `
    .pre-animate {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity .5s ease, transform .5s ease;
    }
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    @keyframes fadeInCard {
      from { opacity: 0; transform: scale(.97); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  /* ─── 9. 헤더 active nav 표시 ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - (header ? header.offsetHeight + 30 : 100);
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('nav-active');
      const href = link.getAttribute('href');
      if (href && href === '#' + current) {
        link.classList.add('nav-active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
