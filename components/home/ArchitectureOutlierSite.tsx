'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './ArchitectureOutlierSite.module.css';

type Project = {
  personName?: string | null;
  personUrl?: string | null;
  articleUrl?: string | null;
  videoUrl?: string[] | string | null;
};

type Subcategory = {
  name: string;
  projects?: Project[];
  articleUrl?: string | null;
  videoUrl?: string[] | string | null;
};

type Category = {
  name: string;
  subcategories: Subcategory[];
};

type CareersData = {
  categories: Category[];
};

type PopoverState = {
  sub: Subcategory;
  left: number;
  top: number;
} | null;

const HOME_DATA_PATH = '/home/data/careers.json';

function getProjects(sub: Subcategory): Project[] {
  if (Array.isArray(sub.projects)) return sub.projects;
  if (sub.articleUrl || sub.videoUrl) {
    return [
      {
        articleUrl: sub.articleUrl,
        videoUrl: sub.videoUrl,
      },
    ];
  }
  return [];
}

function videoList(project: Project) {
  if (!project.videoUrl) return [];
  return Array.isArray(project.videoUrl) ? project.videoUrl : [project.videoUrl];
}

function extractBilibiliId(url: string) {
  return url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/)?.[1] ?? null;
}

function Header({ active, home }: { active: 'home' | 'about'; home?: boolean }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLButtonElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!home) return;

    const navbarHeight = () => {
      const width = window.innerWidth;
      if (width <= 360) return 100;
      if (width <= 480) return 110;
      if (width <= 640) return 130;
      if (width <= 768) return 150;
      return 200;
    };
    const logoEnd = () => {
      const width = window.innerWidth;
      if (width <= 360) return 80;
      if (width <= 480) return 90;
      if (width <= 640) return 110;
      if (width <= 768) return 130;
      return 160;
    };
    const update = () => {
      const heroHeight = window.innerHeight;
      const distance = heroHeight - navbarHeight();
      const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      const currentHeight = Math.round(heroHeight + (navbarHeight() - heroHeight) * progress);
      const currentLogo = Math.round(400 + (logoEnd() - 400) * progress);
      const navOpacity = Math.min(Math.max((progress - 0.6) * 2.5, 0), 1);
      const indicatorOpacity = 1 - Math.min(progress / 0.3, 1);

      if (heroRef.current) {
        heroRef.current.style.height = `${currentHeight}px`;
        heroRef.current.classList.toggle(styles.collapsed, progress >= 0.95);
      }
      if (logoRef.current) logoRef.current.style.height = `${currentLogo}px`;
      if (navRef.current) navRef.current.style.opacity = String(navOpacity);
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = String(indicatorOpacity);
        indicatorRef.current.style.visibility = progress > 0.3 ? 'hidden' : 'visible';
      }
      if (spacerRef.current) spacerRef.current.style.height = `${heroHeight}px`;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [home]);

  const scrollToExplore = () => {
    const target = Math.max(window.innerHeight - 200, 0);
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <>
      <header
        ref={heroRef}
        className={`${styles.hero} ${home ? '' : styles.staticNavbar}`}
      >
        <div className={styles.heroContent}>
          <div className={styles.logo}>
            <Link href="/">
              <img
                ref={logoRef}
                src="/home/assets/AOLogo.jpg"
                alt="Architecture Outlier"
                className={styles.logoImg}
              />
            </Link>
          </div>
          <nav ref={navRef} className={styles.nav}>
            <Link
              href="/"
              className={`${styles.navLink} ${active === 'home' ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${styles.navLink} ${active === 'about' ? styles.active : ''}`}
            >
              About
            </Link>
          </nav>
        </div>
        {home && (
          <button
            ref={indicatorRef}
            className={styles.scrollIndicator}
            onClick={scrollToExplore}
            type="button"
          >
            <span>Scroll to explore</span>
            <span className={styles.scrollArrow} />
          </button>
        )}
      </header>
      {home && <div ref={spacerRef} className={styles.heroSpacer} />}
    </>
  );
}

function Contact() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <aside className={styles.contact}>
        <div className={styles.contactLinks}>
          {[
            ['WeChat', '/home/assets/QRWechat.jpg'],
            ['RED', '/home/assets/QRRedNote.jpg'],
          ].map(([label, src]) => (
            <div className={styles.qrItem} key={label}>
              <span className={styles.qrLabel}>{label}</span>
              <button
                className={styles.qrCode}
                onClick={() => setLightbox(src)}
                type="button"
              >
                <img src={src} alt={`${label} QR Code`} />
              </button>
            </div>
          ))}
        </div>
      </aside>
      {lightbox && (
        <button
          className={styles.qrLightbox}
          onClick={() => setLightbox(null)}
          type="button"
          aria-label="Close QR code"
        >
          <span className={styles.close}>x</span>
          <img className={styles.lightboxImage} src={lightbox} alt="QR Code" />
        </button>
      )}
    </>
  );
}

