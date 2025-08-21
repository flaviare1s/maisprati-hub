import { Link } from "react-router-dom"

export const MenuDesktop = ({ user, onLogout }) => {
  return (
    <nav className="flex items-center gap-4 md:gap-8 lg:gap-10">
      {!user && <Link to='/' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav'>Home</Link>}
      {!user && <Link to='/about' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav'>Sobre</Link>}
      {!user &&<Link to='/faq' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav'>Faq</Link>}
      {!user && <Link to='/register' className="uppercase font-lg text-light font-bold bg-orange-logo hover:text-blue-logo py-2 px-6 rounded-lg" >Cadastrar</Link>}
      {user && <Link to='/dashboard' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav' >Dashboard</Link>}
      {user && <Link to='/common-room' className='uppercase font-lg text-blue-logo font-bold hover:text-orange-logo link-nav' >Taverna dos Heróis</Link>}
      {user ? <Link to='/login' className="uppercase font-lg text-light font-bold bg-blue-logo hover:text-orange-logo py-2 px-6 rounded-lg">Entrar</Link> : <button onClick={onLogout} className="uppercase font-lg text-light font-bold bg-blue-logo hover:text-orange-logo py-2 px-6 rounded-lg cursor-pointer">LOGOUT</button>}
    </nav>
  )
}
