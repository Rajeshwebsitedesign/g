"use strict";

/* Google Translate -------------------------------------------------------- */
window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (!window.google?.translate?.TranslateElement) return;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,ne",
      autoDisplay: false
    },
    "google_translate_element"
  );
};

const languageButtons = [...document.querySelectorAll("[data-language]")];
const translationStatus = document.getElementById("translation-status");
let translationTimer = 0;

function currentTranslationLanguage() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
    return match?.[1] || "en";
  } catch (error) {
    return "en";
  }
}

function setTranslationStatus(message) {
  if (!translationStatus) return;
  translationStatus.textContent = message;
  translationStatus.classList.add("show");
  window.clearTimeout(translationTimer);
  translationTimer = window.setTimeout(() => {
    translationStatus.classList.remove("show");
  }, 2800);
}

function syncLanguageButtons(language) {
  languageButtons.forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function clearGoogleTranslateCookie() {
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  try {
    document.cookie = `googtrans=;expires=${expired};path=/`;
    if (location.hostname) {
      document.cookie = `googtrans=;expires=${expired};path=/;domain=${location.hostname}`;
      if (location.hostname.includes(".")) {
        document.cookie = `googtrans=;expires=${expired};path=/;domain=.${location.hostname}`;
      }
    }
  } catch (error) {
    // Cookie access may be blocked in an offline file preview.
  }
}

function applyTranslation(language, attempt = 0) {
  if (language === "en") {
    if (currentTranslationLanguage() === "en") {
      syncLanguageButtons("en");
      setTranslationStatus("The website is already in English.");
      return;
    }

    clearGoogleTranslateCookie();
    setTranslationStatus("Restoring English…");
    window.setTimeout(() => location.reload(), 250);
    return;
  }

  const select = document.querySelector("select.goog-te-combo");
  if (select instanceof HTMLSelectElement) {
    select.value = language;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    syncLanguageButtons(language);
    setTranslationStatus("Translating the website to Nepali…");
    return;
  }

  if (attempt < 25) {
    setTranslationStatus("Loading Google Translate…");
    window.setTimeout(() => applyTranslation(language, attempt + 1), 180);
    return;
  }

  document.cookie = `googtrans=/en/${language};path=/`;
  setTranslationStatus("Applying Nepali translation…");
  window.setTimeout(() => location.reload(), 250);
}

syncLanguageButtons(currentTranslationLanguage());
languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTranslation(button.dataset.language || "en");
  });
});

/* Header and mobile navigation ------------------------------------------ */
const body = document.body;
const siteChrome = document.getElementById("site-chrome");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const menuCloseTriggers = document.querySelectorAll("[data-close-menu]");
let lastFocusedElement = null;

function openMenu() {
  lastFocusedElement = document.activeElement;
  body.classList.add("menu-open");
  menuButton?.setAttribute("aria-expanded", "true");
  mobileMenu?.setAttribute("aria-hidden", "false");
  window.setTimeout(() => mobileMenu?.querySelector(".mobile-close")?.focus(), 100);
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  mobileMenu?.setAttribute("aria-hidden", "true");
  lastFocusedElement?.focus?.();
}

menuButton?.addEventListener("click", openMenu);
menuCloseTriggers.forEach((trigger) => trigger.addEventListener("click", closeMenu));

/* Scroll state, navigation highlighting, and back-to-top ---------------- */
const backToTop = document.getElementById("back-to-top");
const desktopLinks = [...document.querySelectorAll(".desktop-nav a")];
const observedSections = desktopLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateScrollUI() {
  const y = window.scrollY;
  siteChrome?.classList.toggle("scrolled", y > 10);
  backToTop?.classList.toggle("show", y > 520);

  const current = [...observedSections]
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 170);

  desktopLinks.forEach((link) => {
    link.classList.toggle("active", Boolean(current) && link.getAttribute("href") === `#${current.id}`);
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 940 && body.classList.contains("menu-open")) closeMenu();
}, { passive: true });
updateScrollUI();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Services expansion ----------------------------------------------------- */
const servicesGrid = document.getElementById("services-grid");
const servicesToggle = document.getElementById("services-toggle");

