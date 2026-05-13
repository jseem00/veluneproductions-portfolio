import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


// Initial Loader & Assembly Animation
const tl = gsap.timeline();

// Disable scroll while loading/assembling
document.body.style.overflow = 'hidden';

// 1. Hide loader overlay quickly
tl.to(".loader-text", {
  y: -30,
  opacity: 0,
  duration: 0.5,
  delay: 0.5,
  ease: "power2.inOut"
})
.to(".loader", {
  yPercent: -100,
  duration: 0.8,
  ease: "power4.inOut"
});

// 2. Fade in brand title and navbar
tl.from(".brand-title", {
  y: 50,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out"
}, "-=0.2")
.from(".navbar", {
  y: -50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
}, "-=1")
.from(".scroll-indicator", {
  y: 20,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  onComplete: () => {
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden'; // Restore scroll
  }
}, "-=0.5");

// Navbar color change on scroll
ScrollTrigger.create({
  trigger: ".section-about",
  start: "top 100px",
  end: "bottom top",
  onEnter: () => gsap.to(".navbar", { color: "#FAFAFA", duration: 0.3 }),
  onLeaveBack: () => gsap.to(".navbar", { color: "#5E0B15", duration: 0.3 }),
  onEnterBack: () => gsap.to(".navbar", { color: "#FAFAFA", duration: 0.3 }),
  onLeave: () => gsap.to(".navbar", { color: "#5E0B15", duration: 0.3 }),
});



// Section 2: About animations
gsap.to(".about-brand", {
  scrollTrigger: {
    trigger: ".section-about",
    start: "top 70%",
    end: "center center",
    scrub: 1.5
  },
  x: 0,
  opacity: 1,
  ease: "power2.out"
});

gsap.to(".about-text-wrapper", {
  scrollTrigger: {
    trigger: ".section-about",
    start: "top 50%",
    end: "center center",
    scrub: 1.5
  },
  y: 0,
  opacity: 1,
  ease: "power2.out"
});

// Section 3: Works animations
gsap.from(".section-title", {
  scrollTrigger: {
    trigger: ".section-works",
    start: "top 80%",
  },
  y: 50,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from(".work-item", {
  scrollTrigger: {
    trigger: ".works-grid",
    start: "top 70%",
  },
  y: 150,
  opacity: 0,
  rotationX: 10,
  stagger: 0.2,
  duration: 1.5,
  ease: "power4.out"
});

// Parallax effect on work items (Desktop only to prevent overlap)
if (window.innerWidth > 768) {
  gsap.utils.toArray('.work-item').forEach((item, index) => {
    const speed = index % 2 === 0 ? -40 : -80; // different speeds for 3D depth
    gsap.to(item, {
      scrollTrigger: {
        trigger: ".works-grid",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      y: speed,
      ease: "none"
    });
  });
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
