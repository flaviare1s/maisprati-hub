import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';
import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/SubmitButton';
import { FaArrowLeft, FaRandom, FaEye, FaEyeSlash } from 'react-icons/fa';
import { createTeam } from '../api.js/teams';

export const CreateTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [, setSecurityCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      maxMembers: '4',
      area: '',
      securityCode: generateSecurityCode(),
      projectType: '',
      technologies: '',
      objectives: '',
      timeline: '',
      requirements: '',
      members: []
    }
  });

  useEffect(() => {
    if (user && !isAdmin(user)) {
      navigate('/401');
    }
  }, [user, navigate]);

  useEffect(() => {
    const code = generateSecurityCode();
    setSecurityCode(code);
    setValue('securityCode', code);
  }, [setValue]);

  function generateSecurityCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleGenerateCode = () => {
    const newCode = generateSecurityCode();
    setSecurityCode(newCode);
    setValue('securityCode', newCode);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const teamToCreate = {
        ...data,
        maxMembers: parseInt(data.maxMembers),
        createdBy: user.id,
        securityCode: data.securityCode.toUpperCase()
      };

      const createdTeam = await createTeam(teamToCreate);

      navigate('/dashboard', {
        state: { message: `Time "${createdTeam.name}" criado com sucesso!` }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  if (!user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-logo hover:text-blue-600 mb-4"
          >
            <FaArrowLeft /> Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Criar Novo Time</h1>
          <p className="text-gray-600 mt-2">
            Preencha as informações para criar um novo time de projeto.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-light rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Informações Básicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nome do Time *"
                name="name"
                type="text"
                register={register}
                error={errors.name?.message}
                validation={{
                  required: 'Nome do time é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Nome deve ter pelo menos 3 caracteres'
                  }
                }}
                placeholder="Ex: Equipe Alpha, Inovadores Tech..."
              />

              <div className="w-full">
                <label htmlFor="securityCode" className="block text-sm font-medium text-gray-muted mb-2">
                  Código de Segurança <span>*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showSecurityCode ? 'text' : 'password'}
                      id="securityCode"
                      {...register('securityCode', {
                        required: 'Código de segurança é obrigatório',
                        minLength: {
                          value: 6,
                          message: 'Código deve ter pelo menos 6 caracteres'
                        }
                      })}
                      className="border border-border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-logo placeholder:text-sm bg-bg-input w-full pr-10"
                      placeholder="XXXXXX"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecurityCode(!showSecurityCode)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSecurityCode ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                    title="Gerar código aleatório"
                  >
                    <FaRandom />
                  </button>
                </div>
                {errors.securityCode && (
                  <small className="text-red-secondary mt-1">{errors.securityCode.message}</small>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Os alunos usarão este código para ingressar no time
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-muted mb-2">
                Descrição do Time/Projeto
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className="border border-border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-logo placeholder:text-sm bg-bg-input w-full"
                placeholder="Descrição opcional do projeto"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <div className="min-w-[150px]">
                <SubmitButton
                  label="Criar Time"
                  isLoading={loading}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
