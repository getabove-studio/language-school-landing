/* =========================================
   1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ
   ========================================= */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;
const isDesktop = window.matchMedia('(min-width: 769px)').matches;

// Элементы модалки
const modal = document.getElementById('booking-modal');
const modalTitle = document.getElementById('modal-title');
const modalHeader = document.getElementById('modal-header');
const modalForm = document.getElementById('modal-form');
const modalSuccess = document.getElementById('modal-success');
let lastFocusedElement = null;

/* =========================================
   2. МОДАЛКА (ОТКРЫТИЕ / ЗАКРЫТИЕ)
   ========================================= */
function openModal(planName = '') {
    lastFocusedElement = document.activeElement;
    
    const isTeacher = planName.toLowerCase().includes('преподават');
    
    // 1. Настраиваем заголовок (без слова "Запись:")
    if (modalTitle) {
        if (isTeacher) {
            modalTitle.textContent = 'Стать преподавателем';
        } else if (planName) {
            modalTitle.textContent = planName; // Просто название курса/тарифа
        } else {
            modalTitle.textContent = 'Бесплатный урок';
        }
    }

    // 2. Меняем иконку и подзаголовок
    const modalIcon = document.getElementById('modal-icon');
    const modalDesc = document.querySelector('#modal-header p');
    
    if (isTeacher) {
        if (modalIcon) modalIcon.className = 'fa-solid fa-chalkboard-user';
        if (modalDesc) modalDesc.textContent = 'Оставьте контакты, и мы свяжемся с вами для обсуждения условий.';
    } else {
        if (modalIcon) modalIcon.className = 'fa-solid fa-graduation-cap';
        if (modalDesc) modalDesc.textContent = 'Оставьте контакты, и мы свяжемся с вами в течение 15 минут.';
    }
    
    // 3. Скрываем уровень для преподавателя
    const levelWrapper = document.getElementById('modal-level-wrapper');
    if (levelWrapper) {
        if (isTeacher) {
            levelWrapper.classList.add('hidden');
        } else {
            levelWrapper.classList.remove('hidden');
        }
    }
    
    if (modalHeader) modalHeader.classList.remove('hidden');
    
    if (modalForm) {
        modalForm.reset();
        modalForm.classList.remove('hidden');
    }
    if (modalSuccess) modalSuccess.classList.add('hidden');
    
    if (modal) modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    
    setTimeout(() => document.getElementById('modal-name')?.focus(), 50);
}

function closeModal() {
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement) lastFocusedElement.focus();
}

// Привязываем закрытие к крестику
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('#booking-modal button[aria-label="Закрыть"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
});

// Закрытие по клику на фон
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Закрытие по Escape и фокус-трап
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
    }

    if (e.key === 'Tab' && modal && !modal.classList.contains('hidden')) {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

/* =========================================
   3. ШАПКА (ПОЯВЛЕНИЕ CTA ПРИ СКРОЛЛЕ)
   ========================================= */
const headerCta = document.getElementById('header-cta');
if (headerCta) {
    let ctaTicking = false;
    const updateHeaderCta = () => {
        const show = window.scrollY > 500;
        headerCta.classList.toggle('opacity-0', !show);
        headerCta.classList.toggle('translate-y-2', !show);
        headerCta.classList.toggle('pointer-events-none', !show);
        headerCta.setAttribute('aria-hidden', String(!show));
        headerCta.setAttribute('tabindex', show ? '0' : '-1');
        ctaTicking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ctaTicking) {
            requestAnimationFrame(updateHeaderCta);
            ctaTicking = true;
        }
    }, { passive: true });
    updateHeaderCta();
}

/* =========================================
   4. АНИМАЦИИ (ПОЯВЛЕНИЕ СЕКЦИЙ И ПАРАЛЛАКС)
   ========================================= */
const sections = document.querySelectorAll('.section-fade');
if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { root: null, threshold: 0.1 });
    sections.forEach(sec => sectionObserver.observe(sec));
}

