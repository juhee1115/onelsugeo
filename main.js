/**
 * 오늘수거 랜딩페이지 메인 스크립트
 * - data.json에서 콘텐츠를 불러와 DOM에 렌더링
 * - IntersectionObserver로 스크롤 애니메이션 처리
 */

(async function () {
  // ──────────────────────────────────────────
  // 1. 데이터 로드
  // ──────────────────────────────────────────
  let data;
  try {
    const res = await fetch('data.json');
    data = await res.json();
  } catch (err) {
    console.error('data.json 로드 실패:', err);
    return;
  }

  // ──────────────────────────────────────────
  // 2. 유틸리티
  // ──────────────────────────────────────────

  /** 안전하게 텍스트 콘텐츠 설정 */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /** 안전하게 HTML 삽입 */
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // ──────────────────────────────────────────
  // 3. 사이트 기본 콘텐츠 바인딩
  // ──────────────────────────────────────────

  const { site, problems, wasteTypes, howItWorks, services, footer } = data;

  // 네비게이션
  setText('nav-service-link', site.serviceArea);
  setText('nav-app-btn', site.appDownload);

  // 히어로
  setText('hero-title-brand', site.name);
  setText('hero-subtitle', site.subtagline);
  document.title = `${site.name} | 문 앞 분리수거 서비스`;

  // CTA 스트립
  setText('cta-strip-title', site.subtagline);
  setText('cta-strip-btn', site.ctaText + ' →');

  // 서비스 CTA
  setText('services-cta-btn', site.ctaText + ' →');
  setText('hero-cta', site.ctaText + ' →');

  // ──────────────────────────────────────────
  // 4. 고민 카드 렌더링
  // ──────────────────────────────────────────

  const problemEmojis = ['📅', '🗑️', '🔄'];
  const problemsGrid = document.getElementById('problems-grid');
  if (problemsGrid) {
    problemsGrid.innerHTML = problems.items.map((item, i) => `
      <div class="problem-card fade-in" role="listitem" style="transition-delay:${i * 0.1}s">
        <span class="problem-card__icon" aria-hidden="true">${problemEmojis[i] || item.emoji}</span>
        <p class="problem-card__label">${item.label}</p>
      </div>
    `).join('');
  }

  // ──────────────────────────────────────────
  // 5. 분리배출 품목 렌더링
  // ──────────────────────────────────────────

  const wasteGrid = document.getElementById('waste-grid');
  if (wasteGrid) {
    wasteGrid.innerHTML = wasteTypes.items.map((item, i) => `
      <div class="waste-card fade-in" role="listitem" style="transition-delay:${i * 0.08}s">
        <span class="waste-card__icon" aria-hidden="true">${item.emoji}</span>
        <p class="waste-card__label">${item.label}</p>
      </div>
    `).join('');
  }

  // ──────────────────────────────────────────
  // 6. 이용 방법 렌더링
  // ──────────────────────────────────────────

  const stepIcons = ['🗑️', '📱', '🚪'];
  const howSteps = document.getElementById('how-steps');
  if (howSteps) {
    howSteps.innerHTML = howItWorks.steps.map((step, i) => `
      <div class="how__step fade-in" role="listitem" style="transition-delay:${i * 0.15}s">
        <div class="how__step-num" aria-hidden="true">${step.step}</div>
        <span class="how__step-icon" aria-hidden="true">${stepIcons[i]}</span>
        <p class="how__step-desc">${step.description}</p>
        ${i < howItWorks.steps.length - 1 ? '<span class="how__connector" aria-hidden="true">→</span>' : ''}
      </div>
    `).join('');
  }

  // ──────────────────────────────────────────
  // 7. 서비스 카드 렌더링
  // ──────────────────────────────────────────

  const serviceImgClass = ['home', 'office', 'building'];
  const servicesGrid = document.getElementById('services-grid');
  if (servicesGrid) {
    servicesGrid.innerHTML = services.items.map((item, i) => `
      <article class="service-card fade-in" role="listitem" style="transition-delay:${i * 0.1}s" tabindex="0">
        <div class="service-card__img service-card__img--${serviceImgClass[i]}" aria-hidden="true">
          <span style="font-size:4rem">${item.icon}</span>
        </div>
        <div class="service-card__body">
          <span class="service-card__type">${item.type} <span style="font-weight:400;color:var(--text-muted);font-size:0.85rem">→</span></span>
          <span class="service-card__arrow" aria-hidden="true">→</span>
        </div>
      </article>
    `).join('');
  }

  // ──────────────────────────────────────────
  // 8. 푸터 정보 렌더링
  // ──────────────────────────────────────────

  setText('footer-cta-text', footer.cta.replace('\\n', '\n'));
  setText('footer-app-btn', site.appDownload + ' →');

  const footerInfo = document.getElementById('footer-info');
  if (footerInfo) {
    const info = footer.info;
    footerInfo.innerHTML = `
      <p>${info.registration}</p>
      <p>${info.businessNumber}</p>
      <p>${info.address}</p>
      <p>${info.contact}</p>
      <p>${info.email}</p>
      <p style="margin-top:16px;opacity:0.3">© ${new Date().getFullYear()} ${footer.company}. All rights reserved.</p>
    `;
  }

  // ──────────────────────────────────────────
  // 9. 스크롤 애니메이션 (IntersectionObserver)
  // ──────────────────────────────────────────

  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach((el) => observer.observe(el));

  // ──────────────────────────────────────────
  // 10. 부드러운 스크롤 앵커 처리
  // ──────────────────────────────────────────

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ──────────────────────────────────────────
  // 11. 네비게이션 스크롤 하이라이트
  // ──────────────────────────────────────────

  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').slice(1);
            link.style.color = href === entry.target.id ? 'var(--primary)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  console.log(`✅ 오늘수거 랜딩페이지 초기화 완료 (${new Date().toLocaleTimeString('ko-KR')})`);
})();