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
              name="Maria Conceição."
              description="“O aplicativo facilitou a formação dos grupos e deixou tudo muito mais organizado durante o projeto.”"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Testimonial
              img={person2}
              name="Pedro Cornelho."
              description="“Conseguimos acompanhar cada etapa do trabalho sem confusão. Isso ajudou todo o grupo a se manter focado.”"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Testimonial
              img={person3}
              name="Debora Pereira."
              description="“Como professora, pude visualizar rapidamente o andamento de cada grupo e orientar melhor os alunos.”"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Testimonial
              img={person4}
              name="Luciano Costa."
              description="“O sistema trouxe clareza no acompanhamento dos prazos e facilitou a comunicação entre todos.”"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};
