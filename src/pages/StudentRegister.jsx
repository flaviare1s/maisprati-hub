import { useForm } from 'react-hook-form';
import logo from '../assets/images/logo+prati.png'
import { InputField } from '../components/InputField';
import { SelectField } from '../components/SelectField';
import { SubmitButton } from '../components/SubmitButton';
import { Link, useNavigate } from 'react-router-dom';

export const StudentRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    navigate('/warname', { state: { ...data } });
  };
  return (
    <div className='flex flex-col justify-center items-center px-4 w-full sm:w-[500px] mx-auto mt-5'>
      <div className='w-[180px] mb-14'>
        <img src={logo} alt="logo da +prati" className='w-full' />
      </div>
      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name='name'
          type='text'
          placeholder='Nome Completo'
          label="Nome Completo *"
          register={register}
          error={errors.name?.message}
          validation={{
            required: 'Nome de usuário é obrigatório'
          }}
        />
        <InputField
          name="email"
          type="email"
          placeholder="E-mail"
          label="E-mail *"
          register={register}
          error={errors.email?.message}
          validation={{
            required: "Email é obrigatório",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              message: "Email inválido",
            },
          }}
        />
        <InputField
          name="password"
          type="password"
          placeholder="Senha"
          label="Senha *"
          register={register}
          error={errors.password?.message}
          validation={{
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres",
            },
          }}
        />

        <InputField
          name="whatsapp"
          type="tel"
          placeholder="Digite apenas números"
          label="WhatsApp *"
          register={register}
          error={errors.whatsapp?.message}
          validation={{
            required: "WhatsApp é obrigatório",
            pattern: {
              value: /^\d{10,11}$/,
              message: "Digite apenas números, ex: 11999999999",
            },
          }}
        />

        <SelectField
          name="turma"
          label="Turma"
          register={register}
          error={errors.turma}
          required={true}
          options={[
            { value: "T1", label: "T1" },
            { value: "T2", label: "T2" }
          ]}
        />

        <InputField
          name="hasGroup"
          type="radio"
          label="Já possui grupo? *"
          register={register}
          error={errors.hasGroup?.message}
          validation={{
            required: "Selecione uma opção"
          }}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" }
          ]}
        />

        <InputField
          name="wantsGroup"
          type="radio"
          label="Deseja trabalhar em grupo? *"
          register={register}
          error={errors.wantsGroup?.message}
          validation={{
            required: "Selecione uma opção"
          }}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não, prefiro trabalhar sozinho" }
          ]}
        />
        <InputField
          name="type"
          type="hidden"
          value="student"
          register={register}
        />
        <SubmitButton label='Registrar' />
        <Link to="/login" className="text-center text-sm text-red-primary font-bold hover:text-red-secondary mt-5 block">Já tem conta? Acesse aqui</Link>
      </form>
    </div>
  )
};
