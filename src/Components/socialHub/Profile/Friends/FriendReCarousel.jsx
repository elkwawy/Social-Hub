import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
export default function FriendReCarousel({
  items,
  CardComponent,
  message,
  handleFriendRequestAction,
}) {
  const validItems = items.filter(
    (item) => item.senderName && item.senderName.length > 0
  );
  if (!validItems || validItems.length === 0) {
    return <p className="text-gray-500 w-full text-center">{message}</p>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]} // إضافة الموديولات المطلوبة
      spaceBetween={24} // المسافة بين الشرائح
      slidesPerView={1} // عدد الشرائح المرئية في العرض
      autoplay={{ delay: 2000 }} // إعدادات التشغيل التلقائي
      breakpoints={{
        640: { slidesPerView: 2 }, // عرض شريحتين للشاشات الصغيرة
        1024: { slidesPerView: 3 }, // ثلاث شرائح للشاشات المتوسطة
        1280: { slidesPerView: 4 }, // أربع شرائح للشاشات الكبيرة
      }}
    >
      {validItems.map((item) => (
        <SwiperSlide key={item._id}>
          <CardComponent item={item} handleFriendRequestAction={handleFriendRequestAction} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
