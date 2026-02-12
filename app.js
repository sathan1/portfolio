// ===== DOM ELEMENTS =====
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialDots = document.getElementById("testimonialDots");

// ===== TYPING EFFECT =====
class TypeWriter {
  constructor(el, words, wait = 2000) {
    this.el = el;
    this.words = words;
    this.wait = wait;
    this.txt = "";
    this.wordIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.textContent = this.txt;

    let typeSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 400;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    new TypeWriter(
      typedEl,
      [
        "Full-Stack Developer",
        "PHP & MySQL Expert",
        "Python & ML Enthusiast",
        "Freelancer & Problem Solver",
        "UI/UX Designer",
      ],
      2000,
    );
  }
});

// ===== THEME TOGGLE =====
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== NAVBAR SCROLL =====
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Add scrolled class
  navbar.classList.toggle("scrolled", scrollY > 50);

  // Back to top button
  backToTop.classList.toggle("visible", scrollY > 500);

  // Active nav link
  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document
          .querySelectorAll(".nav-links a")
          .forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    }
  });

  lastScroll = scrollY;
});

// ===== HAMBURGER MENU =====
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
  document.body.style.overflow = navLinks.classList.contains("open")
    ? "hidden"
    : "";
});

// Close mobile menu on link click
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// ===== BACK TO TOP =====
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== STAT COUNTER ANIMATION =====
const statNums = document.querySelectorAll(".stat .num[data-count]");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

statNums.forEach((el) => counterObserver.observe(el));

function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + "+";
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + "+";
    }
  }, 30);
}

// ===== PROJECT FILTERING =====
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      const categories = card.getAttribute("data-category");

      if (filter === "all" || categories.includes(filter)) {
        card.style.display = "";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.transition = "all 0.4s ease";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});

// ===== TESTIMONIAL CAROUSEL =====
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".testimonial-dots .dot");
const totalTestimonials = testimonialCards.length;

function goToTestimonial(index) {
  currentTestimonial = index;
  testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    goToTestimonial(parseInt(dot.getAttribute("data-index")));
  });
});

// Auto-advance testimonials
setInterval(() => {
  const next = (currentTestimonial + 1) % totalTestimonials;
  goToTestimonial(next);
}, 5000);

// ===== CONTACT FORM =====
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    showToast("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Please enter a valid email address", "error");
    return;
  }

  // If using formspree or web3forms, submit normally
  const action = this.getAttribute("action");
  if (action && !action.includes("YOUR_FORM_ID")) {
    this.submit();
    return;
  }

  // Fallback: mailto
  const mailtoLink = `mailto:sathancreator@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  window.open(mailtoLink);
  showToast("Opening your email client...", "success");
  this.reset();
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${msg}</span>
  `;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%) translateY(100px)",
    background: type === "success" ? "#10b981" : "#ef4444",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.95rem",
    fontWeight: "500",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    zIndex: "9999",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'Inter', sans-serif",
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(100px)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener("mousemove", (e) => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  if (rect.bottom < 0) return; // Skip if hero is out of view

  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const avatar = document.querySelector(".hero-avatar");
  if (avatar) {
    avatar.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 20}px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
  }
});

// ===== SKILL PILLS HOVER EFFECT =====
document.querySelectorAll(".skill-pill").forEach((pill) => {
  pill.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.08)";
  });
  pill.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
});

console.log(
  "%c Portfolio loaded successfully! 🚀",
  "color: #6c5ce7; font-size: 16px; font-weight: bold;",
);
