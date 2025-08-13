import { Link } from 'react-router-dom'
import logo from '../assets/images/logo_conectavida.png'
import { MenuDesktop } from './MenuDesktop'
import { MenuMobile } from './MenuMobile'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  return (
    <header className='h-[100px] w-screen flex items-center justify-between px-[35px] lg:px-[50px] xl:px-[100px] m-auto shadow-lg'>
      <Link to='/' className='flex items-center'>
        <div className='w-[70px]'>
          <img className='w-full' src={logo} alt="Logo" />
        </div>
        <h1 className='font-inter text-2xl font-bold text-blue-logo hidden lg:block'>Conecta<span className='text-red-logo'>Vida</span></h1>
      </Link>
      <div className='flex items-center gap-4 md:gap-10'>
        <div className='hidden md:block'>
          <MenuDesktop />
        </div>
        <div className='block md:hidden'>
          <MenuMobile />
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
