import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { InputField } from '../components/InputField';
import { SelectField } from '../components/SelectField';
import { SubmitButton } from '../components/SubmitButton';

export const StudentRegister = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const socialName = params.get("name");
  const socialEmail = params.get("email");

  useEffect(() => {
    if (socialName) setValue("name", socialName);
    if (socialEmail) setValue("email", socialEmail);
  }, [socialName, socialEmail, setValue]);

  const onSubmit = async (data) => {
    // converte para boolean
    data.hasGroup = data.hasGroup === "sim";
    data.wantsGroup = data.wantsGroup === "sim";

    // envia state para página de registro
    navigate("/warname", { state: { ...data } });
  };
  return (
    <div className='flex flex-col justify-center items-center px-4 w-full sm:w-[500px] mx-auto mt-5'>
      <div className='w-[180px]'>
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
          disabled={Boolean(socialEmail)}
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
          disabled={Boolean(socialEmail)}
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
          name="groupClass"
          label="Turma"
          register={register}
          error={errors.groupClass}
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
          value="STUDENT"
          register={register}
        />
        <SubmitButton label='Registrar' />
        <Link to="/login" className="text-center text-sm text-red-primary font-bold hover:text-red-secondary mt-5 block">Já tem conta? Acesse aqui</Link>
      </form>
    </div>
  );
};
