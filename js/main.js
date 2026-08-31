
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Header shadow
  const header = $("#header");
  const syncHeader = () => header?.classList.toggle("scrolled", window.scrollY > 20);
  syncHeader();
  window.addEventListener("scroll", syncHeader, {passive:true});

  // Mobile menu: this is intentionally delegated and page-safe.
  const toggle = $("#mobileToggle");
  const nav = $("#nav");
  const setNav = open => {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    const icon = $("i", toggle);
    if (icon) icon.className = open ? "fas fa-xmark" : "fas fa-bars";
  };
  toggle?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    setNav(!nav.classList.contains("open"));
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("click", e => {
    if (nav?.classList.contains("open") && !nav.contains(e.target) && !toggle?.contains(e.target)) setNav(false);
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) setNav(false); });

  // Active page link for all pages.
  const getCleanName = p => {
    const file = (p || "").split("/").pop().split("#")[0];
    if (!file || file === "index" || file === "index.html") return "index.html";
    return file.replace(/\.html$/, "") + ".html";
  };
  const current = getCleanName(location.pathname);
  $$(".nav a").forEach(a => {
    const href = a.getAttribute("href") || "";
    const target = getCleanName(href);
    a.classList.toggle("active", target === current);
  });

  // Cart shared across pages.
  const CART_KEY = "bakeFactoryCart";
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "{}"); } catch { return {}; }
  };
  const writeCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const cartTotalItems = cart => Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  const countEl = $("#cartCount");
  const orderPanel = $("#orderPanel");
  const orderItems = $("#orderItems");
  const orderTotal = $("#orderTotal");

  function refreshCart() {
    const cart = readCart();
    if (countEl) countEl.textContent = cartTotalItems(cart);
    if (!orderItems) return;
    const entries = Object.entries(cart);
    if (!entries.length) {
      orderItems.innerHTML = `<div class="no-results" style="padding:45px 10px"><i class="fas fa-bag-shopping" style="font-size:2rem;color:var(--gold);margin-bottom:12px"></i><h3>Your cart is empty</h3><p>Add dishes from the menu.</p></div>`;
      if (orderTotal) orderTotal.textContent = "₹0";
      return;
    }
    let total = 0;
    orderItems.innerHTML = entries.map(([id, item]) => {
      total += item.price * item.qty;
      return `<div class="order-item">
        <div><h4>${escapeHtml(item.name)}</h4><small>₹${item.price} × ${item.qty}</small></div>
        <div class="qty">
          <button type="button" data-cart-minus="${id}" aria-label="Decrease">−</button>
          <strong>${item.qty}</strong>
          <button type="button" data-cart-plus="${id}" aria-label="Increase">+</button>
        </div>
      </div>`;
    }).join("");
    if (orderTotal) orderTotal.textContent = `₹${total}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function openCart() {
    if (!orderPanel) return;
    orderPanel.classList.add("open");
    orderPanel.setAttribute("aria-hidden","false");
    document.body.classList.add("menu-open");
    refreshCart();
  }
  function closeCart() {
    orderPanel?.classList.remove("open");
    orderPanel?.setAttribute("aria-hidden","true");
    document.body.classList.remove("menu-open");
  }

  $("#cartBtn")?.addEventListener("click", openCart);
  $("#mobileOrder")?.addEventListener("click", openCart);
  $("#orderClose")?.addEventListener("click", closeCart);

  orderItems?.addEventListener("click", e => {
    const minus = e.target.closest("[data-cart-minus]");
    const plus = e.target.closest("[data-cart-plus]");
    if (!minus && !plus) return;
    const id = (minus || plus).dataset.cartMinus || (minus || plus).dataset.cartPlus;
    const cart = readCart();
    if (!cart[id]) return;
    if (minus) cart[id].qty--;
    if (plus) cart[id].qty++;
    if (cart[id].qty <= 0) delete cart[id];
    writeCart(cart);
    refreshCart();
  });

  $("#whatsappOrder")?.addEventListener("click", () => {
    const cart = readCart();
    const entries = Object.values(cart);
    if (!entries.length) {
      openModal("Your cart is empty", "Please add at least one dish before placing an order.");
      return;
    }
    const lines = entries.map(x => `${x.qty} × ${x.name} — ₹${x.price * x.qty}`);
    const total = entries.reduce((s,x) => s + x.price*x.qty, 0);
    const text = `Hello The Bake Factory! I would like to place an order.%0A%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ₹${total}`;
    window.open(`https://wa.me/9107893562033?text=${text}`, "_blank", "noopener");
  });

  window.BakeCart = {
    add(item) {
      const cart = readCart();
      if (!cart[item.id]) cart[item.id] = {id:item.id,name:item.name,price:Number(item.price),qty:0};
      cart[item.id].qty++;
      writeCart(cart);
      refreshCart();
      openCart();
    },
    refresh() {
      refreshCart();
    }
  };
  refreshCart();

  // Generic modal
  const modal = $("#modal");
  function openModal(title, text) {
    if (!modal) return;
    $("#modalTitle").textContent = title;
    $("#modalText").textContent = text;
    modal.classList.add("open");
  }
  window.openBakeModal = openModal;
  $("#modalClose")?.addEventListener("click", () => modal.classList.remove("open"));
  modal?.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("open"); });

  // Review Modal Handler
  const reviewModal = $("#reviewModal");
  const openReviewModal = () => reviewModal?.classList.add("open");
  const closeReviewModal = () => reviewModal?.classList.remove("open");

  $("#openReviewModalBtn")?.addEventListener("click", openReviewModal);
  $("#openReviewModalBtn2")?.addEventListener("click", openReviewModal);
  $("#reviewModalClose")?.addEventListener("click", closeReviewModal);
  reviewModal?.addEventListener("click", e => { if (e.target === reviewModal) closeReviewModal(); });

  $("#submitReviewForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#reviewerNameInput")?.value.trim() || "Valued Guest";
    const rating = Number($("#reviewerRatingInput")?.value || 5);
    const tag = $("#reviewerTagInput")?.value.trim() || "Specialty Coffee";
    const text = $("#reviewerTextInput")?.value.trim() || "";
    
    const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "VG";
    const starsStr = "★".repeat(rating) + "☆".repeat(5 - rating);

    const grid = $(".reviews-grid");
    if (grid) {
      const card = document.createElement("article");
      card.className = "review reveal visible";
      card.innerHTML = `
        <div class="review-header">
          <div class="reviewer-avatar-placeholder">${escapeHtml(initials)}</div>
          <div class="reviewer-info">
            <h4>${escapeHtml(name)} <i class="fas fa-circle-check verified-badge" title="Verified Guest"></i></h4>
            <span class="review-date">Reviewed Just Now</span>
          </div>
        </div>
        <div class="stars">${starsStr}</div>
        <p>“${escapeHtml(text)}”</p>
        <div class="review-footer">
          <span class="review-tag"><i class="fas fa-heart"></i> ${escapeHtml(tag)}</span>
        </div>
      `;
      grid.prepend(card);
    }

    closeReviewModal();
    $("#submitReviewForm")?.reset();
    openModal("Review Submitted! ⭐", "Thank you for reviewing The Bake Factory! Your feedback helps us maintain our high standard of quality.");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      setNav(false); closeCart();
      modal?.classList.remove("open");
      reviewModal?.classList.remove("open");
    }
  });

  // Scroll reveal
  const reveal = $$(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, {threshold:.08});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add("visible"));

  // Simple card tilt on desktop
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && innerWidth >= 900) {
    $$(".food-feature,.menu-card,.review,.map-card").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = `perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => card.style.transform = "");
    });
  }
})();
