<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const isMobileMenuOpen = ref(false);
const route = useRoute();

const currentPath = computed(() => route.path);

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Lamotte 2026', to: '/' },
  { label: 'Admin', to: '/login' },
];
</script>

<template>
  <div class="app-shell">
    <header class="main-header">
      <div class="header-glow" aria-hidden="true" />
      <nav class="desktop-nav" aria-label="Navigation principale">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="nav-link"
          :class="{ active: currentPath === item.to }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="mobile-nav">
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Ouvrir le menu"
          @click="toggleMobileMenu"
        >
          <span class="menu-toggle-icon" :class="{ open: isMobileMenuOpen }" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span class="menu-toggle-text">Menu</span>
        </button>

        <nav v-if="isMobileMenuOpen" class="mobile-menu" aria-label="Menu mobile">
          <RouterLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            class="mobile-link"
            :class="{ active: currentPath === item.to }"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  --brand-ink: #7f1d1d;
  --brand-soft: #fee2e2;
  --brand-accent: #dc2626;
  --brand-warm: #fca5a5;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(8px);
  background: linear-gradient(90deg, rgba(127, 29, 29, 0.95), rgba(220, 38, 38, 0.9));
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.8rem 1rem;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  inset: -40% auto auto -15%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(252, 165, 165, 0.3), transparent 70%);
  pointer-events: none;
}

.desktop-nav {
  display: none;
  position: relative;
  gap: 0.75rem;
  align-items: center;
}

.nav-link,
.mobile-link {
  text-decoration: none;
  color: #f8fafc;
  font-weight: 600;
  border-radius: 999px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.nav-link {
  padding: 0.5rem 1rem;
}

.nav-link:hover,
.mobile-link:hover {
  background: rgba(248, 250, 252, 0.18);
  transform: translateY(-1px);
}

.nav-link.active,
.mobile-link.active {
  background: #f8fafc;
  color: var(--brand-accent);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
}

.menu-toggle {
  border: 1px solid rgba(248, 250, 252, 0.35);
  background: rgba(248, 250, 252, 0.12);
  color: #f8fafc;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.menu-toggle-text {
  font-weight: 600;
  font-size: 0.95rem;
}

.menu-toggle-icon {
  width: 18px;
  height: 14px;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-toggle-icon span {
  height: 2px;
  width: 100%;
  background: #f8fafc;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.menu-toggle-icon.open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-toggle-icon.open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle-icon.open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.1);
  border: 1px solid rgba(248, 250, 252, 0.2);
}

.mobile-link {
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
}

.main-content {
  padding-top: 0.15rem;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }

  .mobile-nav {
    display: none;
  }
}
</style>