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
                :initialSlide="3"

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
                    <div class="card bg-white rounded-xl shadow-md p-4 min-w-[200px] h-full"  
                         style=" box-shadow: 0px 0px 8px 0 rgba(0,0,0,0.25); background-color: white;" >
                        <div class="avatar mx-auto mt-2">
                            <div class="ring-neutral-content ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
                                <img :src="teacher.image" />
                            </div>
                        </div>
                        <h2 class="text-primary text-base mt-6 font-bold mb-1">{{ teacher.name }}</h2>
                        <div class="badge badge-primary">{{ teacher.subject }}</div>
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
        name: 'أحمد علي',
        subject: 'الرياضيات',
        image: 'test-img.jpg',
    },
    {
        name: 'محمد علي',
        subject: 'الفيزياء',
        image: 'https://img.freepik.com/fotos-kostenlos/portrait-des-weissen-mannes-getrennt_53876-40306.jpg?t=st=1741703450~exp=1741707050~hmac=e6ec7b79085f069f5670d169a1f66990f7a2d734b2b8c1cc800db4921496ca24&w=900',
    },
    {
        name: 'علي علي',
        subject: 'الكيمياء',
        image: 'https://img.freepik.com/fotos-kostenlos/portrait-des-weissen-mannes-getrennt_53876-40306.jpg?t=st=1741703450~exp=1741707050~hmac=e6ec7b79085f069f5670d169a1f66990f7a2d734b2b8c1cc800db4921496ca24&w=900',
    },
    {
        name: 'محمد محمد',
        subject: 'اللغة العربية',
        image: 'https://img.freepik.com/fotos-kostenlos/portrait-des-weissen-mannes-getrennt_53876-40306.jpg?t=st=1741703450~exp=1741707050~hmac=e6ec7b79085f069f5670d169a1f66990f7a2d734b2b8c1cc800db4921496ca24&w=900',
    },
    {
        name: 'أحمد محمد',
        subject: 'اللغة الإنكليزية',
        image: 'https://img.freepik.com/fotos-kostenlos/portrait-des-weissen-mannes-getrennt_53876-40306.jpg?t=st=1741703450~exp=1741707050~hmac=e6ec7b79085f069f5670d169a1f66990f7a2d734b2b8c1cc800db4921496ca24&w=900',

    },
    {
        name: 'علي أحمد',
        subject: 'التاريخ',
        image: 'https://img.freepik.com/fotos-kostenlos/portrait-des-weissen-mannes-getrennt_53876-40306.jpg?t=st=1741703450~exp=1741707050~hmac=e6ec7b79085f069f5670d169a1f66990f7a2d734b2b8c1cc800db4921496ca24&w=900',
    },
    {
        name: 'محمد أحمد',
        subject: 'الجغرافيا',
        image: 'https://img.freepik.com/fotos-kostenlos/portrait-des-weissen-mannes-getrennt_53876-40306.jpg?t=st=1741703450~exp=1741707050~hmac=e6ec7b79085f069f5670d169a1f66990f7a2d734b2b8c1cc800db4921496ca24&w=900',
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