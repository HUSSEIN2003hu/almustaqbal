<template>
    <section id="code" class="relative overflow-hidden mb-24">
      <div class="w-full">
        <div class="container mx-auto w-full pt-12 md:pt-20 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-center text-center">
            <div class="max-w-2xl">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                هل تحتاج إلى كود الاشتراك؟
              </h1>
              <p class="text-base sm:text-lg text-gray-600 mt-3">
                هناك طريقتان: يمكنك الذهاب إلى الموقع للحصول على بطاقة تحتوي على رمز، أو يمكنك التواصل معنا عبر الإنترنت.
              </p>
            </div>
          </div>
  
          <div class="bg-secondary mt-12 md:mt-20 rounded-3xl md:rounded-[40px] flex flex-col-reverse md:flex-row-reverse gap-6 ">
            <!-- Contact Cards Section -->
            <div class="min-h-full w-full p-6">
              <iframe 
                class="w-full h-full min-h-[400px] rounded-[40px]"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3331.115396727504!2d44.40970348480206!3d33.39415348079015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDIzJzM5LjAiTiA0NMKwMjQnMjcuMSJF!5e0!3m2!1sar!2siq!4v1744919756933!5m2!1sar!2siq"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>

            <div class="bg-primary p-6 md:p-8 text-white space-y-6 order-2 md:order-1 rounded-r-[40px]">
              <div v-for="contact in contacts" :key="contact.id" class="group">
                <div class="p-4 shadow-xl shadow-white-200/40 rounded-[20px] flex border-[2px]  items-center gap-4 duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-secondary hover:border-[2px] " style="background: azure;">
                  <!-- Icon Container -->
                  <div class="text-secondary ">
                    <Icon :name="contact.icon" class="w-10 h-10" />
                  </div>
                  <!-- Text Content -->
                  <div class="flex flex-col">
                    <a :href="contact.link"  target="_blank" class="text-lg font-medium text-primary">
                      {{ contact.title }}
                    </a>
                    <a :href="contact.link" target="_blank" class="text-base text-gray-800">
                      {{ contact.text }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Map Section -->
          </div>
        </div>
      </div>
  
      <!-- Decorative Background Elements -->
      <img src="../assess/icon/Bg-2.svg" alt="background" class="hidden md:block absolute top-40 left-24 -z-10 w-1/3 max-w-xs">
      <img src="../assess/icon/Bg-1.svg" alt="background" class="hidden md:block absolute top-1/3 right-0 -z-10 w-1/4 max-w-xs rotate-45">
    </section>
  </template>
  
  <script setup>
const contacts = ref([
    {
      title: "العنوان",
      icon: "fa6-solid:location-dot",
      text: "البنوك سوق الميثاق",
      link: "https://maps.app.goo.gl/FMupKYCVJaBReHcw6",
    },
    {
      title: "واتساب",
      icon: "fa6-brands:whatsapp",
      text: "+964 771 234 2980",
      link: "https://wa.me/901123456789",
    },
    {
      title: "البريد الإلكتروني",
      icon: "fa6-solid:envelope",
      text: "the1future1q@gmail.com",
    },
    {
      title: "تليجرام",
      icon: "fa6-brands:telegram",
      text: "TheFutureiQ",
      link: "https://t.me/TheFutureiQ",
    },
    {
      title: "انستقرام",
      icon: "fa6-brands:instagram",
      text: "thefuture.iq",
      link: "https://instagram.com/thefuture.iq",
    },
    {
      title: "يوتيوب",
      icon: "fa6-brands:youtube",
      text: "TheFuture.1Q",
      link: "https://www.youtube.com/@TheFuture.1Q",
    },
    {
      title: "تيك توك",
      icon: "fa6-brands:tiktok",
      text: "@thefuture.1q",
      link: "https://www.tiktok.com/@thefuture.1q",
    }
]);

  </script>