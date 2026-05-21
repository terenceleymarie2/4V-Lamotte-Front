<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isDesktopNavExpanded = ref(false);

const currentPath = computed(() => route.path);

const isAdmin = computed(() => sessionStorage.getItem('isAdmin') === 'true');

const navItems = [
  { key: 'home', shortLabel: 'Acc.', label: 'Accueil', to: '/', isVisible: true },
  { key: 'event', shortLabel: 'L26', label: 'Lamotte 2026', to: '/', isVisible: isAdmin },
  { key: 'admin', shortLabel: 'Adm.', label: 'Espace Admin', to: '/login', isVisible: true },
];

const visibleNavItems = computed(() => {
  return navItems.filter((item) => {
    if (typeof item.isVisible === 'boolean') {
      return item.isVisible;
    }

    return item.isVisible.value;
  });
});

const toggleDesktopNav = () => {
  isDesktopNavExpanded.value = !isDesktopNavExpanded.value;
};
</script>

<template>
  <div class="app-shell" :class="{ 'desktop-expanded': isDesktopNavExpanded }">
    <aside class="side-nav" aria-label="Navigation principale desktop">
      <div class="side-nav__glow" aria-hidden="true" />
      <div class="side-nav__top">
        <div class="side-nav__brand">{{ isDesktopNavExpanded ? 'Les 4V' : '4V' }}</div>
        <button
          type="button"
          class="side-nav__toggle"
          :aria-expanded="isDesktopNavExpanded"
          aria-label="Agrandir ou réduire le menu"
          @click="toggleDesktopNav"
        >
          <span class="toggle-chevron" :class="{ open: isDesktopNavExpanded }">›</span>
        </button>
      </div>
      <nav class="side-nav__links">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.key"
          :to="item.to"
          class="side-link"
          :class="{ active: currentPath === item.to }"
        >
          <span class="side-link__icon" aria-hidden="true">
            <svg v-if="item.key === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M6 10.5V20h12v-9.5" />
            </svg>
            <svg v-else-if="item.key === 'event'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V8a5 5 0 0 1 10 0v3" />
            </svg>
          </span>
          <span class="side-link__text">{{ isDesktopNavExpanded ? item.label : item.shortLabel }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <router-view />
    </main>

    <nav class="bottom-nav" aria-label="Navigation principale mobile">
      <RouterLink
        v-for="item in visibleNavItems"
        :key="item.key"
        :to="item.to"
        class="bottom-link"
        :class="{ active: currentPath === item.to }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #fffdfd;
  --brand-ink: #7f1d1d;
  --brand-accent: #dc2626;
  --brand-warm: #fca5a5;
}

.side-nav {
  display: none;
  position: absolute;
  overflow: hidden;
}

.side-nav__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.side-nav__glow {
  position: absolute;
  inset: -30% -30% auto auto;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(252, 165, 165, 0.3), transparent 70%);
  pointer-events: none;
}

.side-nav__brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.04em;
  position: relative;
}

.side-nav__toggle {
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toggle-chevron {
  font-size: 1rem;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.toggle-chevron.open {
  transform: rotate(180deg);
}

.side-nav__links {
  position: relative;
  display: grid;
  gap: 0.6rem;
}

.side-link,
.bottom-link {
  text-decoration: none;
  color: #f8fafc;
  font-weight: 600;
  border-radius: 12px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.side-link {
  padding: 0.55rem 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.side-link__icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.side-link__icon svg {
  width: 18px;
  height: 18px;
}

.side-link__text {
  font-size: 0.82rem;
  white-space: nowrap;
}

.side-link:hover,
.bottom-link:hover {
  background: rgba(248, 250, 252, 0.18);
  transform: translateY(-1px);
}

.side-link.active,
.bottom-link.active {
  background: #f8fafc;
  color: var(--brand-accent);
}

.main-content {
  padding: 0.25rem 0.5rem 5.6rem;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 0.4rem;
  padding: 0.55rem 0.7rem calc(0.55rem + env(safe-area-inset-bottom));
  background: linear-gradient(90deg, rgba(127, 29, 29, 0.96), rgba(220, 38, 38, 0.92));
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.bottom-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.62rem 0.35rem;
  font-size: 0.84rem;
  min-height: 2.35rem;
  white-space: nowrap;
}

@media (hover: none) {
  .bottom-link:hover {
    transform: none;
  }
}

@media (min-width: 768px) {
  .app-shell {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    transition: grid-template-columns 0.22s ease;
  }

  .app-shell.desktop-expanded {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  .side-nav {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 0.95rem 0.75rem;
    background: linear-gradient(180deg, rgba(127, 29, 29, 0.97), rgba(220, 38, 38, 0.88));
    border-right: 1px solid rgba(255, 255, 255, 0.15);
  }

  .side-nav__brand {
    font-size: 0.9rem;
    margin-bottom: 0;
  }

  .side-nav__links {
    gap: 0.45rem;
  }

  .side-link {
    padding: 0.55rem;
    font-size: 0.82rem;
  }

  .app-shell:not(.desktop-expanded) .side-nav__toggle {
    margin-left: auto;
  }

  .app-shell:not(.desktop-expanded) .side-link {
    justify-content: center;
  }

  .app-shell:not(.desktop-expanded) .side-link__text {
    font-size: 0.74rem;
  }

  .app-shell.desktop-expanded .side-link {
    justify-content: flex-start;
    padding: 0.6rem 0.7rem;
  }

  .app-shell.desktop-expanded .side-link__text {
    font-size: 0.86rem;
  }

  .main-content {
    padding: 0.65rem 1rem;
  }

  .bottom-nav {
    display: none;
  }
}
</style>