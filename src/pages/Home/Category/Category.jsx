import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import slide1 from "../../../assets/home/01.jpg";
import slide2 from "../../../assets/home/02.jpg";
import slide3 from "../../../assets/home/03.png";
import slide4 from "../../../assets/home/04.jpg";
import slide5 from "../../../assets/home/05.png";
import slide6 from "../../../assets/home/06.png";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
const Category = () => {
  return (
    <section>
      <SectionTitle subHeading={"FROM 11.00 to 4.00"} heading={"Order Online"}/>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={slide1} alt="slide image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide2} alt="slide image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide3} alt="slide image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide4} alt="slide image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide5} alt="slide image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide6} alt="slide image" />
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Category;
