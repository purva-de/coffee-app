/**
 * COFFEE CO. - Fuel Your Day Mobile Experience
 * Interactive Application Logic & Modern Web Features
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    cart: [],
    promoCode: null,
    discountRate: 0,
    theme: localStorage.getItem('coffeeco_theme') || 'dark',
    reducedMotion: localStorage.getItem('coffeeco_reduce_motion') === 'true',
    isFrameView: true,
    calcMethod: 'pourover',
    calcCups: 2,
    calcStrength: 'balanced',
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false,
    activeChapter: 0,
    products: {
      'midnight-velvet': {
        name: 'Midnight Velvet Dark Roast',
        price: 549,
        img: 'assets/coffee_dark_roast.jpg',
        category: 'dark',
        intensity: '9/10',
        origin: 'Antioquia, Colombia & Huehuetenango, Guatemala',
        elevation: '1,800m - 2,100m',
        notes: ['Dark Chocolate', 'Smoky Caramel', 'Black Cherry'],
        desc: 'A masterclass in dark roasting. Heavy body with deep bittersweet cocoa, molten sugar, and a lingering velvety molasses finish that cuts through milk like a dream.'
      },
      'golden-dawn': {
        name: 'Golden Dawn Medium Roast',
        price: 499,
        img: 'assets/coffee_medium_roast.jpg',
        category: 'medium',
        intensity: '6/10',
        origin: 'Yirgacheffe, Ethiopia & Tarrazu, Costa Rica',
        elevation: '1,950m',
        notes: ['Wild Honey', 'Toasted Hazelnut', 'Citrus Bloom'],
        desc: 'Bright yet grounded. Clean honeyed sweetness layered with warm roasted hazelnuts and delicate jasmine blossom aroma. The quintessential morning pour.'
      },
      'rocket-fuel': {
        name: 'Rocket Fuel Espresso Blend',
        price: 599,
        img: 'assets/coffee_espresso.jpg',
        category: 'espresso',
        intensity: '10/10',
        origin: 'Cerrado, Brazil & Sumatra Mandheling',
        elevation: '1,600m - 1,800m',
        notes: ['Golden Crema', 'Cocoa Nibs', 'Warm Nutmeg'],
        desc: 'Engineered for high-octane focus. Pours a dense, viscous tiger-striped crema with explosive dark chocolate and spicy nutmeg complexity.'
      },
      'nitro-silk': {
        name: 'Nitro Silk Cold Brew',
        price: 449,
        img: 'assets/coffee_cold_brew.jpg',
        category: 'coldbrew',
        intensity: '7/10',
        origin: 'Chiapas, Mexico Organic',
        elevation: '1,700m',
        notes: ['Bourbon Vanilla', 'Sub-Zero Smooth', 'Low Acidity'],
        desc: 'Slow cold-steeped formulation. Strips 70% of standard acidity while amplifying lush natural chocolate sweetness and smooth Madagascar vanilla finish.'
      }
    }
  };

  // --- DOM ELEMENTS ---
  const html = document.documentElement;
  const progressBar = document.getElementById('scroll-progress-bar');
  const heroVideo = document.getElementById('coffee-reel-video');

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  const cartDrawerTrigger = document.getElementById('cart-drawer-trigger');
  const stickyBarCartBtn = document.getElementById('sticky-bar-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartBadge = document.getElementById('cart-count-badge');
  const stickyCartDot = document.getElementById('sticky-cart-dot');
  const stickyCartLabel = document.getElementById('sticky-cart-label');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const cartTotalVal = document.getElementById('cart-total-val');
  const cartDiscountVal = document.getElementById('cart-discount-val');
  const discountRow = document.getElementById('discount-row');
  const shippingProgressBar = document.getElementById('shipping-progress-bar');
  const shippingPromptText = document.getElementById('shipping-prompt-text');
  const shippingPercentText = document.getElementById('shipping-percent-text');
  const checkoutBtn = document.getElementById('checkout-btn');

  const promoInput = document.getElementById('promo-code-input');
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoFeedback = document.getElementById('promo-feedback-msg');

  const quickViewModal = document.getElementById('quick-view-modal');
  const modalBodyContent = document.getElementById('modal-body-content');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutOrderSummary = document.getElementById('checkout-order-summary');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');

  const toggleFrameBtn = document.getElementById('toggle-frame-mode');
  const frameModeText = document.getElementById('frame-mode-text');
  const mobileViewport = document.getElementById('mobile-viewport');
  const reduceMotionCheckbox = document.getElementById('reduce-motion-checkbox');
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
  const mobileStickyBottomBar = document.getElementById('mobile-sticky-bottom-bar') || document.querySelector('.mobile-sticky-bottom-bar');
  const heroSection = document.getElementById('hero');

  // --- INITIALIZATION ---
  function init() {
    initTheme();
    initReducedMotion();
    initScrollProgress();
    initVideoControls();
    initRoastFilters();
    initBrewCalculator();
    initCart();
    initModals();
    initNewsletter();
    initDesktopFrameToggle();
  }

  // --- THEME SWITCHING (CSS Variables system) ---
  function initTheme() {
    html.setAttribute('data-theme', state.theme);
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', state.theme);
        localStorage.setItem('coffeeco_theme', state.theme);
        showToast(state.theme === 'dark' ? 'Dark Roast Mode Activated ☕' : 'Light Cream Mode Activated 🥛');
        announceA11y(`Theme switched to ${state.theme} mode`);
      });
    }
  }

  // --- REDUCED MOTION (Accessibility) ---
  function initReducedMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || state.reducedMotion) {
      html.classList.add('reduce-motion');
      if (reduceMotionCheckbox) reduceMotionCheckbox.checked = true;
    }

    if (reduceMotionCheckbox) {
      reduceMotionCheckbox.addEventListener('change', (e) => {
        state.reducedMotion = e.target.checked;
        localStorage.setItem('coffeeco_reduce_motion', state.reducedMotion);
        if (state.reducedMotion) {
          html.classList.add('reduce-motion');
          showToast('Animations reduced for accessibility');
        } else {
          html.classList.remove('reduce-motion');
          showToast('Full animations enabled');
        }
      });
    }
  }

  // --- SCROLL PROGRESS & BOTTOM BAR VISIBILITY ---
  function initScrollProgress() {
    function updateScrollState() {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? winScroll / height : 0;
      if (progressBar) {
        progressBar.style.transform = `scaleX(${scrolled})`;
      }

      // Show bottom bar with Menu, Calculate, Bag, Top only after scrolling past the landing page
      if (mobileStickyBottomBar) {
        const threshold = heroSection ? (heroSection.offsetHeight * 0.6) : 300;
        if (winScroll > threshold) {
          mobileStickyBottomBar.classList.add('is-visible');
        } else {
          mobileStickyBottomBar.classList.remove('is-visible');
        }
      }
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
  }

  // --- VIDEO AUTOPLAY & CONTROLS ---
  function initVideoControls() {
    if (!heroVideo) return;
    // Strict muted playback with no audio
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.play().catch(() => {
      // Autoplay fallback
    });
  }

  // --- ROAST CATALOG FILTERS ---
  function initRoastFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.roast-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterVal = btn.getAttribute('data-filter');
        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        announceA11y(`Showing ${filterVal} coffee roasts`);
      });
    });
  }

  // --- INTERACTIVE BARISTA BREW CALCULATOR ---
  function initBrewCalculator() {
    const methodCards = document.querySelectorAll('.method-card');
    const cupsRange = document.getElementById('cups-range');
    const cupsDisplay = document.getElementById('cups-display');
    const strengthSelect = document.getElementById('strength-select');
    const resCoffeeWeight = document.getElementById('res-coffee-weight');
    const resWaterWeight = document.getElementById('res-water-weight');
    const resTargetTime = document.getElementById('res-target-time');

    const ratios = {
      pourover: { light: 17, balanced: 16, bold: 14, time: '3:30', grind: 'Coarse-Medium Grind', temp: '202°F (94°C)' },
      frenchpress: { light: 16, balanced: 15, bold: 13, time: '4:00', grind: 'Coarse Chunky Grind', temp: '200°F (93°C)' },
      espresso: { light: 2.2, balanced: 2.0, bold: 1.8, time: '0:28', grind: 'Ultra Fine Espresso', temp: '198°F (92°C)' },
      coldbrew: { light: 9, balanced: 8, bold: 7, time: '18h-20h', grind: 'Extra Coarse Steep', temp: 'Sub-Zero Cold Water' }
    };

    function recalculate() {
      const method = state.calcMethod;
      const cups = parseInt(cupsRange.value, 10);
      const strength = strengthSelect.value;
      const config = ratios[method];
      const ratio = config[strength];

      // Standard cup volume ~250ml
      const waterVolumeMl = method === 'espresso' ? cups * 36 : cups * 250;
      const coffeeGrams = (waterVolumeMl / ratio).toFixed(1);

      if (cupsDisplay) {
        cupsDisplay.textContent = method === 'espresso' 
          ? `${cups} Double Shot${cups > 1 ? 's' : ''} (${waterVolumeMl} ml)`
          : `${cups} Cup${cups > 1 ? 's' : ''} (${waterVolumeMl} ml)`;
      }

      if (resCoffeeWeight) resCoffeeWeight.innerHTML = `${coffeeGrams} <abbr title="grams">g</abbr>`;
      if (resWaterWeight) resWaterWeight.innerHTML = `${waterVolumeMl} <abbr title="milliliters">ml</abbr>`;
      if (resTargetTime) resTargetTime.textContent = config.time;
    }

    methodCards.forEach(card => {
      card.addEventListener('click', () => {
        methodCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.calcMethod = card.getAttribute('data-method');
        recalculate();
      });
    });

    if (cupsRange) {
      cupsRange.addEventListener('input', recalculate);
    }

    if (strengthSelect) {
      strengthSelect.addEventListener('change', recalculate);
    }

    // Stopwatch logic
    const timerClock = document.getElementById('timer-clock');
    const timerPhase = document.getElementById('timer-phase');
    const timerStartBtn = document.getElementById('btn-timer-start');
    const timerResetBtn = document.getElementById('btn-timer-reset');

    if (timerStartBtn && timerResetBtn) {
      timerStartBtn.addEventListener('click', () => {
        if (!state.timerRunning) {
          state.timerRunning = true;
          timerStartBtn.innerHTML = `<span>Pause Timer</span>`;
          timerResetBtn.disabled = false;
          state.timerInterval = setInterval(() => {
            state.timerSeconds++;
            const mins = Math.floor(state.timerSeconds / 60);
            const secs = state.timerSeconds % 60;
            timerClock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            // Phase updates
            if (state.timerSeconds < 45) {
              timerPhase.textContent = 'Bloom Phase: Wet all grounds';
            } else if (state.timerSeconds < 180) {
              timerPhase.textContent = 'Continuous Slow Spiral Pour';
            } else {
              timerPhase.textContent = 'Drawdown & Aroma Finish ✨';
            }
          }, 1000);
        } else {
          state.timerRunning = false;
          clearInterval(state.timerInterval);
          timerStartBtn.innerHTML = `<span>Resume Timer</span>`;
        }
      });

      timerResetBtn.addEventListener('click', () => {
        state.timerRunning = false;
        clearInterval(state.timerInterval);
        state.timerSeconds = 0;
        timerClock.textContent = '00:00';
        timerPhase.textContent = 'Ready to Bloom';
        timerStartBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Start Timer</span>`;
        timerResetBtn.disabled = true;
      });
    }

    recalculate();
  }

  // --- CART MANAGEMENT & CHECKOUT ---
  function initCart() {
    // Add to cart buttons on cards
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');

        // Check grind selection from the card
        const card = btn.closest('.roast-card');
        const grindSelect = card ? card.querySelector('.grind-select') : null;
        const grind = grindSelect ? grindSelect.value : 'Whole Bean';

        addToCart({ id, name, price, img, grind });
      });
    });

    // Cart Drawer triggers
    if (cartDrawerTrigger) {
      cartDrawerTrigger.addEventListener('click', openCart);
    }
    if (stickyBarCartBtn) {
      stickyBarCartBtn.addEventListener('click', openCart);
    }
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCart);
    }


    // Promo code
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'FUEL10') {
          state.promoCode = 'FUEL10';
          state.discountRate = 0.10;
          promoFeedback.textContent = '10% OFF Discount Applied! 🎉';
          promoFeedback.className = 'promo-feedback form-feedback success';
          showToast('Promo FUEL10 Applied! 10% Off');
          renderCart();
        } else {
          promoFeedback.textContent = 'Invalid code. Try "FUEL10" for 10% off.';
          promoFeedback.className = 'promo-feedback form-feedback error';
        }
      });
    }

    // Checkout Proceed
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) return;
        closeCart();
        openCheckoutModal();
      });
    }
  }

  function addToCart(item) {
    const existingIndex = state.cart.findIndex(i => i.id === item.id && i.grind === item.grind);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += 1;
    } else {
      state.cart.push({ ...item, quantity: 1 });
    }
    renderCart();
    bumpCartBadge();
    showToast(`Added ${item.name} (${item.grind}) to bag! ☕`);
    announceA11y(`${item.name} added to cart`);
  }

  function updateQuantity(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
      showToast('Item removed from bag');
    }
    renderCart();
  }

  function renderCart() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * state.discountRate;
    const finalTotal = subtotal - discount;

    // Badges & Buttons
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.setAttribute('aria-label', `${totalItems} items in cart`);
    }
    if (stickyCartDot) {
      if (totalItems > 0) stickyCartDot.classList.add('show');
      else stickyCartDot.classList.remove('show');
    }
    if (stickyCartLabel) {
      stickyCartLabel.textContent = `Bag (₹${Math.round(finalTotal)})`;
    }

    const drawerCount = document.getElementById('drawer-item-count');
    if (drawerCount) drawerCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;

    if (checkoutBtn) {
      checkoutBtn.disabled = totalItems === 0;
    }

    // Free Shipping Meter (₹799 threshold)
    const shippingThreshold = 799;
    const percent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
    if (shippingProgressBar) shippingProgressBar.style.width = `${percent}%`;
    if (shippingPercentText) shippingPercentText.textContent = `${percent}%`;
    if (shippingPromptText) {
      if (subtotal >= shippingThreshold) {
        shippingPromptText.textContent = '🎉 You qualify for FREE Roastery Shipping!';
      } else {
        const remaining = Math.round(shippingThreshold - subtotal);
        shippingPromptText.textContent = `Add ₹${remaining} for FREE Roastery Shipping`;
      }
    }

    // Subtotal and Total
    if (cartSubtotalVal) cartSubtotalVal.textContent = `₹${Math.round(subtotal)}`;
    if (discountRow && cartDiscountVal) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        cartDiscountVal.textContent = `-₹${Math.round(discount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
    if (cartTotalVal) cartTotalVal.textContent = `₹${Math.round(finalTotal)}`;

    // Render items list
    if (cartItemsContainer) {
      if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <div class="empty-icon">☕</div>
            <p class="empty-text">Your bag is empty.</p>
            <p class="empty-subtext">Add some fresh roasted beans to fuel your daily grind!</p>
            <a href="#featured-roasts" class="btn btn-secondary btn-sm" id="btn-empty-shop">Browse Roasts</a>
          </div>
        `;
        const emptyShopBtn = document.getElementById('btn-empty-shop');
        if (emptyShopBtn) {
          emptyShopBtn.addEventListener('click', closeCart);
        }
      } else {
        cartItemsContainer.innerHTML = state.cart.map((item, idx) => `
          <div class="cart-item-row" data-index="${idx}">
            <img src="${item.img}" alt="${item.name}" class="cart-item-thumb">
            <div class="cart-item-details">
              <div>
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-grind">${item.grind}</p>
              </div>
              <div class="cart-item-bottom">
                <span class="cart-item-price">₹${Math.round(item.price * item.quantity)}</span>
                <div class="quantity-control" aria-label="Change item quantity">
                  <button type="button" class="qty-btn btn-qty-minus" data-index="${idx}" aria-label="Decrease quantity">−</button>
                  <span class="qty-num">${item.quantity}</span>
                  <button type="button" class="qty-btn btn-qty-plus" data-index="${idx}" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>
          </div>
        `).join('');

        // Wire quantity buttons
        cartItemsContainer.querySelectorAll('.btn-qty-minus').forEach(b => {
          b.addEventListener('click', () => updateQuantity(parseInt(b.getAttribute('data-index'), 10), -1));
        });
        cartItemsContainer.querySelectorAll('.btn-qty-plus').forEach(b => {
          b.addEventListener('click', () => updateQuantity(parseInt(b.getAttribute('data-index'), 10), 1));
        });
      }
    }
  }

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('is-open');
      cartOverlay.classList.add('is-open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      announceA11y('Shopping bag opened');
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('is-open');
      cartOverlay.classList.remove('is-open');
      cartDrawer.setAttribute('aria-hidden', 'true');
      announceA11y('Shopping bag closed');
    }
  }

  function bumpCartBadge() {
    if (cartBadge) {
      cartBadge.classList.add('bump');
      setTimeout(() => cartBadge.classList.remove('bump'), 300);
    }
  }

  // --- MODALS (Quick View & Checkout Success) ---
  function initModals() {
    // Quick View
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = state.products[id];
        if (!prod || !quickViewModal || !modalBodyContent) return;

        modalBodyContent.innerHTML = `
          <div class="modal-product-wrap">
            <img src="${prod.img}" alt="${prod.name}" class="modal-prod-img" style="border-radius: var(--radius-md); width:100%; aspect-ratio:1/1; object-fit:cover; margin-bottom:var(--space-2);">
            <div class="modal-badge-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-1);">
              <span class="card-badge bold-badge" style="position:static;">${prod.category.toUpperCase()} ROAST</span>
              <span style="font-size:0.8rem; color:var(--accent-gold); font-weight:700;">Intensity: ${prod.intensity}</span>
            </div>
            <h2 id="modal-product-title" style="font-family:var(--font-display); font-size:1.4rem; color:var(--text-primary); margin-bottom:var(--space-0-5);">${prod.name}</h2>
            <div style="font-size:1.2rem; font-weight:800; color:var(--accent-gold); margin-bottom:var(--space-1);">₹${prod.price}</div>
            <p style="font-size:0.85rem; line-height:1.5; color:var(--text-secondary); margin-bottom:var(--space-2);">${prod.desc}</p>
            
            <div style="background:var(--bg-surface-elevated); padding:var(--space-1); border-radius:var(--radius-sm); font-size:0.75rem; color:var(--text-secondary); margin-bottom:var(--space-2);">
              <div><strong>Single Origin:</strong> ${prod.origin}</div>
              <div><strong>Elevation:</strong> ${prod.elevation}</div>
            </div>

            <button type="button" id="modal-add-cart-btn" class="btn btn-primary btn-full-width">
              <span>Add to Bag - ₹${prod.price}</span>
            </button>
          </div>
        `;

        const modalAddBtn = document.getElementById('modal-add-cart-btn');
        if (modalAddBtn) {
          modalAddBtn.addEventListener('click', () => {
            addToCart({
              id,
              name: prod.name,
              price: prod.price,
              img: prod.img,
              grind: 'Whole Bean (Fresh)'
            });
            quickViewModal.close();
            openCart();
          });
        }

        quickViewModal.showModal();
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => quickViewModal.close());
    }

    if (quickViewModal) {
      quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) quickViewModal.close();
      });
    }

    if (closeCheckoutBtn && checkoutModal) {
      closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.close();
        state.cart = [];
        renderCart();
      });
    }
  }

  function openCheckoutModal() {
    if (!checkoutModal || !checkoutOrderSummary) return;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * state.discountRate;
    const finalTotal = subtotal - discount;

    checkoutOrderSummary.innerHTML = `
      <div style="margin-bottom:var(--space-1); font-weight:700; color:var(--text-primary);">Order #${Math.floor(100000 + Math.random() * 900000)}</div>
      <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:var(--space-1);">
        ${state.cart.map(i => `
          <div style="display:flex; justify-content:space-between;">
            <span>${i.quantity}x ${i.name} (${i.grind})</span>
            <strong>₹${Math.round(i.price * i.quantity)}</strong>
          </div>
        `).join('')}
      </div>
      <div style="border-top:1px solid var(--border-color); padding-top:6px; display:flex; justify-content:space-between; font-weight:800; color:var(--accent-gold);">
        <span>Paid Total:</span>
        <span>₹${Math.round(finalTotal)}</span>
      </div>
    `;

    checkoutModal.showModal();
    showToast('Order confirmed! Fresh roast initiated 🔥');
  }

  // --- NEWSLETTER FORM ---
  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const msg = document.getElementById('newsletter-msg');
    const emailInput = document.getElementById('newsletter-email');

    if (form && msg && emailInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          msg.textContent = '🎉 You are on the VIP roast drop list! Check your inbox for your 10% code.';
          msg.className = 'form-feedback success';
          emailInput.value = '';
          showToast('Welcome to Coffee Co. VIP club!');
        } else {
          msg.textContent = 'Please enter a valid email address.';
          msg.className = 'form-feedback error';
        }
      });
    }

    // Mobile nav drawer toggle
    if (mobileNavToggle && mobileNavDrawer) {
      mobileNavToggle.addEventListener('click', () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        mobileNavDrawer.hidden = isExpanded;
      });

      // Close menu on link click
      mobileNavDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavToggle.setAttribute('aria-expanded', 'false');
          mobileNavDrawer.hidden = true;
        });
      });
    }

    // Scroll to top button
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Cafe pickup location buttons
    document.querySelectorAll('.btn-pickup-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const locationName = btn.getAttribute('data-location');
        document.querySelectorAll('.location-item').forEach(loc => loc.classList.remove('active-location'));
        const parent = btn.closest('.location-item');
        if (parent) parent.classList.add('active-location');
        showToast(`Selected: ${locationName} for quick pickup ⚡`);
      });
    });
  }

  // --- DESKTOP FRAME VIEWPORT TOGGLE ---
  function initDesktopFrameToggle() {
    if (!toggleFrameBtn || !mobileViewport || !frameModeText) return;

    toggleFrameBtn.addEventListener('click', () => {
      state.isFrameView = !state.isFrameView;
      if (state.isFrameView) {
        mobileViewport.classList.add('is-mobile-frame');
        mobileViewport.classList.remove('is-full-view');
        frameModeText.textContent = 'Switch to Full View';
        showToast('Viewing in iPhone Mobile Frame');
      } else {
        mobileViewport.classList.remove('is-mobile-frame');
        mobileViewport.classList.add('is-full-view');
        frameModeText.textContent = 'Switch to Mobile Frame';
        showToast('Viewing in Fluid Responsive Full View');
      }
    });
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    const shelf = document.getElementById('toast-container');
    if (!shelf) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span>${message}</span>`;
    shelf.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // --- A11Y SCREEN READER ANNOUNCER ---
  function announceA11y(text) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.textContent = text;
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
