export const Testimonial = ({ img, name, description }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-bg-card rounded-2xl mb-2 w-full">
      <div className="w-[100px] md:w-[150px] flex-shrink-0">
        <img className="w-full" src={img} alt={name} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-3">{name}</h3>
        <p className="italic font-open-sans">{description}</p>
      </div>
    </div>
  )
}
