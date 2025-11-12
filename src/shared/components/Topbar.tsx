export function Topbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            <a href="/" dataLink="">
              쇼핑몰
            </a>
          </h1>
          <div className="flex items-center space-x-2">
            {/* 장바구니 아이콘 */}
            <button
              id="cart-icon-btn"
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
