"use client"

import { useId } from "react"

export function NotFoundBackground() {
  // Use useId to generate consistent IDs
  const id = useId()
  const grad1Id = `grad1-${id}`
  const grad2Id = `grad2-${id}`
  const maskId = `mask1-${id}`
  const glowId = `glow-${id}`

  // Pre-generate star positions for consistency
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    cx: (i * 29) % 1440,
    cy: (i * 17) % 800,
    r: (i % 3) + 1,
    delay: `${i % 5}s`,
    duration: `${3 + (i % 5)}s`,
  }))

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={grad1Id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gradient-start, rgba(109, 40, 217, 0.1))" />
            <stop offset="100%" stopColor="var(--gradient-end, rgba(109, 40, 217, 0.05))" />
          </linearGradient>
          <linearGradient id={grad2Id} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--gradient-start, rgba(76, 29, 149, 0.1))" />
            <stop offset="100%" stopColor="var(--gradient-end, rgba(76, 29, 149, 0.05))" />
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <path
              d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,165.3C672,139,768,117,864,144C960,171,1056,245,1152,245.3C1248,245,1344,171,1392,133.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="black"
            />
          </mask>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background gradient */}
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${grad1Id})`} className="gradient-1" />

        {/* Grid pattern */}
        <path
          d="M0 40h1440M0 80h1440M0 120h1440M0 160h1440M0 200h1440M0 240h1440M0 280h1440M0 320h1440M0 360h1440M0 400h1440M0 440h1440M0 480h1440M0 520h1440M0 560h1440M0 600h1440M0 640h1440M0 680h1440M0 720h1440M0 760h1440M0 800h1440"
          className="grid-line"
          strokeWidth="0.5"
        />
        <path
          d="M40 0v800M80 0v800M120 0v800M160 0v800M200 0v800M240 0v800M280 0v800M320 0v800M360 0v800M400 0v800M440 0v800M480 0v800M520 0v800M560 0v800M600 0v800M640 0v800M680 0v800M720 0v800M760 0v800M800 0v800M840 0v800M880 0v800M920 0v800M960 0v800M1000 0v800M1040 0v800M1080 0v800M1120 0v800M1160 0v800M1200 0v800M1240 0v800M1280 0v800M1320 0v800M1360 0v800M1400 0v800"
          className="grid-line"
          strokeWidth="0.5"
        />

        {/* Decorative elements */}
        <circle cx="400" cy="300" r="100" fill={`url(#${grad2Id})`} className="gradient-2" opacity="0.3" />
        <circle cx="1100" cy="500" r="150" fill={`url(#${grad1Id})`} className="gradient-1" opacity="0.4" />

        {/* Stars - with deterministic positions */}
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            className="star animate-pulse"
            style={{ animationDelay: star.delay, animationDuration: star.duration }}
          />
        ))}

        {/* Shooting stars */}
        <line x1="300" y1="200" x2="350" y2="250" className="shooting-star animate-pulse" strokeWidth="1" />
        <line
          x1="1200"
          y1="300"
          x2="1150"
          y2="350"
          className="shooting-star animate-pulse"
          style={{ animationDelay: "2s" }}
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
