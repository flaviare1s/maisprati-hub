import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'
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

  const handleLogout = () => {
    logout({ skipServer: false });
  };

  return (
    <header className='h-[80px] md:h-[100px] w-full flex items-center justify-between px-[25px] lg:px-[50px] xl:px-[100px] shadow-lg'>
      <Link to={getRedirectPath()} className='flex items-center'>
        <div className='w-[140px] md:w-[160px] lg:w-[180px]'>
          <img className='w-full' src={logo} alt="Logo" />
        </div>
      </Link>
      <div className='flex items-center gap-1 md:gap-10'>
        <div className='hidden md:block'>
          {user ? (
            <MenuDesktop user={user} onLogout={handleLogout} />
          ) : (
            <MenuDesktop user={null} onLogout={handleLogout} />
          )}
        </div>
        <div className='md:hidden'>
          <MenuMobile user={user} onLogout={handleLogout} />
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
