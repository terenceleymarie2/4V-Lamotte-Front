<script setup lang="ts">
defineProps<{
  to?: string;
  href?: string;
  title?: string;
}>();
</script>

<template>
  <RouterLink v-if="to" :to="to" class="fab" :title="title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </RouterLink>
  <a v-else-if="href" :href="href" class="fab" :title="title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </a>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #cf3d3d 0%, #b83333 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(207, 61, 61, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.fab:hover {
  transform: scale(1.1) translateY(-4px);
  box-shadow: 0 8px 20px rgba(207, 61, 61, 0.6);
}

.fab:active {
  transform: scale(0.95);
}

.fab svg {
  width: 28px;
  height: 28px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 900px) {
  .fab {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 52px;
    height: 52px;
  }

  .fab svg {
    width: 26px;
    height: 26px;
  }
}

@media (max-width: 640px) {
  .fab {
    bottom: 5.5rem;
    right: 1rem;
    width: 48px;
    height: 48px;
  }

  .fab svg {
    width: 24px;
    height: 24px;
  }
}
</style>
