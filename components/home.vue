<template>
  <section style="color: azure;">
    <div class="w-full h-fit pb-52 bg-primary rounded-br-[600px]">
      <div class="container mx-auto flex justify-between w-full pt-40 px-4">
        <div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1" style="line-height: unset !important">
            أصبح التعلم عبر الإنترنت
          </h1>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style="line-height: unset !important">
            <span class="text-secondary"> أسهل </span>
            بكثير الآن
          </h1>
          <ul class="space-y-4 list-disc pr-6">
            <li class="text-lg">تعلم من أفضل الأساتذة في العراق </li>
            <li class="text-lg">شرح مبسط وشامل لكل تفاصيل المادة</li>
            <li class="text-lg">متابعة مستمرة ودعم متكامل بإشراف الخبراء</li>
          </ul>
          <div class="mt-4 flex gap-4">
            <NuxtLink to="/my-courses" class="btn btn-secondary rounded-[20px] mt-4 shadow-md"
              style="color: #000; font-weight: normal;"> الدورات التعليمية</NuxtLink>
            <NuxtLink to="/auth" class="btn  rounded-[20px] mt-4 shadow-md" style="color: #000; font-weight: normal;">
              دخول إلى حسابي</NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 p-8 relative max-w-7xl mx-auto [perspective:1000px]">
          <TransitionGroup name="teacher-fade">
            <div v-for="(teacher, index) in visibleTeachers" :key="teacher.name + teacher.subject"
              class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform-gpu relative group"
              :class="[
                index === 0 ? '' : '',
                index === 1 ? 'translate-y-8' : '',
                index === 2 ? '-translate-y-8' : ''
              ]">
              <img :src="teacher.image" :alt="teacher.name"
                class="w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105">
              <div class="p-5 flex flex-col items-start gap-2 bg-white/95 border-t border-gray-100 relative">
                <span class="absolute right-4 top-5 text-sm" :style="{ color: teacher.color }">▮</span>
                <h3 class="text-lg font-semibold text-gray-800">{{ teacher.name }}</h3>
                <p class="text-sm text-gray-600">{{ teacher.subject }}</p>
              </div>
            </div>
          </TransitionGroup>

          <!-- Background decorations -->
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-[#5B6EF5] rounded-full -z-10 blur"></div>
          <div class="absolute -bottom-8 -left-8 w-36 h-36 bg-[#FFB74D] rounded-full -z-10 blur"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const teachers = ref([
  {
    name: "الاستاذ محسن اسماعيل",
    subject: "تاريخ وجغرافية واقتصاد",
    image: "/assess/img/الأستاذ محسن أسماعيل _ تاريخ _ جغرافية _ اقتصاد.jpg",
    color: "#FF6347"
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
    name: "الاستاذة مريم الربيعي",
    subject: "الإسلامية",
    image: "/assess/img/الأستاذة مريم الربيعي _ الاسلامية.jpg",
    color: "#0FD794"
  }
])

const visibleTeachers = ref([])
let currentIndex = 0
let intervalId = null

const rotateTeachers = () => {
  visibleTeachers.value = [
    teachers.value[currentIndex % teachers.value.length],
    teachers.value[(currentIndex + 1) % teachers.value.length],
    teachers.value[(currentIndex + 2) % teachers.value.length]
  ]
  currentIndex = (currentIndex + 1) % teachers.value.length
}

onMounted(() => {
  rotateTeachers() // Initial display
  intervalId = setInterval(rotateTeachers, 3000) // Rotate every 2 seconds
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.teacher-fade-move,
.teacher-fade-enter-active,
.teacher-fade-leave-active {
  transition: all 0.8s ease;
}

.teacher-fade-enter-from,
.teacher-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.teacher-fade-leave-active {
  position: absolute;
}

@media (max-width: 768px) {
  .transform-gpu {
    transform: none !important;
  }
}
</style>
