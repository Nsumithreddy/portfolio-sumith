/*
  This is the final, correct script.
  It includes:
  1. "Hire Me" smooth scroll.
  2. "View CV" modal.
  3. ScrollReveal animations.
  4. [NEW] AJAX Form Submission to clear the form after sending.
*/

document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const hireMeBtn = document.getElementById("hire-me-btn");
  const contactSection = document.getElementById("contact");

  const viewCvBtn = document.getElementById("view-cv-btn");
  const cvModal = document.getElementById("cv-modal");
  const closeCvBtn = document.getElementById("close-cv-btn");
  const cvFrame = document.getElementById("cv-frame");

  const cvSrc = "NAGAM_SUMITH_REDDY_.pdf#toolbar=0&navpanes=0&scrollbar=0";

  // --- Modal helpers (Untouched) ---
  const openModal = () => {
    if (!cvModal) return window.open(cvSrc.replace(/#.*/, ""), "_blank", "noopener");
    cvModal.classList.add("active");
    document.body.classList.add("modal-open");
    if (cvFrame && (!cvFrame.src || cvFrame.src === window.location.href)) {
      cvFrame.src = cvSrc;
    }
  };

  const closeModal = () => {
    if (!cvModal) return;
    cvModal.classList.remove("active");
    document.body.classList.remove("modal-open");
  };

  // --- View CV button (Untouched) ---
  if (viewCvBtn) {
    viewCvBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }
  if (closeCvBtn) closeCvBtn.addEventListener("click", closeModal);
  if (cvModal) {
    cvModal.addEventListener("click", (e) => {
      if (e.target === cvModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cvModal.classList.contains("active")) closeModal();
    });
  }

  // --- "Hire Me" smooth scroll (Untouched) ---
  if (hireMeBtn && contactSection) {
    hireMeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof contactSection.scrollIntoView === "function") {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        location.hash = "#contact";
      }
    });
  }

  // --- Active nav link on scroll (Untouched) ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (sections.length && navLinks.length) {
    const updateActive = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 110) current = section.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
      });
    };
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  // --- ScrollReveal (Untouched) ---
  if (window.ScrollReveal) {
    const sr = ScrollReveal({
      distance: "40px",
      duration: 800,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      interval: 80,
      viewOffset: { top: 110, right: 0, bottom: 0, left: 0 },
      cleanup: true,
      reset: false,
      mobile: true,
    });
    // (all sr.reveal() calls are the same as before)
    sr.reveal(".hero-left", { origin: "bottom" });
    sr.reveal(".hero-right", { origin: "right", delay: 100 });
    sr.reveal(".about-illustration", { origin: "left" });
    sr.reveal(".about-content", { origin: "bottom", delay: 80 });
    sr.reveal(".skills-section h2", { origin: "bottom" });
    sr.reveal(".skills-subhead", { origin: "bottom" });
    sr.reveal(".skill-card", { origin: "bottom", interval: 80, viewFactor: 0.2 });
    sr.reveal(".projects-section .section-title", { origin: "bottom" });
    sr.reveal(".project-card", { origin: "bottom", interval: 100, viewFactor: 0.2 });
    sr.reveal(".contact-section .section-title", { origin: "bottom" });
    sr.reveal(".contact-form", { origin: "bottom", delay: 100 });
    sr.reveal(".footer-container", { origin: "bottom" });
  } else {
    document.documentElement.classList.add("no-sr");
  }

  // --- [NEW] AJAX Contact Form Submission ---
  // This is the code that clears the form.
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", (e) => {
      // Stop the form from submitting the old way
      e.preventDefault();

      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Get the form data
      const formData = new FormData(contactForm);
      const formAction = contactForm.action;

      // Send the data to Formspree in the background
      fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // --- SUCCESS! ---
          submitBtn.textContent = "Message Sent! ✔";
          contactForm.reset(); // <-- THIS IS THE FIX YOU WANTED
          
          // Reset button text after 3 seconds
          setTimeout(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
          }, 3000);

        } else {
          // --- ERROR ---
          submitBtn.textContent = "Error! Please try again.";
          submitBtn.disabled = false;
        }
      })
      .catch(error => {
        // --- NETWORK ERROR ---
        console.error("Form submission error:", error);
        submitBtn.textContent = "Error! Check connection.";
        submitBtn.disabled = false;
      });
    });
  }
});