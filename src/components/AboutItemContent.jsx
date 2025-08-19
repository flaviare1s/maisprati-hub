export const AboutItemContent = ({ title, description }) => {
  return (
    <div className="bg-bg-card px-10 py-14 h-full flex flex-col justify-center items-start">
      <h2 className="text-xl md:text-[40px] text-blue-logo font-bold mb-2">{ title }</h2>
      <p className="text-gray-muted font-semibold md:text-xl">{ description }</p>
    </div>
  )
}
