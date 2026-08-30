(() => {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");
  const filterBox = document.getElementById("galleryFilters");
  if (!box || !img) return;

  let allItems = [...document.querySelectorAll(".gallery-item")];
  let visibleItems = [...allItems];
  let index = 0;

  const show = i => {
    if (!visibleItems.length) return;
    index = (i + visibleItems.length) % visibleItems.length;
    const target = visibleItems[index];
    img.src = target.dataset.src;
    img.alt = target.dataset.title || "Gallery photo";

    if (caption) {
      const title = target.dataset.title || "The Bake Factory";
      caption.textContent = `Photo ${index + 1} of ${visibleItems.length} — ${title}`;
    }

    box.classList.add("open");
  };

  allItems.forEach(item => {
    item.addEventListener("click", () => {
      const activeIdx = visibleItems.indexOf(item);
      if (activeIdx !== -1) show(activeIdx);
    });
  });

  filterBox?.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    const filter = btn.dataset.filter;

    filterBox.querySelectorAll(".gallery-filter-btn").forEach(x => x.classList.toggle("active", x === btn));

    allItems.forEach(item => {
      const match = filter === "all" || item.dataset.category === filter;
      if (match) {
        item.style.display = "block";
        item.classList.add("visible");
      } else {
        item.style.display = "none";
        item.classList.remove("visible");
      }
    });

    visibleItems = allItems.filter(x => filter === "all" || x.dataset.category === filter);
  });

  document.getElementById("lightboxClose")?.addEventListener("click", () => box.classList.remove("open"));
  document.getElementById("lightboxPrev")?.addEventListener("click", () => show(index - 1));
  document.getElementById("lightboxNext")?.addEventListener("click", () => show(index + 1));
  box.addEventListener("click", e => { if (e.target === box) box.classList.remove("open"); });

  document.addEventListener("keydown", e => {
    if (!box.classList.contains("open")) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "Escape") box.classList.remove("open");
  });
})();
