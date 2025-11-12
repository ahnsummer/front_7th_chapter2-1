export function NotFound() {
  return (
    <main className="max-w-md mx-auto px-4 py-4">
      <div className="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
        <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="blueGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4285f4" stopOpacity={1} />
              <stop offset="100%" stopColor="#1a73e8" stopOpacity={1} />
            </linearGradient>
            <filter
              id="softShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="8"
                floodColor="#000000"
                floodOpacity={0.1}
              />
            </filter>
          </defs>

          {/* 404 Numbers */}
          <text
            x="160"
            y="85"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="48"
            fontWeight="600"
            fill="url(#blueGradient)"
            textAnchor="middle"
          >
            404
          </text>

          {/* Icon decoration */}
          <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8" />
          <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8" />
          <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5" />
          <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5" />

          {/* Message */}
          <text
            x="160"
            y="110"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="14"
            fontWeight="400"
            fill="#5f6368"
            textAnchor="middle"
          >
            페이지를 찾을 수 없습니다
          </text>

          {/* Subtle bottom accent */}
          <rect
            x="130"
            y="130"
            width="60"
            height="2"
            rx="1"
            fill="url(#blueGradient)"
            opacity="0.3"
          />
        </svg>

        <a
          href="/"
          data-link
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          홈으로
        </a>
      </div>
    </main>
  );
}
