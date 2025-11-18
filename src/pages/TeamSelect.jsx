import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../assets/images/logo.png';
import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/SubmitButton';
import { fetchTeams, validateTeamCode, addMemberToTeam } from '../api/teams';
import toast from 'react-hot-toast';

export const TeamSelect = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Erro ao carregar times:", error);
        toast.error("Erro ao carregar times");
      }
    };

    loadTeams();
  }, []);

  const handleTeamSelected = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const handleCodeSubmit = async (data) => {
    setIsLoading(true);

    try {
      await validateTeamCode(selectedTeam.id, data.securityCode);

      const { updatedTeam, updatedUserData } = await addMemberToTeam(selectedTeam.id, {
        userId: user.id,
        role: "member",
        specialization: "Desenvolvedor"
      });

      updateUser(updatedUserData);

      // Verificar se hasGroup está correto
      if (updatedUserData.hasGroup !== true) {
        console.error("Dados:", updatedUserData);
      }

      toast.success(`Bem-vindo ao ${updatedTeam.name}!`);

      navigate('/dashboard');

    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Código inválido";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTeam(null);
    reset();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const SecurityCodeModal = () => (
    <>
      {!isDesktop && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-light rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="text-blue-logo hover:text-orange-logo self-start mb-4"
                onClick={handleModalClose}
              >
                ← Voltar
              </button>

              <img src={logo} alt="Logo" className="w-[120px] mb-6" />

              <h2 className="text-xl text-center text-gray-muted font-montserrat mb-2">
                Código de Segurança
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Digite o código para entrar no {selectedTeam?.name}
              </p>

              <form onSubmit={handleSubmit(handleCodeSubmit)} className="w-full">
                <InputField
                  name="securityCode"
                  type="text"
                  placeholder="Código de segurança"
                  register={register}
                  error={errors.securityCode?.message}
                  validation={{
                    required: "Código é obrigatório",
                    minLength: {
                      value: 4,
                      message: "Código deve ter pelo menos 4 caracteres"
                    }
                  }}
                />
                <SubmitButton label="Confirmar" isLoading={isLoading} />
              </form>
            </div>
          </div>
        </div>
      )}

      {isDesktop && showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-light rounded-2xl shadow-2xl p-8 w-[600px] animate-drop flex flex-row gap-8 h-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="text-blue-logo hover:text-orange-logo self-start mb-4"
                onClick={handleModalClose}
              >
                ← Voltar
              </button>
              <img src={logo} alt="Logo" className="w-[180px] m-auto" />
            </div>

            <div className="flex flex-col items-center w-full m-auto">
              <h2 className="text-xl mb-4 text-center text-gray-muted font-montserrat">
                Código de Segurança
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Digite o código para entrar no {selectedTeam?.name}
              </p>

              <form onSubmit={handleSubmit(handleCodeSubmit)} className="flex flex-col items-center w-full">
                <InputField
                  name="securityCode"
                  type="text"
                  placeholder="Código de segurança"
                  register={register}
                  error={errors.securityCode?.message}
                  validation={{
                    required: "Código é obrigatório",
                    minLength: {
                      value: 4,
                      message: "Código deve ter pelo menos 4 caracteres"
                    }
                  }}
                />
                <SubmitButton label="Confirmar" isLoading={isLoading} />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Selecionar Time</h1>
      <p className="mb-4">Escolha seu time para continuar:</p>

      <div className="space-y-3">
        {teams.length > 0 ? (
          teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelected(team)}
              className="w-full p-4 bg-blue-logo text-light rounded-lg hover:bg-blue-600 transition-colors font-medium cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span>{team.name}</span>
                <span className="text-sm opacity-75">
                  {team.currentMembers}/{team.maxMembers} membros
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-muted py-4">
            Nenhum time cadastrado!
          </div>
        )}
      </div>

      <SecurityCodeModal />
    </div>
  );
};
