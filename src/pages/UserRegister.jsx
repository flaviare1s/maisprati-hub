import { useForm } from 'react-hook-form';
import logo from '../assets/images/logo+prati.png'
import { InputField } from '../components/InputField';
import { SubmitButton } from '../components/SubmitButton';
import { Link, useNavigate } from 'react-router-dom';

export const UserRegister = () => {
  const navigate = useNavigate ()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = (data) => {  
    console.log (data)
    navigate ('/dashboard')
  }
  return (
    <div className='flex flex-col justify-center items-center m-auto'>
      <div className='w-[180px] mb-14'> 
        <img src={logo} alt="logo da +prati" className='w-full' />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField 
          name='username'
          type='text'
          placeholder='Username'
          register={register} 
          error= {errors.name?.message}
          validation={{
            required:'Nome de usuário é obrigatório'
          }}
        />
        <InputField
            name="email"
            type="email"
            placeholder="Email"
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
          <SubmitButton label='Registrar' />
          <Link to="/login" className="text-center text-sm text-blue-logo font-bold hover:text-orange-logo mt-5 block">Já tem conta? Acesse aqui</Link>
      </form>
    </div>
  )
};
