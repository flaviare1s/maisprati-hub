import { Link } from "react-router-dom";
import homePersonagem from "../assets/images/home-personagem.png";

// imagens dos cards
import cardEquipe from "../assets/images/pratihub_homepage_option_5-removebg-preview.png";
import cardProjeto from "../assets/images/pratihub_homepage_option_6-removebg-preview.png";
import cardTutor from "../assets/images/pratihub_homepage_complete_v1-removebg-preview.png";
import cardEntrega from "../assets/images/pratihub_homepage_option_4-removebg-preview.png";

export const Home = () => {
  return (
    <div className="w-full min-h-screen bg-white relative">
      {/* HERO */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-10 gap-8">
        {/* Texto */}
        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-snug">
            Conexão Inteligente. <br /> Projetos Perfeitos.
          </h1>
          <p className="mt-3 text-gray-600 text-base sm:text-lg">
            Organize equipes, projetos e conecte-se ao tutor de forma simples e prática.
          </p>
        </div>

        {/* Personagem */}
        <div className="lg:w-[250px] xl:w-[350px] relative -translate-x-20">
          <img src={homePersonagem} alt="Personagem Home" className="w-full" />
        </div>
      </div>

      {/* CARDS DE AÇÕES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-16 py-10">
        <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
          <img src={cardEquipe} alt="Crie sua equipe" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Crie sua equipe</h3>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
          <img src={cardProjeto} alt="Organize seu Projeto" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Organize seu Projeto</h3>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
          <img src={cardTutor} alt="Organize com o Tutor" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Organize com o Tutor</h3>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
          <img src={cardEntrega} alt="Entregue seu Projeto" className="mx-auto h-[100px] object-contain mb-3" />
          <h3 className="font-semibold text-base sm:text-lg">Entregue seu Projeto</h3>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center px-6 lg:px-16 pb-12">
        <Link
          to="/login"
          className="uppercase text-white bg-orange-500 py-2 px-6 rounded-full text-center font-bold hover:bg-orange-600 transition"
        >
          Já tenho cadastro
        </Link>
        <Link
          to="/register"
          className="uppercase text-white bg-orange-500 py-2 px-6 rounded-full text-center font-bold hover:bg-orange-600 transition"
        >
          Quero me cadastrar
        </Link>
      </div>
    </div>
  );
};
