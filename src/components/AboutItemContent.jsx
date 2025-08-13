export const AboutItemContent = ({ title, description }) => {
  return (
    <div className="bg-bg-card px-10 py-14 h-full">
      <h2 className="text-2xl md:text-[40px] text-red-logo font-bold mb-2">{ title }</h2>
      <p className="text-gray-muted font-semibold md:text-2xl">{ description }</p>
    </div>
  )
}
