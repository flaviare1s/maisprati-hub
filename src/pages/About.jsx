import { AboutItemContent } from "../components/AboutItemContent"
import { AboutItemImg } from "../components/AboutItemImg"
import img1 from "../assets/images/about-img1.png"
import img2 from "../assets/images/about-img2.png"
import img3 from "../assets/images/about-img3.png"

export const About = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-screen gap-[5px] bg-light py-[5px] about">
      <AboutItemImg img={img1} alt="Imagem de uma pessoa doando sangue" />
      <AboutItemContent title="Sobre o ConectaVida" description="ConectaVida é um aplicativo que veio para ajudar as instituições e hemocentros para se conectar com você!" />
      <div className="md:order-4">
        <AboutItemImg img={img2} alt="Imagem do mapa do Brasil e mãos de pessoas segurando um coração" />
      </div>
      <AboutItemContent title="Como Funciona" description="O doador coloca seu CEP e após isso o aplicativo te direciona a instituição/hemocentro mais próximo para que você possa doar." />
      <AboutItemImg img={img3} alt="Imagem de uma pessoa após doar sangue" />
      <div className="md:order-5">
        <AboutItemContent title="Doação" description="Agende sua doação no horario e data que é melhor para voce. Doe e ajude um pessoa que precise do seu sangue! " />
      </div>
    </div>
    
  )
}
