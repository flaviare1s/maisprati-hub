import { CiUser } from "react-icons/ci";
import { PiUserCheckBold } from "react-icons/pi";
import { TbAlertTriangle } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";
import { FaBan, FaRegHospital } from "react-icons/fa";
import { CgBandAid } from "react-icons/cg";
import { FaqItem } from "../components/FaqItem"
import { SectionTitle } from "../components/SectionTitle"
import { Testimonials } from "../components/Testimonials"


const faqData = [
  {
    id: 1,
    question:"Quem pode doar?",
    icon: <PiUserCheckBold className="text-2xl font-bold"/>,
    answer: (
      <ul className="list-disc pl-6 text-gray-700 space-y-2 font-roboto font-bold">
        <li>Estar em boas condições de saúde.</li>
        <li>Pesar acima de 50 kg.</li>
        <li>Ter entre 16 e 69 anos (menores de 18 precisam estar acompanhados por um responsável).</li>
        <li> Pessoas acima de 60 anos só podem doar se já tiverem doado antes dessa idade. Homens: até 4 doações/ano (intervalo mínimo de 60 dias).</li>
        <li>Mulheres: até 3 doações/ano (intervalo mínimo de 90 dias).</li>
        <li>Apresentar documento original com foto emitido por órgão oficial.</li>
      </ul>
    )
  },
  {
    id: 2,
    question: "O que fazer no dia da doação?",
    icon: <TbAlertTriangle className="text-2xl font-bold"/>,
    answer: (
      <ul className="list-disc pl-6 text-gray-700 space-y-2 font-roboto font-bold">
        <li>Dormir pelo menos 6 horas nas últimas 24 horas</li>
        <li>Alimentar-se bem (evitar comida gordurosa nas 4 horas anteriores).</li>
        <li>Não beber álcool nas últimas 12 horas.</li>
        <li>Não fumar por 2 horas antes da doação.</li>
      </ul>
    )
  },
  {
    id: 3,
    question: "Quais são os impedimentos temporários para doar?",
    icon: <MdAccessTime className="text-2xl font-bold"/>,
    answer: (
      <ul className="list-disc pl-6 text-gray-700 space-y-2 font-roboto font-bold">
        <li>Gripe, resfriado ou febre: aguardar 15 dias após recuperação.</li>
        <li>Gravidez.</li>
        <li>Pós-parto: 90 dias (normal) ou 180 dias (cesariana).</li>
        <li>Amamentação: até 12 meses após o parto.</li>
        <li>Tatuagem/piercing: 6 meses (piercing na boca ou genital impede a doação).</li>
        <li>Endoscopia ou exames similares: 6 meses.</li>
        <li>Situações de risco para doenças sexualmente transmissíveis: aguardar 12 mese</li>
      </ul>
    )
  },
  {
    id: 4,
    question: "Quais são os impedimentos definitivos para doar? ",
    icon: <FaBan className="text-2xl font-bold"/>,
    answer: (
      <ul className="list-disc pl-6 text-gray-700 space-y-2 font-roboto font-bold">
        <li>Hepatite após os 11 anos de idade.</li>
        <li>Doenças transmissíveis pelo sangue: hepatite B/C, HIV/AIDS, HTLV I/II, Doença de Chagas.</li>
        <li>Uso de drogas ilícitas injetáveis.</li>
      </ul>
    )
  },
  {
    id: 5,
    question: "O que acontece com o sangue doado?",
    icon: <FaRegHospital className="text-2xl font-bold"/>,
    answer: (
      <ul className="list-disc pl-6 text-gray-700 space-y-2 font-roboto font-bold">
        <li>O sangue é processado, separado em componentes e enviado para pacientes que precisam, sempre com testes para garantir a segurança.</li>
      </ul>
    )
  },
  {
    id: 6,
    question: "Existe algum cuidado após a doação?",
    icon: <CgBandAid className="text-2xl font-bold"/>,
    answer: (
      <ul className="list-disc pl-6 text-gray-700 space-y-2 font-roboto font-bold">
        <li>Evitar esforço físico nas próximas 12 horas.</li>
        <li>Beber bastante líquido.</li>
        <li>Não fumar por 2 horas.</li>
        <li>Não ingerir álcool nas próximas 12 horas.</li>
      </ul>
    )
  }
];


export const FAQ = () => {
  return (
    <div className="flex flex-col mx-auto p-5 w-full">
      <div className="flex flex-col justify-center items-center">
        <SectionTitle title="Dúvidas" />
        <div className="mb-10 w-full md:w-2/3">
          {faqData.map(item => (
            <FaqItem key={item.id} question={item.question} answer={item.answer} icon={item.icon} />
          ))}
        </div>
        <SectionTitle title="Agradecimentos" />
      </div>
      <div className="w-full">
        <Testimonials />
      </div>
    </div>
  )
}