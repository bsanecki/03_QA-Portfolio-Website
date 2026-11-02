(() => {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('is-open', !expanded);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        navLinks.classList.remove('is-open');
      });
    });
  }

  const sections = document.querySelectorAll('main section[id]');
  const pageLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && pageLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        pageLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  }
  // Copy the email address when the email contact card is activated.
  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const email = button.getAttribute('data-copy-email');
      const label = button.querySelector('[data-copy-label]');
      const hint = button.querySelector('.copy-hint');
      if (!email || !label || !hint) return;

      const originalLabel = email;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const temporaryInput = document.createElement('textarea');
          temporaryInput.value = email;
          temporaryInput.setAttribute('readonly', '');
          temporaryInput.style.position = 'absolute';
          temporaryInput.style.left = '-9999px';
          document.body.appendChild(temporaryInput);
          temporaryInput.select();
          const copied = document.execCommand('copy');
          temporaryInput.remove();
          if (!copied) throw new Error('Clipboard copy was not available');
        }

        label.textContent = 'Email copied!';
        hint.textContent = 'Copied';
        button.classList.add('is-copied');
        button.setAttribute('aria-label', `Email address ${email} copied to clipboard`);
      } catch (error) {
        label.textContent = originalLabel;
        hint.textContent = 'Copy failed';
        button.setAttribute('aria-label', `Could not copy ${email}. Select the address to copy it manually`);
      }

      window.setTimeout(() => {
        label.textContent = originalLabel;
        hint.textContent = 'Copy';
        button.classList.remove('is-copied');
        button.setAttribute('aria-label', `Copy email address ${email} to clipboard`);
      }, 2200);
    });
  });

})();
