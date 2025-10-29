import { FaLinkedin, FaInstagram, FaFacebook, FaDiscord } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="w-full  px-4 py-6 bg-blue-logo shadow border-t  border-[#eee] min-h-90 ">
      <div className=" mx-auto   grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 ">
        <section className="w-full">
        <img className="w-full rounded-lg max-h-30 mb-2 mt-10 max-w-3/4" src="\src\assets\images\logo-menu.png" alt="" />
        </section>
        <section className="w-full">
        <p className="mb-0.5 text-white mt-10 pl-2.5 pb-3 ml-20 font-bold">Instituição </p>
          <p  className="mb-2  ml-20 mt-5 text-white items-justify size-full max-w-3/4 ">Somos a +praTI, uma iniciativa da sociedade sem fins lucrativos, que busca    encontrar ecapacitar novos talentos da área de TI</p>
        </section>

        <section className="w-full">
          <p className="mb-0.5 text-white mt-10  pb-3 ml-22 font-bold">Menu</p>
          <ul className="mb-0.5 text-white mt-5  pb-3 ml-22" >
            <li><a href="/">Home</a></li>
            <li><a href="/about">Sobre</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </section>

        <section className="w-full mt-5 flex flex-auto pl-18 items-center  text-white ">
        <a className="p-3"  href="https://www.linkedin.com/company/maisprati/"><FaLinkedin size={32} /></a>
        <a className="p-3"  href="https://www.instagram.com/maisprati/"><FaInstagram size={32}/></a>
        <a className="p-3"  href="https://www.facebook.com/maispratioficial/?locale=pt_BR"><FaFacebook size={32}/></a>
        <a className="p-3"  href="https://www.facebook.com/maispratioficial/?locale=pt_BR"><FaDiscord size={32}/></a>

        </section>
      </div>
    </footer>
  )
}
