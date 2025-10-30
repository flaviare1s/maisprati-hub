import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiHome, HiInformationCircle, HiQuestionMarkCircle, HiUserAdd, HiViewGrid, HiUsers, HiLogin, HiLogout } from 'react-icons/hi';

export const MenuMobile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Observer para mudanças de tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const menuItems = !user ? [
    { to: "/", label: "Home", icon: HiHome },
    { to: "/about", label: "Sobre", icon: HiInformationCircle },
    { to: "/faq", label: "FAQ", icon: HiQuestionMarkCircle },
    { to: "/register", label: "Cadastrar", icon: HiUserAdd },
    { to: "/login", label: "Entrar", icon: HiLogin }
  ] : [
    { to: "/dashboard", label: "Dashboard", icon: HiViewGrid },
    { to: "/common-room", label: "Taverna dos Heróis", icon: HiUsers }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Abrir menu"
      >
        <HiMenu size={24} className="text-gray-800 dark:text-gray-300 cursor-pointer" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#000b] z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 w-80 h-full shadow-2xl z-50 transform transition-transform duration-300 ease-out mobile-menu-panel ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          backgroundColor: isDark ? '#1f2937' : '#ffffff'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: isDark ? '#4b5563' : '#d1d5db' }}>
          <h2 className="text-xl font-bold" style={{ color: isDark ? '#ffffff' : '#1f2937' }}>Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            aria-label="Fechar menu"
          >
            <HiX size={24} style={{ color: isDark ? '#d1d5db' : '#374151' }} />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.codename || user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                <Icon
                  size={20}
                  className="group-hover:scale-110 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
                <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.label}</span>
              </Link>
            );
          })}

          {/* Logout Button for authenticated users */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200 group cursor-pointer"
            >
              <HiLogout size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Sair</span>
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-300 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            +pratiHub © 2025
          </p>
        </div>
      </div>
    </>
  );
};
