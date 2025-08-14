import { FaqItem } from "../components/FaqItem"
import { SectionTitle } from "../components/SectionTitle"
import { Testimonials } from "../components/Testimonials"

export const FAQ = () => {
  return (
    <div className="flex flex-col mx-auto p-5 w-full">
      <div className="flex flex-col justify-center items-center">
        <SectionTitle title="Dúvidas" />
        <div className="mb-10">
          <FaqItem question="EXEMPLO: Qual a idade mínima para doar sangue?" answer="18 anos" />
          <FaqItem question="EXEMPLO: Qual o peso mínimo para doar sangue?" answer="50kg" />
          <FaqItem question="EXEMPLO: Tem alguma contraindicação para doar sangue?" answer="Sim. Algumas doenças podem impedir a doação de sangue" />
        </div>
        <SectionTitle title="Agradecimentos" />
      </div>
      <div className="">
        <Testimonials />
      </div>
    </div>
  )
}
