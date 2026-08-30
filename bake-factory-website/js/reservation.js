(() => {
  const form = document.getElementById("reservationForm");
  if (!form) return;

  const date = document.getElementById("resDate");
  const today = new Date().toISOString().split("T")[0];
  if (date) { date.min = today; date.value = today; }

  let activeSeating = "Main Dining Hall";
  let activeOccasion = "Casual Dining";

  const seatingGrid = document.getElementById("seatingGrid");
  seatingGrid?.addEventListener("click", e => {
    const card = e.target.closest("[data-seating]");
    if (!card) return;
    seatingGrid.querySelectorAll(".seating-card").forEach(x => x.classList.toggle("active", x === card));
    activeSeating = card.querySelector("h4")?.textContent || "Main Dining Hall";
  });

  const occasionBox = document.getElementById("occasionPills");
  occasionBox?.addEventListener("click", e => {
    const btn = e.target.closest("[data-occasion]");
    if (!btn) return;
    occasionBox.querySelectorAll(".occasion-pill").forEach(x => x.classList.toggle("active", x === btn));
    activeOccasion = btn.textContent.trim();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("resName").value.trim();
    const phone = document.getElementById("resPhone").value.trim();
    const bookingDate = date.value;
    const time = document.getElementById("resTime").value;
    const guests = document.getElementById("resGuests").value;
    const note = document.getElementById("resNote").value.trim() || "None";

    if (!name || !phone || !bookingDate || !time || !guests) {
      window.openBakeModal?.("Incomplete Reservation Form", "Please fill in all required fields to reserve your table.");
      return;
    }

    const message =
      `Hello The Bake Factory! 🥖☕\nI would like to reserve a table:\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📅 Date: ${bookingDate}\n` +
      `⏰ Time Slot: ${time}\n` +
      `👥 Guests: ${guests}\n` +
      `🪑 Seating Choice: ${activeSeating}\n` +
      `✨ Occasion: ${activeOccasion}\n` +
      `📝 Special Request: ${note}`;

    window.open(`https://wa.me/9107893562033?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
})();
