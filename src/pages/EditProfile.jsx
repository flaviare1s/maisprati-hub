import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { updateUser, getUserById } from '../api.js/users';
import { CustomLoader } from '../components/CustomLoader';
import { ReturnButton } from '../components/ReturnButton';
import { SelectField } from '../components/SelectField';
import { SubmitButton } from '../components/SubmitButton';
import toast from 'react-hot-toast';

export const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser: updateUserContext, loadUserData } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const classOptions = [
    { value: '', label: 'Selecione uma turma' },
    { value: 'T1', label: 'T1' },
    { value: 'T2', label: 'T2' }
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        let userData;

        if (id) {
          // Carregando dados de outro usuário (só admin pode fazer isso)
          if (currentUser?.type !== 'admin') {
            navigate('/forbidden');
            return;
          }
          userData = await getUserById(id);
        } else {
          // Editando próprio perfil
          userData = currentUser;
        }

        setUser(userData);
        // Resetar o formulário com os dados do usuário
        reset({
          name: userData.name || '',
          email: userData.email || '',
          codename: userData.codename || '',
          whatsapp: userData.whatsapp || '',
          groupClass: userData.groupClass || '',
        });
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        toast.error('Erro ao carregar dados do usuário');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadUser();
    }
  }, [id, currentUser, navigate, reset]);

  const onSubmit = async (formData) => {
    setSaving(true);

    try {
      const targetUserId = id || currentUser.id;

      // Preparar dados para atualização
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        codename: formData.codename.trim()
      };

      // Adicionar campos específicos apenas para estudantes
      if (user?.type === 'student') {
        if (formData.whatsapp && formData.whatsapp.trim()) {
          updateData.whatsapp = formData.whatsapp.trim();
        }
        if (formData.groupClass) {
          updateData.groupClass = formData.groupClass;
        }
      }

      console.log('Dados para atualização:', updateData);

      const updatedUser = await updateUser(targetUserId, updateData);

      // Se estiver editando o próprio perfil, atualizar contexto
      if (!id || id === currentUser.id) {
        updateUserContext(updatedUser);
        // Recarregar dados do usuário para garantir sincronização
        await loadUserData();
      }

      toast.success('Perfil atualizado com sucesso!');

      // Redirecionar após sucesso
      setTimeout(() => {
        if (currentUser.type === 'admin' && id) {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);

      if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Dados inválidos');
      } else if (error.response?.status === 403) {
        toast.error('Você não tem permissão para editar este perfil');
      } else {
        toast.error('Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-primary mb-4">Usuário não encontrado</h2>
          <ReturnButton />
        </div>
      </div>
    );
  }

  const isEditingOwnProfile = !id || id === currentUser.id;
  const pageTitle = isEditingOwnProfile ? 'Editar Meu Perfil' : `Editar Perfil - ${user.name}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <ReturnButton />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-dark mb-6">{pageTitle}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
              Nome Completo *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 2,
                  message: 'Nome deve ter pelo menos 2 caracteres'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-logo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="codename" className="block text-sm font-medium text-dark mb-2">
              Nome de Guerra *
            </label>
            <input
              id="codename"
              type="text"
              {...register('codename', {
                required: 'Nome de Guerra é obrigatório',
                minLength: {
                  value: 2,
                  message: 'Nome de Guerra deve ter pelo menos 2 caracteres'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-logo"
            />
            {errors.codename && (
              <p className="mt-1 text-sm text-red-500">{errors.codename.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: 'Email inválido'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-logo"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {user?.type === 'student' && (
            <>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-dark mb-2">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="11999999999 (apenas números)"
                  {...register('whatsapp', {
                    pattern: {
                      value: /^\d{10,11}$/,
                      message: 'WhatsApp deve conter apenas números (10-11 dígitos)'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-logo"
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-red-500">{errors.whatsapp.message}</p>
                )}
              </div>

              <SelectField
                label="Turma"
                name="groupClass"
                register={register}
                error={errors.groupClass}
                options={classOptions}
              />
            </>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <SubmitButton
              label={saving ? "Salvando..." : "Salvar"}
              isLoading={saving}
              disabled={saving}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