if (!prefersReducedMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                document.querySelectorAll('.parallax-bg').forEach(el => {
                    const speed = parseFloat(el.dataset.speed) || 0;
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                });
                document.querySelectorAll('.parallax-element').forEach(el => {
                    const speed = parseFloat(el.dataset.speed) || 0;
                    el.style.transform = `translateY(${scrolled * speed * 0.4}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* =========================================
   5. 3D TILT HERO-КАРТОЧКИ
   ========================================= */
const heroCardContainer = document.getElementById('hero-card-container');
if (heroCardContainer && canHover && isDesktop && !prefersReducedMotion) {
    let rafId;
    document.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const xAxis = (window.innerWidth / 2 - e.clientX) / 45;
            const yAxis = (window.innerHeight / 2 - e.clientY) / 45;
            heroCardContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }, { passive: true });

    heroCardContainer.addEventListener('mouseleave', () => {
        cancelAnimationFrame(rafId);
        heroCardContainer.style.transform = '';
    });
}

/* =========================================
   6. FAQ АККОРДЕОН
   ========================================= */
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        const isOpen = !answer.classList.contains('hidden');

        document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

        if (!isOpen) {
            answer.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        }
    });
});

/* =========================================
   7. ОТПРАВКА ФОРМЫ В МОДАЛКЕ (С ПРОВЕРКОЙ)
   ========================================= */
function handleFormSubmit(e) {
    e.preventDefault(); // Останавливаем стандартную отправку формы
    
    const nameInput = document.getElementById('modal-name');
    const phoneInput = document.getElementById('modal-phone');
    const agreeInput = document.getElementById('modal-agree');
    
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const agreeError = document.getElementById('agree-error');

    if (!nameInput || !phoneInput) return;

    // Сбрасываем старые ошибки
    [nameInput, phoneInput].forEach(i => i.classList.remove('border-red-400', 'ring-red-100', 'ring-4'));
    if (nameError) nameError.classList.add('hidden');
    if (phoneError) phoneError.classList.add('hidden');
    if (agreeError) agreeError.classList.add('hidden');

    let valid = true;

    // 1. Проверка Имени
    if (!nameInput.value.trim()) {
        nameInput.classList.add('border-red-400', 'ring-red-100', 'ring-4');
        if (nameError) nameError.classList.remove('hidden');
        valid = false;
    }

    // 2. Проверка Телефона (только цифры, длина от 10 до 11)
    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
        phoneInput.classList.add('border-red-400', 'ring-red-100', 'ring-4');
        if (phoneError) phoneError.classList.remove('hidden');
        valid = false;
    }
    
    // 3. Проверка Чекбокса
    if (agreeInput && !agreeInput.checked) {
        if (agreeError) agreeError.classList.remove('hidden');
        valid = false;
    }

    // Если есть хоть одна ошибка — ПРЕРЫВАЕМ отправку
    if (!valid) return; 

    // Если всё ок — показываем успех
    if (modalHeader) modalHeader.classList.add('hidden');
    if (modalForm) modalForm.classList.add('hidden');
    if (modalSuccess) modalSuccess.classList.remove('hidden');

    setTimeout(closeModal, 3000);
}

/* =========================================
   8. БЫСТРАЯ ЗАЯВКА ИЗ ФУТЕРА
   ========================================= */
function submitFooterPhone() {
    const phoneInput = document.getElementById('footer-phone');
    if (!phoneInput) return;
    
    const phoneValue = phoneInput.value.trim();
    const digits = phoneValue.replace(/\D/g, '');

    if (digits.length < 10 || digits.length > 11) {
        phoneInput.classList.add('border-red-500');
        phoneInput.focus();
        phoneInput.classList.add('animate-shake');
        
        setTimeout(() => {
            phoneInput.classList.remove('border-red-500');
            phoneInput.classList.remove('animate-shake');
        }, 2000);
        return;
    }
    
    phoneInput.classList.remove('border-red-500');
    phoneInput.value = '';

    lastFocusedElement = document.activeElement;
    
    if (modalHeader) modalHeader.classList.add('hidden');
    if (modalForm) modalForm.classList.add('hidden');
    if (modalSuccess) modalSuccess.classList.remove('hidden');

    if (modal) modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    
    setTimeout(closeModal, 3000);
}

/* =========================================
   9. МОБИЛЬНОЕ МЕНЮ
   ========================================= */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    if (!mobileMenu || !menuIcon) return;
    const isOpen = mobileMenu.classList.contains('translate-x-0');
    
    if (isOpen) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
        document.body.classList.remove('menu-open');
    } else {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
        document.body.classList.add('menu-open');
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu && mobileMenu.classList.contains('translate-x-0')) {
            toggleMenu();
        }
    });
});

/* =========================================
   10. БЕСШОВНЫЙ СЛАЙДЕР ОТЗЫВОВ
   ========================================= */
const reviewsSlider = document.getElementById('reviews-slider');
if (reviewsSlider) {
    const totalSlides = 7;
    let currentSlide = 0;
    let isTransitioning = false;

    const goToSlide = (index) => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = index;
        const offset = -(100 / totalSlides) * currentSlide;
        reviewsSlider.style.transform = `translateX(${offset}%)`;
    };

    setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);

    reviewsSlider.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentSlide === totalSlides - 1) {
            reviewsSlider.style.transition = 'none';
            reviewsSlider.style.transform = 'translateX(0)';
            currentSlide = 0;
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    reviewsSlider.style.transition = 'transform 0.8s ease-in-out';
                });
            });
        }
    });
}

/* =========================================
   11. АВТОМАТИЧЕСКАЯ ОЧИСТКА ПОЛЕЙ (JS)
   ========================================= */
// Очищаем имя от цифр
document.getElementById('modal-name')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
});

// Очищаем телефон от букв
document.getElementById('modal-phone')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9+]/g, '');
});

// Очищаем телефон в футере от букв
document.getElementById('footer-phone')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9+]/g, '');
});

// Проверка формы
document.getElementById('modal-form')?.addEventListener('submit', handleFormSubmit);