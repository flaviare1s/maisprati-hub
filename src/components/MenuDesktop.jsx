import { Link } from "react-router-dom"

export const MenuDesktop = () => {
  return (
    <nav className="flex items-center gap-6 lg:gap-10 font-roboto">
      <Link to='/' className='uppercase font-lg text-red-logo font-bold hover:text-red-secondary link-nav'>Home</Link>
      <Link to='/about' className='uppercase font-lg text-red-logo font-bold hover:text-red-secondary link-nav'>Sobre</Link>
      <Link to='/faq' className='uppercase font-lg text-red-logo font-bold hover:text-red-secondary link-nav'>Faq</Link>
      <Link to='/register' className="uppercase font-lg text-white bg-bg-menu-mobile hover:bg-bg-btn-menu-mobile py-2 px-6 rounded-lg" >Cadastrar</Link>
      <Link to='/login' className="uppercase font-lg text-white bg-red-logo hover:bg-red-secondary py-2 px-6 rounded-lg" >Entrar</Link>
    </nav>
  )
}
