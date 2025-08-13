import chatIcon from '../assets/images/chat-icon.png'

export const ChatButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className='w-[55px] cursor-pointer bg-bg-menu-mobile hover:bg-bg-btn-menu-mobile rounded-full flex items-center justify-center'>
      <img src={chatIcon} alt="Ícone do chat" />
    </button>
  )
}
