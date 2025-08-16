import { Testimonial } from "./Testimonial";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import person1 from "../assets/images/person1.png";
import person2 from "../assets/images/person2.png";
import person3 from "../assets/images/person3.png";
import person4 from "../assets/images/person4.png";

export const Testimonials = () => {
  return (
    <section className="py-16 md:py-2">
      <div className="container mx-auto px-4 md:px-10">
        <Swiper
        className="!overflow-visible"
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          loop={false}
          navigation={true}
          breakpoints={{
            900: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1400: {
              slidesPerView: 3,
              spaceBetween: 24,
            }
          }}

        >
          <SwiperSlide>
            <Testimonial
              img={person1}
              name="Maria Conceição, 60 anos."
              description="“Graças a uma doação anônima, pude passar por minha cirurgia com segurança. Serei eternamente grata.”"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Testimonial
              img={person2}
              name="Pedro Cornelho, 5 anos."
              description="“Meu filho recebeu transfusões durante meu tratamento contra o câncer. Cada bolsa de sangue foi um novo fôlego de vida. ”"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Testimonial
              img={person3}
              name="Debora Pereira, 35 anos."
              description="“Tive um acidente de moto e precisei de sangue com urgência. Pessoas que eu nunca conheci me ajudaram.”"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Testimonial
              img={person4}
              name="Luciano Costa, 42 anos."
              description="“O sangue doado não salvou só a minha vida, mas também devolveu a esperança da minha familia”"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};
