<template>
    <div id="app" class="min-h-screen">
        <router-view />
        <MobileBottomNav />
        <!-- <FloatingDonation /> -->
    </div>
</template>

<script setup>
import MobileBottomNav from './components/MobileBottomNav.vue'
// App组件
// import FloatingDonation from './components/FloatingDonation.vue'
</script>
