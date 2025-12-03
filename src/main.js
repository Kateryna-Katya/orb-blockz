document.addEventListener('DOMContentLoaded', () => {

  // 1. Инициализация навигации
  initNavigation();

  // 2. GSAP Анимации для Hero секции
  initHeroAnimation();

  // 3. Запуск 3D-сцены
  initThreeJsOrb();

  // 4. Логика формы контактов
  initContactForm();

  // 5. Cookie Popup
  initCookiePopup();

  // 6. Анимация появления секций (ИСПРАВЛЕННАЯ)
  initScrollAnimations();
});

/* =========================================
 1. NAVIGATION
 ========================================= */
function initNavigation() {
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');

  if (burgerBtn && navMenu) {
      burgerBtn.addEventListener('click', () => {
          const isActive = burgerBtn.classList.toggle('is-active');
          navMenu.classList.toggle('is-open');
          document.body.style.overflow = isActive ? 'hidden' : '';
      });
  }

  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (navMenu && navMenu.classList.contains('is-open')) {
              burgerBtn.classList.remove('is-active');
              navMenu.classList.remove('is-open');
              document.body.style.overflow = '';
          }
      });
  });

  window.addEventListener('scroll', () => {
      if (header) {
          if (window.scrollY > 50) {
              header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
              header.style.background = "rgba(255, 255, 255, 0.95)";
          } else {
              header.style.boxShadow = "none";
              header.style.background = "rgba(255, 255, 255, 0.9)";
          }
      }
  });
}

/* =========================================
 2. GSAP HERO ANIMATION
 ========================================= */
function initHeroAnimation() {
  if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero__badge", { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
        .from(".hero__title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero__desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero__actions", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".stat-item", { y: 20, opacity: 0, duration: 0.6, stagger: 0.2 }, "-=0.4");
  }
}

/* =========================================
 3. THREE.JS ORB VISUALS
 ========================================= */
function initThreeJsOrb() {
  const container = document.getElementById('hero-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const particlesGeometry = new THREE.IcosahedronGeometry(2, 4);
  const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03, color: 0x6366f1, transparent: true, opacity: 0.8,
  });
  const particleSphere = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSphere);

  const wireGeometry = new THREE.IcosahedronGeometry(2.2, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981, wireframe: true, transparent: true, opacity: 0.15
  });
  const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);
  scene.add(wireSphere);

  let mouseX = 0, mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
  });

  const clock = new THREE.Clock();
  const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      let targetX = mouseX * 0.001;
      let targetY = mouseY * 0.001;

      particleSphere.rotation.y += 0.003;
      particleSphere.rotation.x += 0.001;
      wireSphere.rotation.y -= 0.002;
      wireSphere.rotation.x -= 0.001;

      const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
      wireSphere.scale.set(scale, scale, scale);

      particleSphere.rotation.y += 0.05 * (targetX - particleSphere.rotation.y);
      particleSphere.rotation.x += 0.05 * (targetY - particleSphere.rotation.x);

      renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  });
}

/* =========================================
 4. CONTACT FORM & VALIDATION
 ========================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const phoneInput = document.getElementById('phone');
  const statusDiv = document.getElementById('form-status');
  const captchaLabel = document.getElementById('captcha-label');
  const captchaInput = document.getElementById('captcha');

  // 1. ВАЛИДАЦИЯ ТЕЛЕФОНА (Только цифры)
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '');
      });
  }

  // 2. Мат. капча
  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  let sum = num1 + num2;
  if (captchaLabel) captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

  // 3. Отправка
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (parseInt(captchaInput.value) !== sum) {
          statusDiv.textContent = 'Ошибка: Неверный ответ на пример.';
          statusDiv.style.color = 'red';
          return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Отправка...';
      btn.disabled = true;

      setTimeout(() => {
          form.reset();
          btn.textContent = 'Успешно!';
          btn.style.background = '#10b981';
          statusDiv.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
          statusDiv.style.color = '#10b981';

          num1 = Math.floor(Math.random() * 10);
          num2 = Math.floor(Math.random() * 10);
          sum = num1 + num2;
          captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

          setTimeout(() => {
              btn.textContent = originalText;
              btn.disabled = false;
              btn.style.background = '';
              statusDiv.textContent = '';
          }, 3000);
      }, 1500);
  });
}

/* =========================================
 5. COOKIE POPUP
 ========================================= */
function initCookiePopup() {
  const popup = document.getElementById('cookie-popup');
  const acceptBtn = document.getElementById('cookie-accept');
  if (!popup || !acceptBtn) return;

  if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          popup.classList.add('is-visible');
          popup.style.display = 'flex';
      }, 2000);
  }

  acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      popup.classList.remove('is-visible');
      setTimeout(() => { popup.style.display = 'none'; }, 500);
  });
}

/* =========================================
 6. SCROLL ANIMATIONS (FIXED & STABLE)
 ========================================= */
function initScrollAnimations() {
  // Проверка наличия GSAP
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP animation library not loaded');
      return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 1. Анимация заголовков
  gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title,
          { opacity: 0, y: 30 },
          {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                  trigger: title,
                  start: "top 85%",
              }
          }
      );
  });

  // 2. Анимация карточек (FIX: Анимируем детей внутри сетки, а не батчем)
  const grids = document.querySelectorAll('.features__grid, .blog-grid');

  grids.forEach(grid => {
      const cards = grid.children; // Получаем прямых потомков (карточки)

      if (cards.length > 0) {
          gsap.fromTo(cards,
              { opacity: 0, y: 50 }, // Начальное состояние
              {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: 0.2, // Задержка между появлением карточек
                  ease: "power2.out",
                  scrollTrigger: {
                      trigger: grid, // Триггер на весь блок сетки
                      start: "top 80%",
                  },
                  // ВАЖНО: Удаляем стили анимации после завершения, чтобы opacity не слетал
                  onComplete: () => {
                      gsap.set(cards, { clearProps: "all" });
                  }
              }
          );
      }
  });
}