<template>
    <div class="min-h-screen bg-blue-400 px-2 md:px-4 py-6 pb-20 md:pb-6">
        <GlobalNavigation />
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">美食社区</h1>
                <p class="text-lg text-gray-600">分享你的拿手好菜，看看大家都吃了什么</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-xl shadow-lg border-2 border-gray-800">
                        <button @click="showUploadForm = !showUploadForm" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl"></span>
                                <h2 class="text-2xl font-bold text-gray-800">分享你的菜品</h2>
                            </div>
                            <span class="text-2xl transform transition-transform" :class="{ 'rotate-180': showUploadForm }"></span>
                        </button>
                        <div v-show="showUploadForm" class="px-6 pb-6">
