(() => {
  const faqContainer = document.getElementById("faqContainer");
  faqContainer?.addEventListener("click", e => {
    const qBtn = e.target.closest(".faq-question");
    if (!qBtn) return;
    const item = qBtn.closest(".faq-item");
    if (!item) return;

    const isActive = item.classList.contains("active");
    faqContainer.querySelectorAll(".faq-item").forEach(x => x.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });

  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim() || "Not provided";
    const subject = document.getElementById("contactSubject").value;
    const msg = document.getElementById("contactMessage").value.trim();

    if (!name || !phone || !subject || !msg) {
      window.openBakeModal?.("Incomplete Form", "Please fill in your name, phone number, subject, and message.");
      return;
    }

    const message =
      `Hello The Bake Factory!\nI have an inquiry from your Contact Page:\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📧 Email: ${email}\n` +
      `🏷️ Subject: ${subject}\n` +
      `💬 Message: ${msg}`;

    window.open(`https://wa.me/9107893562033?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
})();
