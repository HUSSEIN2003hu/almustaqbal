<template>
  <section style="color: azure;">
    <div class="w-full h-fit pb-20 md:pb-52 bg-primary rounded-br-[300px] md:rounded-br-[600px]">
      <div
        class="container mx-auto flex flex-col flex-wrap md:flex-row justify-center items-center md:justify-between  w-full pt-32 md:pt-40 px-4">
        <div class="mb-10 md:mb-0">
          <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold mb-1"
            style="line-height: unset !important; max-width: 595px; min-width: 300px;">
            أصبح التعلم عبر الإنترنت
          </h1>

          <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3" style="line-height: unset !important">
            <span class="text-secondary"> أسهل </span>
            بكثير الآن
          </h1>
          <ul class="space-y-3 md:space-y-4 list-disc pr-6">
            <li class="text-base md:text-lg">تعلم من أفضل الأساتذة في العراق </li>
            <li class="text-base md:text-lg">شرح مبسط وشامل لكل تفاصيل المادة</li>
            <li class="text-base md:text-lg">متابعة مستمرة ودعم متكامل بإشراف الخبراء</li>
          </ul>
          <div class="mt-4 flex flex-row gap-4">
            <NuxtLink to="/my-courses" class="btn btn-secondary rounded-[20px] mt-4 shadow-md text-center"
              style="color: #000; font-weight: normal;"> الدورات التدريسية</NuxtLink>

            <NuxtLink v-if="!userStore?.user" to="/auth" class="btn rounded-[20px] mt-4 shadow-md text-center"
              style="color: #000; font-weight: normal;">
              دخول إلى حسابي</NuxtLink>
          </div>
        </div>

        <div class="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 p-2 relative mx-auto [perspective:2000px] max-w-7xl">
          <TransitionGroup name="teacher-fade">
            <div v-for="(teacher, index) in visibleTeachers.slice(0, 2)" :key="teacher.name + teacher.subjects[0]"
              class="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out transform-gpu group relative"
              :style="{
                transform: 'rotate3d(.5,-.866,0,15deg) rotate(1deg)',
                boxShadow: '2em 4em 6em -2em rgba(0,0,0,.5), 1em 2em 3.5em -2.5em rgba(0,0,0,.5)',
                borderRadius: '.5em',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                width: 'fit-content',
                height: 'fit-content',
              }">
              <div class="absolute inset-0 bg-gradient-to-r" :style="{
                background: `linear-gradient(105deg, 
                    ${teacher.color}15 0%, 
                    transparent 35%,
                    transparent 65%,
                    ${teacher.color}15 100%)`,
                opacity: cards[index]?.hover ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }">
              </div>
              <div class="card-content relative transform-gpu transition-transform duration-300"
                :style="cards[index]?.transform">
                <!-- Floating overlay with teacher's subject icon -->
                <div
                  class="absolute right-3 top-5 w-16 h-16 bg-white rounded-2xl shadow-lg transform-gpu rotate-12 z-10 flex items-center justify-center floating-element"
                  :style="{
                    backgroundColor: `${teacher.color}15`,
                    border: `2px solid ${teacher.color}30`,
                  }">
                  <span class="text-2xl" :style="{ color: teacher.color }">
                    {{ getSubjectEmoji(teacher.subjects[0]) }}
                  </span>
                </div>

                <!-- 3D layered image container -->
                <div class="relative overflow-hidden">
                  <!-- Background blur layer -->
                  <div class="absolute inset-0 filter blur-md scale-105"
                    :style="{ backgroundImage: `url(${teacher.image})`, backgroundSize: 'cover', opacity: 0.3 }">
                  </div>

                  <!-- Main image -->
                  <img :src="teacher.image" :alt="teacher.name"
                    class="w-full h-[280px] object-cover transition-all duration-300 group-hover:scale-105 relative z-1">

                  <!-- Overlay gradient -->
                  <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-2"></div>
                </div>

                <div
                  class="p-5 flex flex-col items-start gap-2 bg-white/95 border-t border-gray-100 relative backdrop-blur-sm">
                  <!-- 3D floating status indicator -->
                  <h3
                    class="text-lg font-semibold text-gray-800 mb-1 transform-gpu group-hover:translate-x-1 transition-transform duration-300">
                    {{ teacher.name }}
                  </h3>

                  <!-- Enhanced subject badges -->
                  <div class="flex flex-wrap gap-2">
                    <span v-for="sub in teacher.subjects" :key="sub" class="px-3 py-1 rounded-full text-xs font-medium transform-gpu transition-all duration-300 
                        hover:scale-110 hover:-translate-y-1 hover:rotate-2 relative overflow-hidden group/badge"
                      :style="{
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
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Enhanced background decorations -->
          <div
            class="absolute -top-12 -right-12 w-32 h-32 md:w-48 md:h-48 bg-[#5B6EF5] rounded-full -z-10 blur-md animate-pulse">
          </div>
          <div
            class="absolute -bottom-8 -left-8 w-24 h-24 md:w-36 md:h-36 bg-[#FFB74D] rounded-full -z-10 blur-md animate-pulse-slow">
          </div>
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
    subjects: ["تاريخ", "جغرافية", "اقتصاد"],
    image: "/assess/img/الأستاذ محسن أسماعيل _ تاريخ _ جغرافية _ اقتصاد.jpg",
    color: "#FF6347"
  },
  {
    name: "الاستاذ حسنين اللامي",
    subjects: ["كيمياء"],
    image: "/assess/img/الأستاذ  حسنين اللامي _ كيمياء.jpg",
    color: "#1E90FF"
  },
  {
    name: "الاستاذ كرار خضير العامري",
    subjects: ["اللغة الانكليزية"],
    image: "/assess/img/الأستاذ  كرار خضير العامري _ اللغة الانكليزية.jpg",
    color: "#8A2BE2"
  },
  {
    name: "الاستاذة فاطمة الموسوي",
    subjects: ["اللغة العربية"],
    image: "/assess/img/الأستاذة فاطمة الموسوي _ اللغة العربية .jpg",
    color: "#FF4500"
  },
  {
    name: "الاستاذ جودت نجدت",
    subjects: ["رياضيات"],
    image: "/assess/img/الأستاذ جودت نجدت _ رياضيات.jpg",
    color: "#DA70D6"
  },
  {
    name: "الاستاذ عامر عدنان الجبوري",
    subjects: ["فيزياء"],
    image: "/assess/img/الأستاذ عامرعدنان الجبوري _ فيزياء.jpg",
    color: "#00CED1"
  },
  {
    name: "الاستاذة مريم الربيعي",
    subjects: ["الإسلامية"],
    image: "/assess/img/الأستاذة مريم الربيعي _ الاسلامية.jpg",
    color: "#0FD794"
  }
  ,
  {
    name: "الاستاذة مريم الربيعي",
    subjects: ["احياء"],
    image: "/assess/img/الأستاذة فرح عباس _ احياء.jpg",
    color: "#FF1493"
  }
])


