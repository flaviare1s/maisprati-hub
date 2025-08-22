import { CiUser } from "react-icons/ci";
import { PiUsersFourBold } from "react-icons/pi";
import { TbListDetails, TbTimelineEvent } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";
import { CgTrack } from "react-icons/cg";
import { FaqItem } from "../components/FaqItem"
import { SectionTitle } from "../components/SectionTitle"

const faqData = [
  {
    id: 1,
    question: "Como os alunos participam?",
    icon: <CiUser className="text-2xl font-bold" />,
    answer: (
      <ul className="list-disc pl-6 space-y-2 font-bold faq">
        <li>Preenchendo um formulário com seus dados acadêmicos e preferências.</li>
        <li>Informando disponibilidade e principais habilidades.</li>
        <li>Esses dados ajudam o professor a formar grupos equilibrados.</li>
      </ul>
    )
  },
  {
    id: 2,
    question: "Como os grupos são montados?",
    icon: <PiUsersFourBold className="text-2xl font-bold" />,
    answer: (
      <ul className="list-disc pl-6 space-y-2 font-bold faq">
        <li>O professor recebe as informações dos alunos.</li>
        <li>O app sugere combinações de grupos baseadas em perfis.</li>
        <li>O professor pode ajustar manualmente antes de confirmar.</li>
      </ul>
    )
  },
  {
    id: 3,
    question: "O que os alunos conseguem acompanhar?",
    icon: <CgTrack className="text-2xl font-bold" />,
    answer: (
      <ul className="list-disc pl-6 space-y-2 font-bold faq">
        <li>O status do projeto em tempo real.</li>
        <li>As tarefas atribuídas ao grupo.</li>
        <li>Os prazos definidos pelo professor.</li>
      </ul>
    )
  },
  {
    id: 4,
    question: "E os professores, o que conseguem ver?",
    icon: <TbListDetails className="text-2xl font-bold" />,
    answer: (
      <ul className="list-disc pl-6 space-y-2 font-bold faq">
        <li>Todos os grupos formados e seus integrantes.</li>
        <li>O progresso de cada projeto.</li>
        <li>Quais grupos estão atrasados ou em dia.</li>
      </ul>
    )
  },
  {
    id: 5,
    question: "Como funciona a gestão de prazos?",
    icon: <MdAccessTime className="text-2xl font-bold" />,
    answer: (
      <ul className="list-disc pl-6 space-y-2 font-bold faq">
        <li>O professor define marcos importantes para cada projeto.</li>
        <li>O app envia lembretes de entrega.</li>
        <li>Os alunos podem visualizar todas as datas em um só painel.</li>
      </ul>
    )
  },
  {
    id: 6,
    question: "O app ajuda na avaliação dos trabalhos?",
    icon: <FaClipboardCheck className="text-2xl font-bold" />,
    answer: (
      <ul className="list-disc pl-6 space-y-2 font-bold faq">
        <li>Sim, permite registrar observações sobre cada grupo.</li>
        <li>Facilita a organização dos critérios de avaliação.</li>
        <li>Histórico das entregas fica armazenado para consulta.</li>
      </ul>
    )
  }
];

export const FAQ = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <SectionTitle title="Dúvidas" />
      <div className="mb-10 w-full md:w-2/3 px-5 pt-3">
        {faqData.map(item => (
          <FaqItem key={item.id} question={item.question} answer={item.answer} icon={item.icon} />
        ))}
      </div>
    </div>
  );
}
