import Modal from "react-modal"
import chatIcon from '../assets/images/chat-icon.png'

export const ChatBox = ({ isOpen, setIsOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      overlayClassName="fixed inset-0 bg-[#00000053] flex justify-center items-center z-50 md:justify-end md:items-end md:mb-[-20px]"
      className="p-4 rounded-lg shadow-lg w-[90%] max-w-md outline-none"
    >
      <div className="flex flex-col border-b mb-4 h-[80vh] bg-light rounded-2xl">
        <header className="text-base md:text-lg font-bold bg-blue-logo w-full h-[60px] rounded-t-2xl text-white text-center py-2 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img className="w-[40px]" src={chatIcon} alt="Ícone do chat" />
            <h2 className="text-center">ConectaBot: <span className="font-normal">Assistente Virtual</span></h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-dark hover:text-gray-muted border-2 border-dark w-6 h-6 flex items-center justify-center hover:border-gray-muted cursor-pointer"
          >
            ✕
          </button>
        </header>
        <main className="p-5 chatbot h-full rounded-b-2xl">
          Desenvolvimento do ConectaBot aqui
        </main>
      </div>
    </Modal>
  )
}