servicesToggle?.addEventListener("click", () => {
  const expanded = servicesToggle.getAttribute("aria-expanded") === "true";
  servicesToggle.setAttribute("aria-expanded", String(!expanded));
  servicesGrid?.classList.toggle("expanded", !expanded);
  servicesToggle.childNodes[0].nodeValue = expanded ? "See All Services " : "Show Fewer Services ";
});

/* Preselect appointment treatment from service links -------------------- */
const treatmentSelect = document.querySelector('select[name="treatment"]');
document.querySelectorAll(".service-card a").forEach((link) => {
  link.addEventListener("click", () => {
    const title = link.closest(".service-card")?.querySelector("h3")?.textContent?.trim();
    if (!title || !treatmentSelect) return;

    const normalized = title.replace(" (RCT)", "");
    const option = [...treatmentSelect.options].find((item) => {
      const value = item.value.replace(" (RCT)", "");
      return value === normalized || value.startsWith(normalized) || normalized.startsWith(value);
    });

    if (option) treatmentSelect.value = option.value;
  });
});

/* FAQ accordion ---------------------------------------------------------- */
document.querySelectorAll(".faq-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const wasOpen = item?.classList.contains("open") ?? false;

    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("open");
      faqItem.querySelector("button")?.setAttribute("aria-expanded", "false");
    });

    if (!wasOpen && item) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

/* Gallery lightbox ------------------------------------------------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
let lastGalleryButton = null;

function openLightbox(button) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lastGalleryButton = button;
  lightboxImage.src = button.dataset.image || "";
  lightboxImage.alt = button.querySelector("img")?.alt || "Clinic gallery image";
  lightboxCaption.textContent = button.dataset.caption || "G.P. Dental Care";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  body.classList.add("lightbox-open");
  window.setTimeout(() => lightboxClose?.focus(), 80);
}

function closeLightbox() {
  if (!lightbox?.classList.contains("open")) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  body.classList.remove("lightbox-open");
  if (lightboxImage) lightboxImage.src = "";
  lastGalleryButton?.focus?.();
}

document.querySelectorAll(".gallery-item").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

/* Appointment form ------------------------------------------------------- */
const appointmentForm = document.getElementById("appointment-form");
const formStatus = document.getElementById("form-status");
const dateInput = appointmentForm?.querySelector('input[name="date"]');

if (dateInput instanceof HTMLInputElement) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localDate;
}

function setFieldError(control, message) {
  const field = control.closest(".field");
  if (!field) return;
  field.classList.toggle("invalid", Boolean(message));
  const small = field.querySelector("small");
  if (small) small.textContent = message;
}

function validateAppointmentForm(form) {
  let valid = true;
  const requiredControls = [...form.querySelectorAll("[required]")];

  requiredControls.forEach((control) => {
    const value = control.value.trim();
    let message = value ? "" : "This field is required.";

    if (!message && control.name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 9) message = "Enter a valid phone number.";
    }

    setFieldError(control, message);
    if (message) valid = false;
  });

  const email = form.querySelector('input[name="email"]');
  if (email instanceof HTMLInputElement && email.value.trim()) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    setFieldError(email, emailValid ? "" : "Enter a valid email address.");
    if (!emailValid) valid = false;
  }

  return valid;
}

appointmentForm?.querySelectorAll("input, select, textarea").forEach((control) => {
  control.addEventListener("input", () => setFieldError(control, ""));
  control.addEventListener("change", () => setFieldError(control, ""));
});

appointmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateAppointmentForm(appointmentForm)) {
    formStatus.textContent = "Please complete the required fields.";
    appointmentForm.querySelector(".invalid input, .invalid select, .invalid textarea")?.focus();
    return;
  }

  const data = new FormData(appointmentForm);
  const lines = [
    "Hello G.P. Dental Care, I would like to request an appointment.",
    "",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email") || "Not provided"}`,
    `Preferred date: ${data.get("date")}`,
    `Preferred time: ${data.get("time")}`,
    `Treatment: ${data.get("treatment")}`,
    `Message: ${data.get("message") || "Not provided"}`
  ];

  const whatsappUrl = `https://wa.me/9779700000000?text=${encodeURIComponent(lines.join("\n"))}`;
  formStatus.textContent = "Opening WhatsApp with your appointment details…";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

/* Entrance animations ---------------------------------------------------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Global keyboard handling ---------------------------------------------- */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (body.classList.contains("menu-open")) closeMenu();
  closeLightbox();
});

/* Footer year ------------------------------------------------------------ */
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
