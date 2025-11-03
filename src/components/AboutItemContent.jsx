export const AboutItemContent = ({ title, description }) => {
  return (
    <div className="bg-bg-card p-10 h-full flex flex-col justify-center items-start" data-testid="about-item-content">
      <h2 className="text-xl md:text-[30px] lg:text-[40px] text-blue-logo font-bold mb-2" data-testid="content-title">{ title }</h2>
      <p className="text-gray-muted font-semibold md:text-lg lg:text-xl" data-testid="content-description">{ description }</p>
    </div>
  )
}
