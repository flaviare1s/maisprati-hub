import { AboutItemContent } from "../components/AboutItemContent"
import { AboutItemImg } from "../components/AboutItemImg"
import img1 from "../assets/images/about-img1.png"
import img2 from "../assets/images/about-img2.png"
import img3 from "../assets/images/about-img3.png"

export const About = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-screen gap-[5px] bg-light py-[5px] about">
      <AboutItemImg img={img1} alt="Imagem de pessoas conectadas" />
      <AboutItemContent
        title="Sobre o +Prati Hub"
        description="O +Prati Hub foi desenvolvido para facilitar a organização dos trabalhos finais, conectando professores e alunos em um só lugar."
      />

      <div className="md:order-4">
        <AboutItemImg img={img2} alt="Imagem de formulário digital sendo preenchido" />
      </div>
      <AboutItemContent
        title="Como Funciona"
        description="Os alunos preenchem um formulário com seu perfil. O professor, com base nessas informações, consegue montar os grupos de forma equilibrada e eficiente."
      />

      <AboutItemImg img={img3} alt="Imagem de dashboard de acompanhamento de projetos" />
      <div className="md:order-5">
        <AboutItemContent
          title="Acompanhamento"
          description="O app permite que alunos e professores acompanhem o andamento de cada projeto, garantindo organização e transparência em todas as etapas."
        />
      </div>
    </div>
  )
}

