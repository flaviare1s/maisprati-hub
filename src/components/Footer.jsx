import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import logo from '../assets/images/logo-menu.png';

export const Footer = () => {
  return (
    <footer className="bg-blue-logo text-white py-8 px-4 md:py-14 md:pb-24 flex flex-col justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="flex justify-center w-[150px] m-auto">
          <img className="w-full" src={logo} alt="Logo-+praTiHub" />
        </div>

        <div className="span-col-1 md:col-span-2">
          <p className="text-sm text-center md:text-left">
            +praTiHub foi criada para o gerenciamento dos projetos finais da +praTi. Plataforma desenvolvida por alunos para alunos, com o objetivo de facilitar a organização e o acompanhamento dos projetos.
          </p>
        </div>
        <div className="flex justify-center items-center gap-3">
          <a href="#" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
            <FaLinkedin size={20} />
          </a>
          <a href="https://www.instagram.com/maisprati?igsh=MWxsa25vc3ZoemZvMA==" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
            <FaInstagram size={20} />
          </a>
          <a href="#" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
            <FaFacebook size={20} />
          </a>
          <a href="#" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
            <FaYoutube size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
