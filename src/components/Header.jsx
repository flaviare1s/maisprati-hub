import { Link } from 'react-router-dom'
import logo from '../assets/images/logo_conectavida.png'
import { MenuDesktop } from './MenuDesktop'
import { MenuMobile } from './MenuMobile'

export const Header = () => {
  return (
    <header className='h-[100px] flex items-center justify-between px-[35px] lg:w-[90%] m-auto'>
      <Link to='/' className='flex items-center'>
        <div className='w-[70px]'>
          <img className='w-full' src={logo} alt="Logo" />
        </div>
        <h1 className='font-inter text-2xl font-bold text-blue-logo hidden md:block'>Conecta<span className='text-red-logo'>Vida</span></h1>
      </Link>
      <div className='hidden md:block'>
        <MenuDesktop />
      </div>
      <div className='block md:hidden'>
        <MenuMobile />
      </div>
    </header>
  )
}
