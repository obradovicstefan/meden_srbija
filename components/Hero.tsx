"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./Hero.css";

function scrollToProducts() {
  const el = document.getElementById("proizvodi");
  el?.scrollIntoView({ behavior: "smooth" });
}

function scrollToAbout() {
  const el = document.getElementById("o-nama");
  el?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const [hasVideo, setHasVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section
      id="pocetna"
      className={`hero ${hasVideo ? "hero--video" : "hero--no-video"}`}
    >
      {/* Place hero.mp4 (10–15s, 1920×1080, muted) in /public/videos/ */}
      <video
        ref={videoRef}
        className="heroBg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ objectPosition: "center center" }}
        onLoadedData={() => setHasVideo(true)}
        onError={() => setHasVideo(false)}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="overlay" />
      <div className="vignette" />

      <nav className="nav">
        <Link
          href="/"
          className="hero-logo-link"
          aria-label="Meden Srbija – početna"
        >
          <span className="hero-logo-text">MEDEN</span>
        </Link>

        <ul className="navLinks">
          {[
            { label: "Početna", href: "#pocetna" },
            { label: "O nama", href: "#o-nama" },
            { label: "Proizvodi", href: "#proizvodi" },
            { label: "Nagrade", href: "#nagrade" },
            { label: "Kontakt", href: "#kontakt" },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={item.label === "Početna" ? "active" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="content">
        <div className="goldLine" />
        <p className="eyebrow">Prirodni med iz Srbije</p>
        <h1 className="heading">
          Meden
          <br />
          <em>Srbija</em>
        </h1>
        <p className="subtitle">
          Tradicionalni med i proizvodi od meda.
          <br />
          Kvalitet i tradicija u svakom gutljaju.
        </p>
        <div className="ctaGroup">
          <button type="button" className="btnPrimary" onClick={scrollToProducts}>
            Pogledaj proizvode
          </button>
          <button type="button" className="btnSecondary" onClick={scrollToAbout}>
            O nama
          </button>
        </div>
      </div>

      <div className="bottom">
        <div className="scrollHint">
          <div className="scrollLine" />
          <span>Skroluj</span>
        </div>
        <div className="meta">
          <p>
            Osnovan <strong>2025</strong>
          </p>
          <p>Beograd, Srbija</p>
        </div>
      </div>

      <div className="cornerAccent" />
    </section>
  );
}
