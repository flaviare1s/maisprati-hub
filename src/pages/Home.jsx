import { Link } from 'react-router-dom'
import banner from '../assets/images/banner.png'

export const Home = () => {
  return (
    <div className="bg-blue-logo text-light h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center relative">
      <div className='absolute top-0 left-0 w-full h-full bg-[#00000056] z-10'></div>
      <div className='flex flex-col items-center'>
        <h2 className='absolute top-0 left-0 lg:left-[200px] text-4xl sm:text-5xl lg:text-5xl xl:text-7xl font-bold max-w-[220px] m-10 sm:max-w-[300px] lg:max-w-[700px] leading-[50px] sm:leading-[80px] lg:leading-[100px] z-20'>Conexão Inteligente. Projetos Perfeitos.</h2>
        <div className='absolute top-1/2 right-[-100px] md:right-0 xl:right-[-260px] transform -translate-y-1/2 z-20 lg:w-[600px] 2xl:w-[700px]'>
          <img className='w-full' src={banner} alt="Coração ligado à bolsa de sangue" />
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 z-40 mt-[300px]'>
        <Link to='/login' className="uppercase font-lg text-blue-logo bg-orange-logo py-2 w-[250px] rounded-full text-center font-bold hover:bg-orange-500" >Já tenho cadastro</Link>
        <Link to='/register' className="uppercase font-lg text-blue-logo bg-orange-logo py-2 w-[250px] rounded-full text-center font-bold hover:bg-orange-500" >Quero me cadastrar</Link>
      </div>
    </div>
  )
}
