import { Link } from "react-router-dom"

export const MenuDesktop = () => {
  return (
    <nav className="flex items-center gap-4 md:gap-8 lg:gap-10">
      <Link to='/' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav'>Home</Link>
      <Link to='/about' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav'>Sobre</Link>
      <Link to='/faq' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav'>Faq</Link>
      <Link to='/register' className="uppercase font-lg text-blue-logo font-bold bg-orange-logo hover:bg-blue-logo hover:text-orange-logo py-2 px-6 rounded-lg" >Cadastrar</Link>
      <Link to='/login' className="uppercase font-lg text-orange-logo font-bold bg-blue-logo hover:bg-orange-logo hover:text-blue-logo py-2 px-6 rounded-lg" >Entrar</Link>
    </nav>
  )
}
