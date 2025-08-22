import { Link } from "react-router-dom"

export const MenuDesktop = ({ user, onLogout }) => {
  return (
    <nav className="flex items-center gap-4 md:gap-8 lg:gap-10">
      {!user && <Link to='/' className='uppercase font-lg text-blue-logo font-bold link-nav'>Home</Link>}
      {!user && <Link to='/about' className='uppercase font-lg text-blue-logo font-bold link-nav'>Sobre</Link>}
      {!user &&<Link to='/faq' className='uppercase font-lg text-blue-logo font-bold link-nav'>Faq</Link>}
      {!user && <Link to='/register' className="uppercase font-lg text-light font-bold bg-orange-logo hover:bg-orange-400 py-2 px-6 rounded-lg" >Cadastrar</Link>}
      {user && <Link to='/dashboard' className='uppercase font-lg text-blue-logo font-bold link-nav' >Dashboard</Link>}
      {user && <Link to='/common-room' className='uppercase font-lg text-blue-logo font-bold link-nav' >Taverna dos Heróis</Link>}
      {!user ? <Link to='/login' className="uppercase font-lg text-light font-bold bg-blue-logo py-2 px-6 rounded-lg hover:bg-blue-600">Entrar</Link> : <button onClick={onLogout} className="uppercase font-lg text-light font-bold bg-blue-logo hover:bg-blue-600 py-2 px-6 rounded-lg cursor-pointer">LOGOUT</button>}
    </nav>
  )
}
