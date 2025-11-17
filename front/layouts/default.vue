<template>
  <div class="flex flex-wrap justify-evenly items-start flex-col">
    <section class="w-full">
      <div>
        <section>
          <Navigation />
        </section>
        <section>
          <slot />
        </section>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Navigation from '~/components/navigation.vue';
</script>
