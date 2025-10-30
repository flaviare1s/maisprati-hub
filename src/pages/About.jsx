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
        title="Sobre o +praTiHub"
        description="O +praTiHub é a rede social que conecta alunos e professores em um único espaço. Criado para facilitar a organização dos trabalhos finais, ele centraliza a comunicação, o planejamento e o acompanhamento de projetos de forma simples e colaborativa."
      />

      <div className="md:order-4">
        <AboutItemImg img={img2} alt="Imagem de formulário digital sendo preenchido" />
      </div>
      <AboutItemContent
        title="Como Funciona"
        description="Os alunos se cadastram na plataforma e podem interagir com colegas, formar equipes, organizar o progresso do projeto e agendar reuniões sem complicação. Tudo pensado para que o foco esteja no aprendizado e na execução dos projetos."
      />

      <AboutItemImg img={img3} alt="Imagem de dashboard de acompanhamento de projetos" />
      <div className="md:order-5">
        <AboutItemContent
          title="Acompanhamento"
          description="Com o +praTiHub, professores e alunos têm acesso a um painel claro e prático do andamento de cada projeto. Assim, todos acompanham as etapas, prazos e entregas com transparência e muito mais organização."
        />
      </div>
    </div>
  )
}

