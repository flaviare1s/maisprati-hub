import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { PiUsersFourBold } from "react-icons/pi";
import { TbTimelineEvent, TbListDetails } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

// Título da Seção
const SectionTitle = ({ preTitle, title }) => (
  <div className="text-center mb-12">
    <h4 className="text-blue-600 font-semibold uppercase tracking-wide">
      {preTitle}
    </h4>
    <h2 className="text-3xl md:text-4xl font-bold mt-2">{title}</h2>
  </div>
);

// Item do FAQ
const FaqItem = ({ question, answer, icon }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border shadow-sm transition-all duration-300 ${
        open ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600 text-2xl">{icon}</span>
          <h3 className="font-semibold text-lg">{question}</h3>
        </div>
        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? "rotate-180 text-blue-600" : "rotate-0 text-gray-500"
          }`}
        />
      </button>
      {open && <div className="px-6 pb-4 text-gray-700">{answer}</div>}
    </div>
  );
};

const faqData = [
  {
    id: 1,
    question: "Como faço para participar?",
    icon: <CiUser />,
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Preencha o formulário com seus dados.</li>
        <li>Informe suas habilidades e disponibilidade.</li>
        <li>Essas informações ajudam o professor a formar grupos equilibrados.</li>
      </ul>
    ),
  },
  {
    id: 2,
    question: "Como são formados os grupos?",
    icon: <PiUsersFourBold />,
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>O professor o indicará para um grupo caso não participe de nenhum. Se você já pertencer a um, basta entrar no grupo com o código fornecido pelo líder ou pelo professor.</li>
        <li>O aplicativo criará um código de acesso aleatório ao qual apenas os membros do grupo terão acesso.</li>
        <li>Após criar seu perfil, caso não tenha um grupo, você pode ser convidado pelo líder de qualquer grupo e, assim, se juntar à guilda.</li>
        <li>Os critérios consideram habilidades, perfis e disponibilidade.</li>
        <li>O objetivo é garantir diversidade e equilíbrio nos trabalhos.</li>
      </ul>
    ),
  },
  {
    id: 3,
    question: "Como acompanho o progresso do grupo?",
    icon: <TbTimelineEvent />,
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>O app oferece um painel de progresso para cada grupo.</li>
        <li>Você pode visualizar etapas concluídas e pendentes.</li>
        <li>Voê pode marcar reuniões com seu professor.</li>
        <li>Professores também podem acompanhar o desempenho.</li>
      </ul>
    ),
  },
  {
    id: 4,
    question: "Qual o papel do professor?",
    icon: <TbListDetails />,
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>O professor define critérios de formação dos grupos.</li>
        <li>Acompanha o andamento dos trabalhos.</li>
        <li>Tem acesso a relatórios detalhados de participação.</li>
      </ul>
    ),
  },
  {
    id: 5,
    question: "Como funciona a gestão de prazos?",
    icon: <MdAccessTime />,
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>O app exibe um calendário com todos os prazos.</li>
        <li>Notificações alertam sobre datas próximas.</li>
        <li>Professores podem ajustar prazos conforme necessário.</li>
      </ul>
    ),
  },
  {
    id: 6,
    question: "O app auxilia na avaliação?",
    icon: <FaClipboardCheck />,
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Sim, há ferramentas de avaliação de participação.</li>
        <li>Os relatórios ajudam professores na nota final.</li>
        <li>Isso garante mais justiça no processo avaliativo.</li>
      </ul>
    ),
  },
];

export default function Faq() {
  return (
    <section className="py-16 bg-gray-50" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <SectionTitle preTitle="FAQ" title="Dúvidas Frequentes" />
        <div className="space-y-4">
          {faqData.map((item) => (
            <FaqItem key={item.id} {...item} />
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center mt-10">
          <p className="text-gray-700 mb-4">Ainda tem dúvidas?</p>
          <a
            href="#contato"
            className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Fale com a gente
          </a>
        </div>
      </div>
    </section>
  );
}
