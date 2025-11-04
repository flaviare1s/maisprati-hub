import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SubmitButton } from "../components/SubmitButton";
import logo from '../assets/images/logo.png';
import toast from 'react-hot-toast';
import { registerUser } from "../api.js/auth";

const importAvatars = () => {
  const avatars = [];
  for (let i = 1; i <= 53; i++) {
    try {
      const skipNumbers = [3, 6, 14, 16, 26];
      if (skipNumbers.includes(i)) continue;

      let filename;
      if (i === 11) {
        filename = `avatares 11-1.png`;
      } else {
        filename = `avatares ${i}.png`;
      }

      avatars.push({
        id: i,
        src: `/images/avatar/${filename}`,
        alt: `Avatar ${i}`
      });
    } catch {
      continue;
    }
  }
  return avatars;
};

const FIRST_NAMES = [
  'Frontend',
  'Backend',
  'FullStack',
  'Designer',
  'DevOps',
  'BugHunter',
  'Bonito',
  'DarkModeLover',
  'Console.Log',
  '404',
  'ReactMaster',
  'NodeNinja',
  'CSSWizard',
  'JavaScriptGuru',
  'PythonSage',
  'GitMage',
  'DatabaseLord',
  'APIWhisperer',
  'CloudRider',
  'CodeWarrior',
  'PixelPerfect',
  'ResponsiveKing',
  'AgileHero',
  'TestingLegend',
  'SecurityGuard'
];

const LAST_NAMES = [
  'Iniciante',
  'Avançado',
  'Esforçado',
  'Preguiçoso',
  'Intermediário',
  'Bonito',
  'SemCafeína',
  'ComCafeína',
  'SempreOnline',
  'Sumido',
  'QuebradorDeBuild',
  'Refatorador',
  'Debugador',
  'Deployador',
  'Viciado',
  'Sonolento',
  'Motivado',
  'Produtivo',
  'Criativo',
  'Organizador',
  'Inovador',
  'Persistente',
  'Colaborativo',
  'Focado',
  'Determinado',
  'Curioso',
  'Desafiador',
  'Solucionador',
  'Otimista',
  'Realista'
];

export const CodenameSelect = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedLastName, setSelectedLastName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const avatars = importAvatars();
  const formData = location.state;

  const handleCodenameSubmit = async (e) => {
    e.preventDefault();

    if (!formData) {
      toast.error("Dados do cadastro não encontrados. Volte e preencha o formulário.");
      navigate("/register");
      return;
    }

    if (!selectedFirstName || !selectedLastName || !selectedAvatar) {
      toast.error('Por favor, selecione um nome, sobrenome e avatar');
      return;
    }

    setIsLoading(true);

    try {
      const codename = `${selectedFirstName} ${selectedLastName}`;

      // Formatar dados conforme esperado pelo backend
      const formattedData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        whatsapp: formData.whatsapp,
        groupClass: formData.groupClass,
        hasGroup: formData.hasGroup === "sim",
        wantsGroup: formData.hasGroup === "sim" ? true : formData.wantsGroup === "sim",
        codename,
        avatar: selectedAvatar,
        type: "STUDENT",
      };

      // Registrar usuário no backend
      await registerUser(formattedData);

      toast.success("Cadastro realizado com sucesso!");

      // Fazer login automático após registro
      await login({
        email: formattedData.email,
        password: formattedData.password
      });

      // Redirecionamento baseado na escolha do usuário
      if (formattedData.hasGroup) {
        navigate("/team-select");
      } else if (formattedData.wantsGroup) {
        navigate("/common-room");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Dados inválidos. Verifique os campos.");
      } else {
        toast.error("Erro ao realizar cadastro. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-32 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-logo mb-2">
            Escolha seu Nome de Guerra
          </h1>
          <p>
            Customize sua identidade antes de entrar na aventura
          </p>
        </div>

        <form onSubmit={handleCodenameSubmit} className="space-y-8">
          <div className="bg-light rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-logo">
              Primeiro Nome
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {FIRST_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedFirstName(name)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium cursor-pointer ${selectedFirstName === name
                    ? 'border-blue-logo bg-blue-logo text-light'
                    : 'border-gray-200 bg-light text-gray-700 hover:border-blue-300'
                    }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-light rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-logo">
              Sobrenome
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LAST_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedLastName(name)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium cursor-pointer ${selectedLastName === name
                    ? 'border-orange-logo bg-orange-logo text-light'
                    : 'border-gray-200 bg-light text-gray-700 hover:border-orange-300'
                    }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-light rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-logo">
              Avatar
            </h2>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-96 overflow-y-auto">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.src)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedAvatar === avatar.src
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                    }`}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.alt}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {selectedFirstName && selectedLastName && selectedAvatar && (
            <div className="bg-light rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold mb-4 text-blue-logo">
                Preview
              </h2>
              <div className="flex flex-col items-center space-y-3">
                <img
                  src={selectedAvatar}
                  alt="Avatar selecionado"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-logo"
                />
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedFirstName} {selectedLastName}
                </h3>
              </div>
            </div>
          )}

          <div className="text-center">
            <SubmitButton
              label="Continuar"
              isLoading={isLoading}
              disabled={!selectedFirstName || !selectedLastName || !selectedAvatar}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
