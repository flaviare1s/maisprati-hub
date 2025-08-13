import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

export const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-roxo-primario focus:outline-none cursor-pointer"
        aria-label="Abrir menu"
      >
        {isOpen ? <HiX size={34} /> : <HiMenu size={34} />}
      </button>

      <nav
        className={`
          absolute top-[104px] right-0 w-full h-screen bg-light shadow-lg p-6 rounded-bl-md z-50 flex flex-col gap-4
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}
      >
        <Link to='/' onClick={handleLinkClick} className='uppercase font-lg text-red-logo font-bold hover:text-red-secondary link-nav'>Home</Link>
        <Link to='/about' onClick={handleLinkClick} className='uppercase font-lg text-red-logo font-bold hover:text-red-secondary link-nav'>Sobre</Link>
        <Link to='/faq' onClick={handleLinkClick} className='uppercase font-lg text-red-logo font-bold hover:text-red-secondary link-nav'>Faq</Link>
        <Link to='/register' onClick={handleLinkClick} className="uppercase font-lg text-white bg-bg-menu-mobile hover:bg-bg-btn-menu-mobile py-2 px-6 rounded-lg" >Cadastrar</Link>
        <Link to='/login' onClick={handleLinkClick} className="uppercase font-lg text-white bg-red-logo hover:bg-red-secondary py-2 px-6 rounded-lg" >Entrar</Link>
      </nav>
    </div>
  );
};
