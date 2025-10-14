import { Link } from "react-router-dom";
import homePersonagem from "../assets/images/home-personagem.png";

// imagens dos cards
import cardEquipe from "../assets/images/pratihub_homepage_option_5-removebg-preview.png";
import cardProjeto from "../assets/images/pratihub_homepage_option_6-removebg-preview.png";
import cardTutor from "../assets/images/pratihub_homepage_complete_v1-removebg-preview.png";
import cardEntrega from "../assets/images/pratihub_homepage_option_4-removebg-preview.png";

export const Home = () => {
  return (
    <div className="w-full min-h-screen relative md:w-[80%] lg:w-[70%] m-auto">
      {/* HERO */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-10 gap-8">
        {/* Texto */}
        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-snug">
            Conexões Inteligentes. <br /> Projetos Perfeitos.
          </h1>
          <p className="mt-3 text-base sm:text-lg">
            Organize equipes, agende reuniões e conecte-se ao professor de forma simples e prática.
          </p>
        </div>

        {/* Personagem */}
        <div className="w-[210px] lg:w-[250px] xl:w-[350px] relative -translate-x-20 ml-[140px] sm:ml-0 mb-[-60px] sm:mb-0">
          <img src={homePersonagem} alt="Personagem Home" className="w-full" />
        </div>
      </div>

      {/* CARDS DE AÇÕES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-16 py-10">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 text-center hover:shadow-lg transition text-dark dark:text-gray-100">
          <img src={cardEquipe} alt="Crie sua equipe" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Crie sua equipe</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 text-center hover:shadow-lg transition text-dark dark:text-gray-100">
          <img src={cardProjeto} alt="Organize seu Projeto" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Organize seu projeto</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 text-center hover:shadow-lg transition text-dark dark:text-gray-100">
          <img src={cardTutor} alt="Organize com o Tutor" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Interaja com os colegas</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 text-center hover:shadow-lg transition text-dark dark:text-gray-100">
          <img src={cardEntrega} alt="Entregue seu Projeto" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Agende reuniões</h3>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center px-6 lg:px-16 pb-12">
        <Link
          to="/login"
          className="uppercase text-white bg-orange-logo py-2 px-6 rounded-full text-center font-bold hover:bg-orange-400 transition"
        >
          Já tenho cadastro
        </Link>
        <Link
          to="/register"
          className="uppercase text-white bg-orange-logo py-2 px-6 rounded-full text-center font-bold hover:bg-orange-400 transition"
        >
          Quero me cadastrar
        </Link>
      </div>
    </div>
  );
};
