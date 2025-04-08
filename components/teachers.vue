<template> 
    <section id="teachers" class="relative">
        <div class="w-full">
            <div class="container mx-auto w-full pt-20 px-4">
                <!-- Titelbereich unverändert -->
                <div class="flex justify-center text-center">
                    <div>
                        <h1 class="text-3xl text-primary sm:text-4xl lg:text-5xl font-bold mb-1"
                            style="line-height: unset !important">
                            أفضل الأساتذة في العراق
                        </h1>
                        <p class="text-lg mt-4 text-center">تعلم على يد نخبة من أفضل الأساتذة في العراق، بأسلوب مبسط
                            ودقيق يضمن لك فهمًا عميقًا لكل التفاصيل،<br> مع متابعة مستمرة ودعم متكامل </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hintergrundbilder -->
        <img src="/assess/icon/Bg-1.svg" alt="Online Learning" class="top-0 left-0 absolute z-0 md:block hidden" />
        <img src="/assess/icon/Bg-2.svg" alt="Online Learning" class="right-20 absolute z-0 rotate-90 md:block hidden" />

        <!-- Swiper Container -->
         <div class="bg-secondary">
        <div class="w-full mt-28  max-w-[1700px] mx-auto relative" style="top: -80px;">
            <Swiper
                :modules="[Navigation, Pagination]"
                :space-between="16"
                :centeredSlides="true"
                :initialSlide="4"

                :breakpoints="{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 2 },
                    700: { slidesPerView: 3 },
                    68: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1380: { slidesPerView: 7 }
                }"
                :pagination="{ clickable: true }"
            >
                <SwiperSlide  class="flex justify-center" v-for="(teacher, index) in teachers" :key="index" style="padding: 20px;">
                    <div class="card bg-white rounded-xl shadow-md p-4 min-w-[235px] h-full"  
                         style=" box-shadow: 0px 0px 8px 0 rgba(0,0,0,0.25); background-color: white;" >
                        <div class="avatar mx-auto mt-2">
                            <div class="ring-neutral-content ring-offset-base-100 w-45 rounded-full ring ring-offset-2">
                                <img :src="teacher.image" />
                            </div>
                        </div>
                        <h2 class="text-primary text-base mt-6 font-bold mb-1">{{ teacher.name }}</h2>
                        <div class="shadow-md badge border-none" :style="{ backgroundColor: teacher.color }">{{ teacher.subject }}</div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>

    </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const teachers = ref([
{
    name: "الاستاذ محسن اسماعيل",
    subject: "تاريخ",
    image: "/assess/img/الأستاذ محسن أسماعيل _ تاريخ _ جغرافية _ اقتصاد.jpg",
    color: "#FF6347"
  },
  {
      name: "الاستاذ محسن اسماعيل",
      subject: "اقتصاد",
      image: "/assess/img/الأستاذ محسن أسماعيل _ تاريخ _ جغرافية _ اقتصاد.jpg",
      color: "#32CD32"
    },
    {
        name: "الاستاذ حسنين اللامي",
        subject: "كيمياء",
    image: "/assess/img/الأستاذ  حسنين اللامي _ كيمياء.jpg",
    color: "#1E90FF"
  },
  {
    name: "الاستاذ كرار خضير العامري",
    subject: "اللغة الانكليزية",
    image: "/assess/img/الأستاذ  كرار خضير العامري _ اللغة الانكليزية.jpg",
    color: "#8A2BE2"
},
{
    name: "الاستاذة فاطمة الموسوي",
    subject: "اللغة العربية",
    image: "/assess/img/الأستاذة فاطمة الموسوي _ اللغة العربية .jpg",
    color: "#FF4500"
},
{
    name: "الاستاذ جودت نجدت",
    subject: "رياضيات",
    image: "/assess/img/الأستاذ جودت نجدت _ رياضيات.jpg",
    color: "#DA70D6"
},
{
    name: "الاستاذ عامر عدنان الجبوري",
    subject: "فيزياء",
    image: "/assess/img/الأستاذ عامرعدنان الجبوري _ فيزياء.jpg",
    color: "#00CED1"
  },
  {
    name: "لاستاذة مريم الربيعي",
    subject: "الإسلامية",
    image: "/assess/img/الأستاذة مريم الربيعي _ الاسلامية.jpg",
    color: "#0FD794"
},
{
    name: "الاستاذة فرح عباس",
    subject: "احياء",
    image: "/assess/img/الأستاذة فرح عباس _ احياء.jpg",
    color: "#FF1493"
},
{
  name: "الاستاذ محسن اسماعيل",
  subject: "جغرافيه",
  image: "/assess/img/الأستاذ محسن أسماعيل _ تاريخ _ جغرافية _ اقتصاد.jpg",
  color: "#FFD700"
},
]);</script>
<style scoped>
.swiper-slide {
    @apply flex justify-center items-center;
}

.swiper-wrapper {
    @apply lg:justify-center;
}

@media (min-width: 1024px) {
    .swiper-slide {
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .swiper-slide-active {
        transform: scale(1);
        z-index: 1;
    }
}

:deep(.swiper-pagination) {
    margin-bottom: -10px; /* Abstand nach oben */
}
</style>