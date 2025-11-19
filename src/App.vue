<template>
    <div id="app" class="min-h-screen">
        <router-view />
        <MobileBottomNav />
        <!-- <FloatingDonation /> -->
        <ChatBot />
    </div>
</template>

<script setup>
import MobileBottomNav from './components/MobileBottomNav.vue'
// App组件
// import FloatingDonation from './components/FloatingDonation.vue'
import ChatBot from './components/ChatBot.vue'
</script>
