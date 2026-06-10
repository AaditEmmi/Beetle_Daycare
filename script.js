document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const revealItems = document.querySelectorAll('.reveal');
  const tabSystem = document.querySelector('[data-tabs]');
  const faqItems = document.querySelectorAll('.faq-item');
  const statNumbers = document.querySelectorAll('.stat-number');
  const calculatorForms = document.querySelectorAll('.calculator-form');
  const calculatorLaunchers = document.querySelectorAll('[data-calc-open]');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (tabSystem) {
    const tabButtons = tabSystem.querySelectorAll('.tab-button');
    const tabPanels = tabSystem.querySelectorAll('.tab-panel');

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.tabTarget;

        tabButtons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle('active', isActive);
          item.setAttribute('aria-selected', String(isActive));
        });

        tabPanels.forEach((panel) => {
          panel.classList.toggle('active', panel.id === targetId);
        });
      });
    });
  }

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  calculatorForms.forEach((form) => {
    const type = form.dataset.calculator;
    const result = form.parentElement?.querySelector('[data-result="' + type + '"]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (type === 'bmi') {
        const weight = Number(form.elements.weight.value);
        const height = Number(form.elements.height.value);

        if (!weight || !height) {
          if (result) result.textContent = 'Please enter both weight and height.';
          return;
        }

        const bmi = (weight / (height * height)) * 703;
        const rounded = Math.round(bmi * 10) / 10;
        let category = 'healthy range';

        if (bmi < 18.5) category = 'underweight range';
        else if (bmi < 25) category = 'healthy range';
        else if (bmi < 30) category = 'overweight range';
        else category = 'obese range';

        if (result) {
          result.textContent = 'BMI: ' + rounded + ' (' + category + ').';
        }
        return;
      }

      if (type === 'support') {
        const days = Number(form.elements.days.value);
        const lateHours = Number(form.elements.lateHours.value);
        const weeklyCost = (days * 45) + (lateHours * 10);

        if (!days || days < 1) {
          if (result) result.textContent = 'Please enter the number of care days.';
          return;
        }

        if (result) {
          result.textContent = 'Estimated weekly cost: $' + weeklyCost.toFixed(2) + '.';
        }
      }
    });
  });

  calculatorLaunchers.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.calcOpen;
      const targetPanel = document.getElementById(targetId);
      const allPanels = document.querySelectorAll('.calculator-panels > article');

      allPanels.forEach((panel) => {
        if (panel !== targetPanel) panel.hidden = true;
      });

      if (targetPanel) {
        targetPanel.hidden = !targetPanel.hidden;
        if (!targetPanel.hidden) {
          targetPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealItems.forEach((item) => revealObserver.observe(item));

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const targetValue = Number(element.dataset.target || '0');
        const duration = 1500;
        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = String(Math.round(targetValue * eased));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(element);
      });
    }, { threshold: 0.6 });

    statNumbers.forEach((number) => counterObserver.observe(number));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    statNumbers.forEach((number) => {
      number.textContent = number.dataset.target || '0';
    });
  }

  body.addEventListener('click', (event) => {
    if (!primaryNav || !menuToggle) return;
    if (!primaryNav.classList.contains('is-open')) return;
    if (primaryNav.contains(event.target) || menuToggle.contains(event.target)) return;

    primaryNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});
