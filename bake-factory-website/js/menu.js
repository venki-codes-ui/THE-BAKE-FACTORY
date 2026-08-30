(() => {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const search = document.getElementById("menuSearch");
  const searchClear = document.getElementById("searchClear");
  const sortSelect = document.getElementById("menuSort");
  const count = document.getElementById("menuCount");
  const categoryBox = document.getElementById("categories");
  const dietaryBox = document.getElementById("dietaryPills");
  const floatingBar = document.getElementById("floatingCartBar");
  const floatingCount = document.getElementById("floatingCount");
  const floatingTotal = document.getElementById("floatingTotal");
  const floatingCheckout = document.getElementById("floatingCartCheckout");

  // Dish Modal Elements
  const dishModal = document.getElementById("dishModal");
  const dishModalClose = document.getElementById("dishModalClose");
  const dishModalImg = document.getElementById("dishModalImg");
  const dishModalTitle = document.getElementById("dishModalTitle");
  const dishModalDesc = document.getElementById("dishModalDesc");
  const dishModalPrice = document.getElementById("dishModalPrice");
  const dishModalDiet = document.getElementById("dishModalDiet");
  const dishModalNumber = document.getElementById("dishModalNumber");
  const dishModalTags = document.getElementById("dishModalTags");
  const dishModalAddBtn = document.getElementById("dishModalAddBtn");
  let activeModalItem = null;

  let menuData = [];
  let activeCategory = "all";
  let activeDietary = "all";

  const isSubpage = location.pathname.includes("/pages/");
  const dataPath = isSubpage ? "../data/menu.json" : "data/menu.json";
  const imgPrefix = isSubpage ? "../" : "";

  const categoryIcons = {
    all: "fa-border-all",
    breakfast: "fa-egg",
    fries: "fa-chart-pie",
    salads: "fa-leaf",
    pizzas: "fa-pizza-slice",
    sandwiches: "fa-burger",
    burgers: "fa-bread-slice",
    coffee: "fa-mug-hot",
    specials: "fa-star"
  };

  const labels = {
    veg: ["Pure Veg", "tag-veg", `<span class="food-icon-veg" title="Pure Veg"></span>`],
    nonveg: ["Non-Veg", "tag-nonveg", `<span class="food-icon-nonveg" title="Non-Veg"></span>`],
    popular: ["Bestseller", "tag-popular", `<i class="fas fa-crown"></i>`],
    spicy: ["Spicy", "tag-spicy", `<i class="fas fa-pepper-hot"></i>`]
  };

  function readCart() {
    try { return JSON.parse(localStorage.getItem("bakeFactoryCart") || "{}"); } catch { return {}; }
  }

  function syncFloatingCart() {
    const cart = readCart();
    const entries = Object.values(cart);
    const totalItems = entries.reduce((s, x) => s + x.qty, 0);
    const totalPrice = entries.reduce((s, x) => s + (x.price * x.qty), 0);

    if (floatingBar) {
      if (totalItems > 0) {
        floatingBar.classList.add("active");
        if (floatingCount) floatingCount.textContent = totalItems;
        if (floatingTotal) floatingTotal.textContent = `Total: ₹${totalPrice}`;
      } else {
        floatingBar.classList.remove("active");
      }
    }
  }

  function sortItems(items) {
    const sortVal = sortSelect?.value || "recommended";
    const sorted = [...items];
    if (sortVal === "price-low") sorted.sort((a, b) => a.price - b.price);
    else if (sortVal === "price-high") sorted.sort((a, b) => b.price - a.price);
    else if (sortVal === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }

  function render() {
    const q = (search?.value || "").trim().toLowerCase();
    const cart = readCart();

    let items = menuData.filter(item => {
      const categoryMatch = activeCategory === "all" || item.category === activeCategory;
      const text = `${item.name} ${item.desc} ${item.tags.join(" ")}`.toLowerCase();
      const textMatch = !q || text.includes(q);

      let dietMatch = true;
      if (activeDietary === "veg") dietMatch = item.tags.includes("veg");
      else if (activeDietary === "nonveg") dietMatch = item.tags.includes("nonveg");
      else if (activeDietary === "popular") dietMatch = item.tags.includes("popular");
      else if (activeDietary === "spicy") dietMatch = item.tags.includes("spicy");

      return categoryMatch && textMatch && dietMatch;
    });

    items = sortItems(items);

    if (count) count.textContent = `Showing ${items.length} of ${menuData.length} items`;

    if (!items.length) {
      grid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-magnifying-glass" style="font-size:2.5rem;color:var(--gold);margin-bottom:14px"></i>
          <h3 style="font-size:1.4rem;margin-bottom:6px">No culinary matches found</h3>
          <p style="color:var(--muted)">Try clearing your search query or selecting another category.</p>
        </div>`;
      return;
    }

    grid.innerHTML = items.map(item => {
      const isVeg = item.tags.includes("veg");
      const isPopular = item.tags.includes("popular");
      const dietBadgeHtml = isVeg ? `<span class="food-icon-veg card-diet-badge" title="Pure Veg"></span>` : `<span class="food-icon-nonveg card-diet-badge" title="Non-Veg"></span>`;
      const bestsellerHtml = isPopular ? `<span class="card-bestseller-badge"><i class="fas fa-star"></i> Bestseller</span>` : "";
      const extraTags = item.tags.filter(t => t !== "veg" && t !== "nonveg");
      const tagsHtml = extraTags.map(tag => labels[tag] ? `<span class="tag ${labels[tag][1]}">${labels[tag][2]} ${labels[tag][0]}</span>` : "").join("");
      const imgSrc = imgPrefix + item.image;
      const cartItem = cart[item.id];
      const currentQty = cartItem ? cartItem.qty : 0;

      let actionBtnHtml = `
        <button class="add-btn" type="button" data-id="${item.id}">
          <i class="fas fa-plus"></i> Add
        </button>`;

      if (currentQty > 0) {
        actionBtnHtml = `
          <div class="card-qty-control">
            <button type="button" data-card-minus="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${currentQty}</span>
            <button type="button" data-card-plus="${item.id}" aria-label="Increase quantity">+</button>
          </div>`;
      }

      return `<article class="menu-card reveal visible" data-item-id="${item.id}">
        <div class="menu-card-image" data-preview-id="${item.id}">
          ${dietBadgeHtml}
          ${bestsellerHtml}
          <img src="${imgSrc}" alt="${escapeHtml(item.name)}" loading="lazy">
          <div class="quick-view-overlay"><i class="fas fa-expand"></i> Quick View</div>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header">
            <h3 data-preview-id="${item.id}">${escapeHtml(item.name)}</h3>
            <span class="menu-number">#${String(item.id).padStart(2, "0")}</span>
          </div>
          <p class="menu-desc">${escapeHtml(item.desc)}</p>
          ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
          <div class="menu-bottom">
            <div class="menu-price">₹${item.price}</div>
            <div class="add-btn-wrapper">${actionBtnHtml}</div>
          </div>
        </div>
      </article>`;
    }).join("");

    syncFloatingCart();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function buildCategories() {
    if (!categoryBox) return;
    const cats = ["all", ...new Set(menuData.map(x => x.category))];

    categoryBox.innerHTML = cats.map(cat => {
      const catCount = cat === "all" ? menuData.length : menuData.filter(x => x.category === cat).length;
      const iconClass = categoryIcons[cat] || "fa-utensils";
      const displayName = cat === "all" ? "All Items" : cat.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase());

      return `<button class="category-btn ${cat === activeCategory ? "active" : ""}" type="button" data-category="${cat}">
        <i class="fas ${iconClass}"></i> ${displayName} <span class="cat-count">${catCount}</span>
      </button>`;
    }).join("");
  }

  function openDishModal(item) {
    if (!dishModal || !item) return;
    activeModalItem = item;
    if (dishModalImg) dishModalImg.src = imgPrefix + item.image;
    if (dishModalTitle) dishModalTitle.textContent = item.name;
    if (dishModalDesc) dishModalDesc.textContent = item.desc;
    if (dishModalPrice) dishModalPrice.textContent = `₹${item.price}`;
    if (dishModalNumber) dishModalNumber.textContent = `#${String(item.id).padStart(2, "0")}`;

    if (dishModalDiet) {
      const isVeg = item.tags.includes("veg");
      dishModalDiet.innerHTML = isVeg ? `<span class="food-icon-veg" style="margin-right:6px"></span> <strong style="color:#2b8a3e;font-size:0.85rem">Pure Veg</strong>` : `<span class="food-icon-nonveg" style="margin-right:6px"></span> <strong style="color:#c92a2a;font-size:0.85rem">Non-Veg</strong>`;
    }

    if (dishModalTags) {
      const extraModalTags = item.tags.filter(t => t !== "veg" && t !== "nonveg");
      dishModalTags.innerHTML = extraModalTags.map(tag => labels[tag] ? `<span class="tag ${labels[tag][1]}">${labels[tag][2]} ${labels[tag][0]}</span>` : "").join("");
    }

    dishModal.classList.add("open");
  }

  dishModalClose?.addEventListener("click", () => dishModal?.classList.remove("open"));
  dishModal?.addEventListener("click", e => { if (e.target === dishModal) dishModal.classList.remove("open"); });

  dishModalAddBtn?.addEventListener("click", () => {
    if (activeModalItem && window.BakeCart) {
      window.BakeCart.add(activeModalItem);
      dishModal?.classList.remove("open");
      render();
    }
  });

  categoryBox?.addEventListener("click", e => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    activeCategory = btn.dataset.category;
    categoryBox.querySelectorAll(".category-btn").forEach(x => x.classList.toggle("active", x === btn));
    render();
  });

  dietaryBox?.addEventListener("click", e => {
    const btn = e.target.closest("[data-diet]");
    if (!btn) return;
    activeDietary = btn.dataset.diet;
    dietaryBox.querySelectorAll(".diet-pill").forEach(x => x.classList.toggle("active", x === btn));
    render();
  });

  search?.addEventListener("input", () => {
    if (searchClear) searchClear.style.display = search.value ? "block" : "none";
    render();
  });

  searchClear?.addEventListener("click", () => {
    if (search) { search.value = ""; searchClear.style.display = "none"; }
    render();
  });

  sortSelect?.addEventListener("change", render);

  grid.addEventListener("click", e => {
    const addBtn = e.target.closest(".add-btn");
    const previewTarget = e.target.closest("[data-preview-id]");
    const minusBtn = e.target.closest("[data-card-minus]");
    const plusBtn = e.target.closest("[data-card-plus]");

    if (previewTarget && !addBtn && !minusBtn && !plusBtn) {
      const item = menuData.find(x => String(x.id) === previewTarget.dataset.previewId);
      if (item) openDishModal(item);
      return;
    }

    if (addBtn) {
      const item = menuData.find(x => String(x.id) === addBtn.dataset.id);
      if (item && window.BakeCart) {
        window.BakeCart.add(item);
        render();
      }
      return;
    }

    if (minusBtn || plusBtn) {
      const id = (minusBtn || plusBtn).dataset.cardMinus || (minusBtn || plusBtn).dataset.cardPlus;
      const item = menuData.find(x => String(x.id) === id);
      if (!item) return;
      const cart = readCart();
      if (!cart[id]) return;
      if (minusBtn) cart[id].qty--;
      if (plusBtn) cart[id].qty++;
      localStorage.setItem("bakeFactoryCart", JSON.stringify(cart));
      if (window.BakeCart && window.BakeCart.refresh) window.BakeCart.refresh();
      render();
    }
  });

  floatingCheckout?.addEventListener("click", () => {
    const orderBtn = document.getElementById("cartBtn");
    if (orderBtn) orderBtn.click();
  });

  fetch(dataPath)
    .then(r => {
      if (!r.ok) throw new Error("Could not load menu.json");
      return r.json();
    })
    .then(data => {
      menuData = data;
      buildCategories();
      render();
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = `<div class="no-results"><h3>Menu could not be loaded</h3><p>Ensure web server is running.</p></div>`;
    });
})();
