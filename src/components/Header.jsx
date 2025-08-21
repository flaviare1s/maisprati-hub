import { Link } from 'react-router-dom'
import logo from '../assets/images/logo+prati.png'
import { MenuDesktop } from './MenuDesktop'
import { MenuMobile } from './MenuMobile'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'

export const Header = () => {
  const { user, logout } = useAuth();

  const getRedirectPath = () => {
    if (user) {
      return "/dashboard";
    }
    return "/";
  };

  return (
    <header className='h-[80px] md:h-[100px] w-full flex items-center justify-between px-[25px] lg:px-[50px] xl:px-[100px] shadow-lg'>
      <Link to={getRedirectPath()} className='flex items-center'>
        <div className='w-[90px] md:w-[100px]'>
          <img className='w-full' src={logo} alt="Logo" />
        </div>
      </Link>
      <div className='flex items-center gap-1 md:gap-10'>
        <div className='hidden md:block'>
          {user ? (
            <MenuDesktop user={user} onLogout={logout} />
          ) : (
            <MenuDesktop user={null} onLogout={logout} />
          )}
        </div>
        {!user &&
        <div className='block md:hidden'>
          <MenuMobile user={user} />
        </div>}
        {user &&
        <div className='block md:hidden'>
          <button onClick={logout} className="uppercase font-lg text-light font-bold bg-blue-logo hover:text-orange-logo py-2 px-6 rounded-lg cursor-pointer">LOGOUT</button>
        </div>}
        <ThemeToggle />
      </div>
    </header>
  )
}
