import { Link } from 'react-router-dom'
import logo from '../assets/images/logo+prati.png'
import { MenuDesktop } from './MenuDesktop'
import { MenuMobile } from './MenuMobile'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  return (
    <header className='h-[80px] md:h-[100px] w-screen flex items-center justify-between px-[25px] lg:px-[50px] xl:px-[100px] m-auto shadow-lg'>
      <Link to='/' className='flex items-center'>
        <div className='w-[90px] md:w-[100px]'>
          <img className='w-full' src={logo} alt="Logo" />
        </div>
      </Link>
      <div className='flex items-center gap-1 md:gap-10'>
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
