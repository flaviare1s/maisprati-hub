import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { updateUser } from '../api.js/users';
import { CustomLoader } from '../components/CustomLoader';
import { ReturnButton } from '../components/ReturnButton';
import { SelectField } from '../components/SelectField';
import { SubmitButton } from '../components/SubmitButton';
import api from '../services/api';

export const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUserData } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          if (currentUser.type !== 'admin') {
            navigate('/forbidden');
            return;
          }
          const response = await api.get(`/users/${id}`);
          userData = response.data;
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
        setError('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, currentUser, navigate, reset]);

  const onSubmit = async (formData) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const targetUserId = id || currentUser.id;

      // Filtrar dados baseado no tipo de usuário
      const filteredData = {
        name: formData.name,
        email: formData.email,
        codename: formData.codename
      };

      // Incluir avatar apenas se foi selecionado
      if (formData.avatar && formData.avatar.trim() !== '') {
        filteredData.avatar = formData.avatar;
      }

      // Adicionar campos específicos apenas para estudantes
      if (user?.type === 'student') {
        if (formData.whatsapp) {
          filteredData.whatsapp = formData.whatsapp;
        }
        if (formData.groupClass) {
          filteredData.groupClass = formData.groupClass;
        }
      }

      console.log('Dados filtrados para envio:', filteredData);

      const updatedUser = await updateUser(targetUserId, filteredData);

      // Se estiver editando o próprio perfil, atualizar contexto
      if (!id || id === currentUser.id) {
        updateUserData(updatedUser);
      }

      setSuccess('Perfil atualizado com sucesso!');

      // Redirecionar após sucesso
      setTimeout(() => {
        if (currentUser.type === 'admin' && id) {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil. Tente novamente.');
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
              Nome Completo *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
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
              {...register('codename', { required: 'Nome de Guerra é obrigatório' })}
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
                  value: /^\S+@\S+$/i,
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
                  placeholder="(11) 99999-9999"
                  {...register('whatsapp')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-logo"
                />
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
              className="flex-1 bg-gray-muted text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <SubmitButton label="Salvar" />
          </div>
        </form>
      </div>
    </div>
  );
};