const userStore = useUserStore()
const cards = ref([])
const visibleTeachers = ref([])
let currentIndex = 0
let intervalId = null
const windowWidth = ref(window.innerWidth)

const initializeCards = () => {
  cards.value = Array(2).fill().map(() => ({
    transform: '',
    hover: false
  }))
}

const handleMouseMove = (e, index) => {
  if (!cards.value[index]) return

  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 20
  const rotateY = (centerX - x) / 20

  cards.value[index].transform = `
    perspective(1000px)
    scale3d(1.05, 1.05, 1.05)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `
  cards.value[index].hover = true
}

const handleMouseLeave = (index) => {
  if (!cards.value[index]) return
  cards.value[index].transform = ''
  cards.value[index].hover = false
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
  rotateTeachers()
}

const getVisibleTeachersCount = () => {
  if (windowWidth.value >= 1300) return 2
  if (windowWidth.value <= 770) return 2
  return 1
}

const rotateTeachers = () => {
  const count = getVisibleTeachersCount()
  visibleTeachers.value = Array(count).fill().map((_, i) =>
    teachers.value[(currentIndex + i) % teachers.value.length]
  )
  currentIndex = (currentIndex + 1) % teachers.value.length
}

const getSubjectEmoji = (subject) => {
  const emojiMap = {
    'تاريخ': '📚',
    'جغرافية': '🌍',
    'اقتصاد': '📊',
    'كيمياء': '🧪',
    'اللغة الانكليزية': '🔤',
    'اللغة العربية': '📝',
    'رياضيات': '➗',
    'فيزياء': '⚡',
    'الإسلامية': '☪️',
    'احياء': '🌱',
  }
  return emojiMap[subject] || '📚'
}

onMounted(() => {
  initializeCards()
  rotateTeachers()
  window.addEventListener('resize', updateWindowWidth)
  intervalId = setInterval(rotateTeachers, 4000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
  perspective: 2000px;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.rotate-y-12 {
  transform: rotateY(12deg);
}

.rotate-x-12 {
  transform: rotateX(12deg);
}

.rotate-y-6 {
  transform: rotateY(6deg);
}

.-rotate-y-6 {
  transform: rotateY(-6deg);
}

.teacher-fade-move,
.teacher-fade-enter-active,
.teacher-fade-leave-active {
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.teacher-fade-enter-from {
  opacity: 0;
  transform:
    translateX(100px) scale(0.8) rotateY(60deg) translateZ(-200px);
  filter: blur(10px);
}

.teacher-fade-leave-to {
  opacity: 0;
  transform:
    translateX(-100px) scale(0.8) rotateY(-60deg) translateZ(-200px);
  filter: blur(10px);
}

.teacher-fade-leave-active {
  position: absolute;
}

.teacher-fade-move {
  transition: transform 0.8s ease;
}

@keyframes pulse-slow {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive image sizes */
img {
  height: 200px;
}

@media (min-width: 641px) {
  img {
    height: 250px;
  }
}

@media (min-width: 1025px) {
  img {
    height: 280px;
  }
}

/* Responsive text sizes */
h3 {
  font-size: 1rem;
}

@media (min-width: 641px) {
  h3 {
    font-size: 1.125rem;
  }
}

@media (min-width: 1025px) {
  h3 {
    font-size: 1.25rem;
  }
}

/* Responsive padding and margins */
.p-5 {
  padding: 1rem;
}

@media (min-width: 641px) {
  .p-5 {
    padding: 1.25rem;
  }
}

@media (min-width: 1025px) {
  .p-5 {
    padding: 1.5rem;
  }
}

/* Responsive floating element */
.floating-element {
  width: 3rem;
  height: 3rem;
}

@media (min-width: 641px) {
  .floating-element {
    width: 4rem;
    height: 4rem;
  }
}

@media (min-width: 1025px) {
  .floating-element {
    width: 5rem;
    height: 5rem;
  }
}

.floating-element {
  animation: float 4s ease-in-out infinite;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-8px) rotate(2deg);
  }

  75% {
    transform: translateY(8px) rotate(-2deg);
  }
}

.card-content {
  transform: translateZ(30px);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Enhance background decorations */
.animate-pulse {
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes pulse-glow {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
    filter: blur(10px);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.1);
    filter: blur(15px);
  }
}
</style>
