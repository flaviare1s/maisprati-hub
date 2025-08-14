import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import logo from '../assets/images/logo_conectavida_name.png';

export const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="focus:outline-none cursor-pointer z-50 relative"
          aria-label="Abrir menu"
        >
          <HiMenu size={34} />
        </button>
      )}

      <div
        className={`
          fixed top-0 right-0 w-full h-screen bg-bg-menu-mobile shadow-lg p-6 rounded-bl-md z-50 flex flex-col gap-4
          transform transition-transform duration-500 ease-out
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 pointer-events-none z-40'}
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-[55px] z-[60] cursor-pointer border-2 border-dark w-6 h-6 flex items-center justify-center hover:border-gray-muted hover:text-gray-muted"
          aria-label="Fechar menu"
        >
          <HiX size={34} />
        </button>

        <div className="w-[170px] flex flex-col items-center justify-center mx-auto mt-14">
          <img className="w-full" src={logo} alt="Logo" />
        </div>

        <nav className="p-6 flex flex-col gap-4">
          <Link to="/" onClick={handleLinkClick} className="uppercase font-lg text-light bg-bg-btn-menu-mobile font-bold hover:text-red-logo p-3 rounded-full text-center">Home</Link>
          <Link to="/about" onClick={handleLinkClick} className="uppercase font-lg text-light bg-bg-btn-menu-mobile font-bold hover:text-red-logo p-3 rounded-full text-center">Sobre</Link>
          <Link to="/faq" onClick={handleLinkClick} className="uppercase font-lg text-light bg-bg-btn-menu-mobile font-bold hover:text-red-logo p-3 rounded-full text-center">Faq</Link>
          <Link to="/register" onClick={handleLinkClick} className="uppercase font-lg text-light bg-bg-btn-menu-mobile font-bold hover:text-red-logo p-3 rounded-full text-center">Cadastrar</Link>
          <Link to="/login" onClick={handleLinkClick} className="uppercase font-lg text-light bg-bg-btn-menu-mobile font-bold hover:text-red-logo p-3 rounded-full text-center">Entrar</Link>
        </nav>
      </div>
    </div>
  );
};
