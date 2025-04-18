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
        <img src="/assess/icon/Bg-1.svg" alt="Online Learning" class="top-0 left-0 absolute z-0 lg:block hidden" />
        <img src="/assess/icon/Bg-2.svg" alt="Online Learning"
            class="right-20 absolute z-0 rotate-90 lg:block hidden" />

        <!-- Swiper Container -->
        <div class="bg-secondary">
            <div class="w-full mt-28  max-w-[1700px] mx-auto relative" style="top: -80px;">
                <Swiper :modules="[Navigation, Pagination]" :space-between="16" :centeredSlides="true" :initialSlide="4"
                    :breakpoints="{
                        320: { slidesPerView: 1 },
                        480: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1380: { slidesPerView: 5 }
                    }" :pagination="{ clickable: true }">
                    <SwiperSlide class="flex justify-center" v-for="(teacher, index) in teachers" :key="index"
                        style="padding: 20px;">
                        <div class="card bg-white rounded-xl shadow-md p-4 min-w-[280px] h-full relative"
                            style="box-shadow: 0px 0px 8px 0 rgba(0,0,0,0.25); background-color: white;">
                            <div class="avatar mx-auto mt-2">
                                <div
                                    class="ring-neutral-content ring-offset-base-100 w-full rounded-full ring ring-offset-2">
                                    <img :src="teacher.image" :alt="teacher.name" loading="lazy"
                                        class="w-full h-full object-cover rounded-full"
                                        style="width: 200px; height: 200px;"
                                        @error="(e) => e.target.src = './assess/img/default-teacher.jpg'" />
                                </div>
                            </div>
                            <div style="position: relative; margin-top: 15px; margin-bottom: 5px;">
                                <div class="flex flex-wrap gap-2 absolute -top-2 right-0">
                                    <span v-for="sub in teacher.subjects" :key="sub"
                                        class="px-3 py-1 rounded-full text-sm font-medium transform-gpu transition-all duration-300 
                                hover:scale-110 hover:-translate-y-1 hover:rotate-2 relative overflow-hidden group/badge" :style="{
                                    backgroundColor: `${teacher.color}15`,
                                    color: teacher.color,
                                    border: `1px solid ${teacher.color}30`,
                                    boxShadow: `0 2px 4px ${teacher.color}10`
                                }">
                                        <!-- Badge shine effect -->
                                        <div class="absolute inset-0 w-full h-full shine-effect"></div>
                                        {{ sub }}
                                    </span>
                                </div>
                                <h2 class="text-primary text-lg mt-6 font-bold mb-1">{{ teacher.name }}</h2>
                            </div>
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
        subjects: ["تاريخ", "جغرافية", "اقتصاد"],
        image: "./assess/img/الأستاذ محسن أسماعيل _ تاريخ _ جغرافية _ اقتصاد.jpg",
        color: "#FF6347"
    },
    {
        name: "الاستاذ حسنين اللامي",
        subjects: ["كيمياء"],
        image: "./assess/img/الأستاذ  حسنين اللامي _ كيمياء.jpg",
        color: "#1E90FF"
    },
    {
        name: "الاستاذ كرار خضير العامري",
        subjects: ["اللغة الانكليزية"],
        image: "./assess/img/الأستاذ  كرار خضير العامري _ اللغة الانكليزية.jpg",
        color: "#8A2BE2"
    },
    {
        name: "الاستاذة فاطمة الموسوي",
        subjects: ["اللغة العربية"],
        image: "./assess/img/الأستاذة فاطمة الموسوي _ اللغة العربية .jpg",
        color: "#FF4500"
    },
    {
        name: "الاستاذ جودت نجدت",
        subjects: ["رياضيات"],
        image: "./assess/img/الأستاذ جودت نجدت _ رياضيات.jpg",
        color: "#DA70D6"
    },
    {
        name: "الاستاذ عامر عدنان الجبوري",
        subjects: ["فيزياء"],
        image: "./assess/img/الأستاذ عامرعدنان الجبوري _ فيزياء.jpg",
        color: "#00CED1"
    },
    {
        name: "الاستاذة مريم الربيعي",
        subjects: ["الإسلامية"],
        image: "./assess/img/الأستاذة مريم الربيعي _ الاسلامية.jpg",
        color: "#0FD794"
    },
    {
        name: "الاستاذة مريم الربيعي",
        subjects: ["احياء"],
        image: "./assess/img/الأستاذة فرح عباس _ احياء.jpg",
        color: "#FF1493"
    }
])

const handleImageError = (e) => {
    // Fallback to a default image if loading fails
    e.target.src = '/assess/img/default-teacher.jpg'
}

// Bildpfad-Überprüfung
const verifyImagePath = (path) => {
    const img = new Image()
    img.src = path
    return new Promise((resolve) => {
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
    })
}

// Komponente mounted Hook
onMounted(async () => {
    for (const teacher of teachers.value) {
        const isValid = await verifyImagePath(teacher.image)
        if (!isValid) {
            console.error(`Bild konnte nicht geladen werden: ${teacher.image}`)
        }
    }
})
</script>
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
    margin-bottom: -10px;
    /* Abstand nach oben */
}
</style>