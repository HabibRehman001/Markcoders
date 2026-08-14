import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BackButton from "./BackButton";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Each "row" = one project = two side-by-side cells (like k72.ca/travail).
 * 8 projects × 2 images = 16 images.
 */
const PROJECTS = [
  {
    id: "identity-engine",
    client: "Studio Mark",
    title: "Identity Engine",
    year: "2026",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=80",
        alt: "Runners against bright sky",
      },
      {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
        alt: "Abstract purple liquid waves",
      },
    ],
  },
  {
    id: "liquid-chrome",
    client: "Chrome Lab",
    title: "Liquid Chrome",
    year: "2026",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1400&q=80",
        alt: "Mountain landscape in snow",
      },
      {
        src: "https://images.unsplash.com/photo-1452195100486-9cc8059874a0?auto=format&fit=crop&w=1400&q=80",
        alt: "Cheese wheel on patterned paper",
      },
    ],
  },
  {
    id: "cinematic-scroll",
    client: "Reel House",
    title: "Cinematic Scroll",
    year: "2026",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1494869042583-f6c911f318d1?auto=format&fit=crop&w=1400&q=80",
        alt: "Close-up eye detail",
      },
      {
        src: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1400&q=80",
        alt: "Product packaging bags",
      },
    ],
  },
  {
    id: "spatial-menu",
    client: "Interface Co",
    title: "Spatial Menu",
    year: "2026",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
        alt: "Mountain peaks",
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
        alt: "Neon glass geometry",
      },
    ],
  },
  {
    id: "type-reveal",
    client: "Type Foundry",
    title: "Type Reveal",
    year: "2025",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
        alt: "Camera on desk",
      },
      {
        src: "https://images.unsplash.com/photo-1493612276201-517e6b5f2ce5?auto=format&fit=crop&w=1400&q=80",
        alt: "Creative desk flatlay",
      },
    ],
  },
  {
    id: "motion-stack",
    client: "Motion Desk",
    title: "Motion Stack",
    year: "2025",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
        alt: "Alpine ridgeline",
      },
      {
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=80",
        alt: "Mobile interface mockups",
      },
    ],
  },
  {
    id: "neon-grid",
    client: "Grid Works",
    title: "Neon Grid",
    year: "2025",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
        alt: "Laptop and notes",
      },
      {
        src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1400&q=80",
        alt: "Abstract fluid art",
      },
    ],
  },
  {
    id: "signal-field",
    client: "Signal Studio",
    title: "Signal Field",
    year: "2025",
    href: "#",
    images: [
      {
        src: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c32?auto=format&fit=crop&w=1400&q=80",
        alt: "3D abstract shapes",
      },
      {
        src: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&w=1400&q=80",
        alt: "Gradient light field",
      },
    ],
  },
];

export default function ProjectsGrid() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(PROJECTS[0]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduce) {
        gsap.from(".projects__wordmark", {
          y: 28,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
        });

        gsap.from(".projects__label", {
          y: 16,
          opacity: 0,
          duration: 0.8,
          delay: 0.12,
          ease: "power3.out",
        });
      }

      // Upcoming images start small and grow to full size as they scroll in
      gsap.utils.toArray(".cell").forEach((cell) => {
        const frame = cell.querySelector(".cell__frame");
        if (!frame) return;

        if (reduce) {
          gsap.set(frame, { clearProps: "all" });
          return;
        }

        gsap.fromTo(
          frame,
          { scale: 0.72, yPercent: 8, force3D: true },
          {
            scale: 1,
            yPercent: 0,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: cell,
              start: "top 95%",
              end: "top 40%",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      gsap.utils.toArray(".row").forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActive(PROJECTS.find((p) => p.id === row.dataset.id)),
          onEnterBack: () => setActive(PROJECTS.find((p) => p.id === row.dataset.id)),
        });
      });

      ScrollTrigger.refresh();
    }, root);

    const onLoad = () => ScrollTrigger.refresh();
    const images = root.querySelectorAll(".cell__media");
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onLoad, { once: true });
    });

    const refreshTimers = [
      window.setTimeout(() => ScrollTrigger.refresh(), 150),
      window.setTimeout(() => ScrollTrigger.refresh(), 600),
      window.setTimeout(() => ScrollTrigger.refresh(), 1200),
    ];

    return () => {
      refreshTimers.forEach((id) => window.clearTimeout(id));
      images.forEach((img) => img.removeEventListener("load", onLoad));
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="projects">
      <div className="projects__intro">
        <BackButton className="projects__back" tone="light" />

        <h1 className="projects__wordmark">
          Markcoders<span className="projects__tm">™</span>
        </h1>
        <p className="projects__label">
          <span>Projects</span>
        </p>
      </div>

      <header className="projects__nav">
        <span key={active.client + "-client"} className="projects__nav-item projects__nav-fade">
          {active.client}
        </span>
        <span key={active.title + "-title"} className="projects__nav-item projects__nav-fade">
          {active.title}
        </span>
        <span key={active.year + "-year"} className="projects__nav-item projects__nav-fade">
          {active.year}
        </span>
      </header>

      <div className="projects__grid">
        {PROJECTS.map((project) => (
          <div className="row" data-id={project.id} key={project.id}>
            {project.images.map((img, i) => (
              <a
                href={project.href}
                className={`cell${i === 0 ? " cell--left" : " cell--right"}`}
                key={i}
              >
                <div className="cell__frame">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="cell__media"
                    loading="lazy"
                  />
                  <div className="cell__overlay">
                    <span className="cell__cta">View project</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