export function ArchitectureOutlierHome() {
  const [data, setData] = useState<CareersData | null>(null);
  const [error, setError] = useState(false);
  const [popover, setPopover] = useState<PopoverState>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(HOME_DATA_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: CareersData) => setData(json))
      .catch(() => setError(true));
  }, []);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setPopover(null), 250);
  }

  function openPopover(sub: Subcategory, target: HTMLElement) {
    cancelClose();
    const rect = target.getBoundingClientRect();
    const width = 160;
    const pad = 16;
    const left =
      window.innerWidth - rect.right >= width + pad
        ? rect.right
        : rect.left >= width + pad
          ? rect.left - width
          : Math.max(pad, (window.innerWidth - width) / 2);
    const top = Math.max(pad, Math.min(rect.top, window.innerHeight - 120 - pad));
    setPopover({ sub, left, top });
  }

  const activeVideoId = videoUrl ? extractBilibiliId(videoUrl) : null;

  return (
    <div className={styles.site}>
      <Header active="home" home />
      <main className={styles.gridSection}>
        <div className={styles.categoriesGrid}>
          {error && <p className={styles.gridMessage}>Unable to load data.</p>}
          {!error &&
            data?.categories.map((category, catIndex) => (
              <section className={styles.categoryColumn} key={category.name}>
                <h2 className={styles.categoryHeader}>{category.name}</h2>
                {category.subcategories.map((sub, subIndex) => (
                  <button
                    className={styles.subcategory}
                    key={sub.name}
                    type="button"
                    style={{ animationDelay: `${catIndex * 0.03 + subIndex * 0.08}s` }}
                    onMouseEnter={(e) => openPopover(sub, e.currentTarget)}
                    onMouseLeave={scheduleClose}
                    onFocus={(e) => openPopover(sub, e.currentTarget)}
                    onBlur={scheduleClose}
                    onClick={(e) => openPopover(sub, e.currentTarget)}
                  >
                    {sub.name}
                  </button>
                ))}
              </section>
            ))}
        </div>
        <div className={styles.ctaBox}>
          <p>Thinking about life beyond architecture?</p>
          <Link href="/test" className={styles.ctaLink}>
            Take the Architect Career Transition Test
          </Link>
        </div>
      </main>

      {popover && (
        <>
          <button
            className={styles.popoverBackdrop}
            onClick={() => setPopover(null)}
            type="button"
            aria-label="Close"
          />
          <div
            className={styles.popover}
            style={{ left: popover.left, top: popover.top }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {getProjects(popover.sub).length === 0 && (
              <div className={styles.empty}>Under Construction</div>
            )}
            {getProjects(popover.sub).map((project, index) => (
              <div className={styles.project} key={`${project.personName ?? 'project'}-${index}`}>
                {index > 0 && <hr className={styles.separator} />}
                {project.personName &&
                  (project.personUrl ? (
                    <a className={styles.personName} href={project.personUrl} target="_blank" rel="noreferrer">
                      {project.personName}
                    </a>
                  ) : (
                    <div className={styles.personName}>{project.personName}</div>
                  ))}
                <div className={styles.projectLinks}>
                  {videoList(project).map((url, videoIndex) => (
                    <button
                      className={styles.popoverLink}
                      key={url}
                      onClick={() => {
                        setPopover(null);
                        setVideoUrl(url);
                      }}
                      type="button"
                    >
                      {videoList(project).length > 1 ? `video ${videoIndex + 1}` : 'video'}
                    </button>
                  ))}
                  {project.articleUrl && (
                    <a className={styles.popoverLink} href={project.articleUrl} target="_blank" rel="noreferrer">
                      interview text
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {videoUrl && (
        <div className={styles.videoModal}>
          <button className={styles.videoOverlay} onClick={() => setVideoUrl(null)} type="button" aria-label="Close" />
          <div className={styles.videoContainer}>
            <button className={styles.videoClose} onClick={() => setVideoUrl(null)} type="button">
              x
            </button>
            {activeVideoId ? (
              <iframe
                src={`https://player.bilibili.com/player.html?isOutside=true&bvid=${activeVideoId}&autoplay=1`}
                allowFullScreen
                title="Bilibili video"
              />
            ) : (
              <a href={videoUrl} target="_blank" rel="noreferrer" className={styles.ctaLink}>
                Open video
              </a>
            )}
          </div>
        </div>
      )}

      <Contact />
    </div>
  );
}

export function ArchitectureOutlierAbout() {
  return (
    <div className={styles.site}>
      <Header active="about" />
      <main className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <section className={styles.aboutBlock}>
            <h1 className={styles.aboutTitle}>About</h1>
            <div className={styles.aboutContent}>
              <p>
                Founded by Claudia and Yen in 2023, <strong>Architecture Outlier</strong>{' '}
                documents architects who practice beyond traditional boundaries.
              </p>
              <p>
                To date, we have conducted over ten interviews, shared through videos,
                podcasts, and articles on WeChat and RED.
              </p>
              <p>
                We see architecture as a prism: a way of understanding the world that can
                be refracted into countless paths.
              </p>
              <p>
                This page serves as an evolving archive of featured work, alongside
                additional references and inspirations that have informed our ongoing
                research and exploration.
              </p>
              <p>
                To engage with the community and access our latest content, please follow
                us on WeChat and RED.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Contact />
    </div>
  );
}
