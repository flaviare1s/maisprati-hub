import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons';

export const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Layout Desktop */}
        <div className="hidden lg:flex items-center justify-between">
          
          {/* Logo - Esquerda */}
          <div className="flex-shrink-0">
          <div className="ps-1 pr -1 ml-px">
            <img className=" bg-white rounded-xl size-45 mb-8 h-10" src="src/assets/images/logo-novo.png " alt="Logo-+Prati-hub" />
          </div>
          </div>

          {/* Instituição - Centro */}
          <div className="flex-1 mx-8">
            <h3 className="font-bold text-base mb-2">Instituição</h3>
            <p className="text-sm leading-relaxed max-w-md">
              Somos a +praTI, uma iniciativa da sociedade sem fins lucrativos,
              que busca encontrar e capacitar novos talentos da área de TI.
            </p>
          </div>

          {/* Menu - Centro-direita */}
          <div className="mx-8">
            <h3 className="font-bold text-base mb-2">Menu</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#sobre" className="hover:underline">Sobre</a></li>
              <li><a href="#equipe" className="hover:underline">Equipe</a></li>
              <li><a href="#faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Redes Sociais - Direita */}
          <div className="flex gap-3 flex-shrink-0">
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>

        {/* Layout Mobile e Tablet */}
        <div className="lg:hidden space-y-6">
          
          {/* Logo - Centralizado */}
          <div className="flex justify-center">
          <div className="ps-1 pr -1 ml-px">
            <img className=" bg-white rounded-xl size-45 mb-8 h-10" src="src/assets/images/logo-novo.png " alt="Logo-+Prati-hub" />
          </div>
          </div>

          {/* Grid para Instituição e Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
            
            {/* Instituição */}
            <div>
              <h3 className="font-bold text-base mb-2">Instituição</h3>
              <p className="text-sm leading-relaxed">
                Somos a +praTI, uma iniciativa da sociedade sem fins lucrativos,
                que busca encontrar e capacitar novos talentos da área de TI.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h3 className="font-bold text-base mb-2">Menu</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="#sobre" className="hover:underline">Sobre</a></li>
                <li><a href="#equipe" className="hover:underline">Equipe</a></li>
                <li><a href="#faq" className="hover:underline">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Redes Sociais - Centralizado */}
          <div className="flex justify-center gap-3">
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <Linkedin size={20} />
            </a>
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="bg-white text-blue-600 rounded-full p-2 hover:bg-gray-100 transition">
              <Youtube size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

