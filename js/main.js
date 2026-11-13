/* ============================================
   Sabarnik Lahiri — Portfolio & Tech Journal
   Main JavaScript Engine
   Dual Theme, Mobile UX, Social Share & Interactive Comments
   ============================================ */

(function () {
  'use strict';

  // --- Theme Toggle Engine (Dark / Light) ---
  const THEME_KEY = 'sabarnik_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update aria labels
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // Initial apply
  applyTheme(getPreferredTheme());

  // Listen to system theme change if not manually set
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Attach toggle listeners
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0 && navAnchors.length > 0) {
    function highlightNav() {
      const scrollY = window.scrollY + 120;

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navAnchors.forEach(function (a) {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + sectionId) {
              a.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  // --- Contact Form Submission with Feedback ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      setTimeout(function () {
        btn.innerHTML = '✓ Message Sent Successfully!';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';

        showToast('Message sent! Sabarnik will get back to you soon.');

        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 900);
    });
  }

  // --- Toast Notification Helper ---
  function showToast(message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
  window.showToast = showToast;

  // --- Social Share Handler ---
  function setupSocialSharing() {
    const shareBtns = document.querySelectorAll('.share-btn');
    if (!shareBtns.length) return;

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareBtns.forEach(btn => {
      const type = btn.getAttribute('data-share');
      if (type === 'twitter') {
        btn.href = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
      } else if (type === 'linkedin') {
        btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
      } else if (type === 'whatsapp') {
        btn.href = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
      } else if (type === 'copy') {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(window.location.href).then(() => {
              btn.classList.add('copied');
              btn.innerHTML = `<span>✓</span> Copied!`;
              showToast('Link copied to clipboard!');
              setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Link`;
              }, 2500);
            });
          } else {
            // Fallback
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            showToast('Link copied to clipboard!');
          }
        });
      }
    });
  }
  setupSocialSharing();

  // --- Interactive Comments System ---
  function setupComments() {
    const commentsContainer = document.querySelector('.comments-section');
    if (!commentsContainer) return;

    const postId = commentsContainer.getAttribute('data-post-id') || window.location.pathname;
    const storageKey = `comments_${postId}`;
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    const commentCountEl = document.getElementById('commentCount');

    // Default seed comments to invite conversation if none exist
    const defaultComments = {
      'starbucks-ai': [
        {
          id: 'c1',
          name: 'Arjun Mehta',
          date: '2 days ago',
          badge: 'Software Architect',
          body: 'This hit the nail on the head. We rolled out a vision-based QA tool in our warehouse last year and ran into the exact same problem — the system failed on crumpled barcode labels that any human operator could read instantly.',
          likes: 7
        },
        {
          id: 'c2',
          name: 'Sarah Lin',
          date: '1 day ago',
          badge: 'Product Manager',
          body: 'The distinction between "AI that supports workers" and "AI that tries to replace judgment too early" is so well articulated. Starbucks was right to pull back rather than sink cost fallacy their way forward.',
          likes: 4
        }
      ],
      'ai-and-me': [
        {
          id: 'c1',
          name: 'Vikram Sengupta',
          date: '3 days ago',
          badge: 'Senior Backend Engineer',
          body: '"AI can generate implementation. It cannot inherit ownership." — Quote of the week. This is exactly what separates great junior engineers from copy-paste developers. Fundamentals always win.',
          likes: 12
        },
        {
          id: 'c2',
          name: 'Priya Sharma',
          date: '1 day ago',
          badge: 'Full Stack Dev',
          body: 'Love this perspective Sabarnik. The shift from "how do I find an answer" to "how do I evaluate whether this answer deserves trust" perfectly captures current software engineering.',
          likes: 5
        }
      ]
    };

    function loadComments() {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      return defaultComments[postId] || [];
    }

    function saveComments(comments) {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    }

    function renderComments() {
      const comments = loadComments();
      if (commentCountEl) {
        commentCountEl.textContent = `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`;
      }

      if (!commentsList) return;

      if (comments.length === 0) {
        commentsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.95rem;">No comments yet. Be the first to share your thoughts!</p>`;
        return;
      }

      commentsList.innerHTML = comments.map((c, idx) => {
        const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return `
          <div class="comment-item" data-comment-id="${c.id || idx}">
            <div class="comment-item-header">
              <div class="comment-author-info">
                <div class="comment-avatar">${initials}</div>
                <div>
                  <div class="comment-author-name">
                    ${escapeHtml(c.name)}
                    ${c.badge ? `<span class="comment-author-badge">${escapeHtml(c.badge)}</span>` : ''}
                  </div>
                  <div class="comment-time">${c.date || 'Recently'}</div>
                </div>
              </div>
            </div>
            <div class="comment-item-body">
              ${escapeHtml(c.body)}
            </div>
            <div class="comment-item-actions">
              <button type="button" class="comment-like-btn" onclick="likeComment('${postId}', '${c.id || idx}')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>${c.likes || 0}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (commentForm) {
      commentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('commentName');
        const roleInput = document.getElementById('commentRole');
        const textInput = document.getElementById('commentText');

        const name = nameInput ? nameInput.value.trim() : '';
        const role = roleInput ? roleInput.value.trim() : '';
        const body = textInput ? textInput.value.trim() : '';

        if (!name || !body) {
          alert('Please enter your name and comment.');
          return;
        }

        const comments = loadComments();
        const newComment = {
          id: 'c_' + Date.now(),
          name: name,
          badge: role || '',
          date: 'Just now',
          body: body,
          likes: 0
        };

        comments.unshift(newComment);
        saveComments(comments);
        renderComments();

        commentForm.reset();
        showToast('Comment posted! Thanks for joining the discussion.');
      });
    }

    window.likeComment = function (post, commentId) {
      const comments = loadComments();
      const target = comments.find((c, idx) => (c.id === commentId || String(idx) === String(commentId)));
      if (target) {
        target.likes = (target.likes || 0) + 1;
        saveComments(comments);
        renderComments();
      }
    };

    function escapeHtml(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    renderComments();
  }
  setupComments();

})();
