import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { MdOutlineMail } from "react-icons/md";
import logo from '../assets/images/logo-footer.png';

export const Footer = () => {
  return (
    <footer className="bg-blue-logo text-white py-8 px-4 md:py-14 flex flex-col justify-center items-center mt-3">
      <div className="max-w-[1200px] m-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="flex self-start sm:self-center w-full m-auto">
            <img className="w-[150px] px-2" src={logo} alt="Logo-+praTiHub" />
          </div>

          <div className="span-col-1 md:col-span-2 pr-4 sm:pr-0">
            <p className="text-sm">
              +praTiHub foi criada para o gerenciamento dos projetos finais da +praTi. Plataforma desenvolvida por alunos para alunos, com o objetivo de facilitar a organização e o acompanhamento dos projetos.
            </p>
          </div>
          <div className="flex justify-start sm:justify-center px-4 sm:px-0 items-center gap-3 md:col-span-2">
            <a href="mailto:maisprati.hub@gmail.com" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
              <MdOutlineMail size={20} />
            </a>
            <a href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A66592074&keywords=%2Bprati&origin=RICH_QUERY_SUGGESTION&position=0&searchId=d54022d3-ac8a-40cd-b1d9-be6089d50c46&sid=VaF&spellCorrectionEnabled=false" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
              <FaLinkedin size={20} />
            </a>
            <a href="https://www.instagram.com/maisprati?igsh=MWxsa25vc3ZoemZvMA==" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.facebook.com/maispratioficial/" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
              <FaFacebook size={20} />
            </a>
            <a href="https://www.youtube.com/@maispraTI" target='_blank' rel="noopener noreferrer" className="bg-white text-blue-logo rounded-full p-2 h-10 w-10 flex items-center justify-center hover:scale-3d transition">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
