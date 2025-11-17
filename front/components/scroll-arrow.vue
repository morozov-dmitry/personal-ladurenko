<template>
  <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
    <button 
      @click.stop="scrollToTarget"
      type="button"
      class="text-white hover:text-blue-300 transition-colors duration-300 group cursor-pointer p-2"
    >
      <div class="animate-bounce pointer-events-none">
        <svg 
          role="presentation" 
          class="h-12 w-12"
          style="fill:currentColor;"
          viewBox="0 0 38.417 18.592"
        >
          <g>
            <path d="M19.208,18.592c-0.241,0-0.483-0.087-0.673-0.261L0.327,1.74c-0.408-0.372-0.438-1.004-0.066-1.413c0.372-0.409,1.004-0.439,1.413-0.066L19.208,16.24L36.743,0.261c0.411-0.372,1.042-0.342,1.413,0.066c0.372,0.408,0.343,1.041-0.065,1.413L19.881,18.332C19.691,18.505,19.449,18.592,19.208,18.592z"></path>
          </g>
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  target: string;
}

const props = defineProps<Props>();

const scrollToTarget = () => {
  const { scrollToSection } = useSmoothScroll();
  scrollToSection(props.target);
};
</script>