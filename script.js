/* ==========================================================================
   CONFIG & PLAYLIST SETTINGS
   ========================================================================== */
// CONFIGURATION: Replace these values easily
const CONFIG = {
  friendName: "Anshu",          // Set to Anshu
  yourName: "YOUR COMFORT ZONE",  // Set to YOUR COMFORT ZONE
  
  // Custom YouTube playlist link option
  youtubePlaylistUrl: "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID" 
};

/* ==========================================================================
   INITIALIZATION & DOM LOADED
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Inject configuration names across elements
  document.querySelectorAll(".friend-name").forEach(el => el.textContent = CONFIG.friendName);
  document.querySelectorAll(".your-name").forEach(el => el.textContent = CONFIG.yourName);

  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Start Canvas Particle Engine
  initParticleCanvas();

  // Setup Sequential Intro Loading Screen
  runIntroSequence();

  // Setup Custom Cursor
  initCustomCursor();

  // Setup Music Player Controls
  initMusicPlayer();

  // Setup Gallery Filtering
  initGalleryFilters();

  // Setup Intersection Observer for Cinematic Text
  initCinematicObserver();
});

/* ==========================================================================
   1. INTRO LOADING SCREEN ANIMATION
   ========================================================================== */
function runIntroSequence() {
  const msg1 = document.querySelector(".intro-msg.step-1");
  const msg2 = document.querySelector(".intro-msg.step-2");
  const msg3 = document.querySelector(".intro-msg.step-3");
  const surpriseBtn = id("open-surprise-btn");

  setTimeout(() => msg1.classList.add("visible"), 500);
  
  setTimeout(() => {
    msg1.classList.remove("visible");
    msg2.classList.add("visible");
  }, 3000);

  setTimeout(() => {
    msg2.classList.remove("visible");
    msg3.classList.add("visible");
    surpriseBtn.classList.add("visible");
  }, 6000);

  surpriseBtn.addEventListener("click", () => {
    id("loading-screen").classList.add("hidden");
    // Attempt auto play music after user interaction
    toggleAudio(true);
  });
}

/* ==========================================================================
   CANVAS BACKGROUND PARTICLES (HEARTS & STARS)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = id("particle-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 0.8 + 0.2,
    opacity: Math.random() * 0.5 + 0.2,
    type: Math.random() > 0.5 ? "heart" : "star"
  }));

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `rgba(232, 165, 184, ${opacity})`;
    ctx.translate(x, y);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      if (p.y < -20) p.y = height + 20;

      if (p.type === "heart") {
        drawHeart(p.x, p.y, p.size, p.opacity);
      } else {
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size / 2, p.size / 2);
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   CUSTOM CURSOR LOGIC
   ========================================================================== */
function initCustomCursor() {
  const cursor = id("cursor");
  const follower = id("cursor-follower");

  document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    follower.style.left = e.clientX + "px";
    follower.style.top = e.clientY + "px";
  });
}

/* ==========================================================================
   8. AUDIO / MUSIC PLAYER
   ========================================================================== */
let isPlaying = false;

function initMusicPlayer() {
  const audio = id("bg-music");
  const btn = id("play-pause-btn");
  const playerContainer = id("floating-player");
  const status = id("song-status");

  btn.addEventListener("click", () => {
    toggleAudio(!isPlaying);
  });
}

function toggleAudio(playState) {
  const audio = id("bg-music");
  const btnIcon = id("play-pause-btn").querySelector("i");
  const playerContainer = id("floating-player");
  const status = id("song-status");

  if (playState) {
    audio.play().then(() => {
      isPlaying = true;
      btnIcon.className = "fa-solid fa-pause";
      playerContainer.classList.add("playing");
      status.textContent = "Now Playing ❤️";
    }).catch(err => {
      console.log("Autoplay blocked by browser. User must click play.", err);
    });
  } else {
    audio.pause();
    isPlaying = false;
    btnIcon.className = "fa-solid fa-play";
    playerContainer.classList.remove("playing");
    status.textContent = "Paused";
  }
}

/* ==========================================================================
   6. GALLERY FILTER & LIGHTBOX
   ========================================================================== */
function initGalleryFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      items.forEach(item => {
        if (filter === "all" || item.classList.contains(filter)) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

function openLightbox(imgSrc, captionText) {
  const lightbox = id("lightbox");
  id("lightbox-img").src = imgSrc;
  id("lightbox-caption").textContent = captionText;
  lightbox.classList.add("active");
}

function closeLightbox() {
  id("lightbox").classList.remove("active");
}

/* ==========================================================================
   9. INTERACTIVE BUBBLES
   ========================================================================== */
function popBubble(element) {
  element.style.transform = "scale(1.4)";
  element.style.opacity = "0";
  
  // Trigger mini confetti burst
  confetti({
    particleCount: 15,
    spread: 60,
    origin: { y: 0.7 }
  });

  setTimeout(() => {
    element.style.visibility = "hidden";
  }, 300);
}

/* ==========================================================================
   10. INTERACTIVE GIFT BOX
   ========================================================================== */
id("open-gift-btn").addEventListener("click", () => {
  const giftBox = id("gift-box");
  const giftModal = id("gift-modal");

  giftBox.classList.add("open");

  // Fire Grand Confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    giftModal.classList.remove("hidden");
    giftModal.scrollIntoView({ behavior: "smooth" });
  }, 600);
});

/* ==========================================================================
   11. BIRTHDAY CAKE CANDLE
   ========================================================================== */
function blowCandle() {
  const flame = id("flame");
  const wishMsg = id("wish-message");

  flame.classList.add("out");

  // Confetti celebration
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  });

  setTimeout(() => {
    wishMsg.classList.remove("hidden");
    wishMsg.scrollIntoView({ behavior: "smooth" });
  }, 500);
}

/* ==========================================================================
   12. CINEMATIC OBSERVER (SCROLL TRIGGERED TEXT REVEAL)
   ========================================================================== */
function initCinematicObserver() {
  const lines = document.querySelectorAll(".cine-line");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach((line, index) => {
          setTimeout(() => {
            line.classList.add("visible");
          }, index * 1200); // 1.2 second delay between lines
        });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.querySelector("#cinematic-ending"));
}

/* Utility Helper */
function id(elementId) {
  return document.getElementById(elementId);
}