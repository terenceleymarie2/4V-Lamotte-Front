<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCategoriesStore } from '../stores/categories';

const categoriesStore = useCategoriesStore();

onMounted(async () => {
  if (categoriesStore.categories.length === 0) {
    await categoriesStore.fetchCategories();
  }
});

const competitions = computed(() => {
  const competitionDates = categoriesStore.categories.reduce((acc, category) => {
    const currentDate = acc.get(category.competition);

    if (!currentDate || new Date(category.date).getTime() < new Date(currentDate).getTime()) {
      acc.set(category.competition, category.date);
    }

    return acc;
  }, new Map<string, string>());

  return Array.from(competitionDates.entries())
    .sort((left, right) => new Date(left[1]).getTime() - new Date(right[1]).getTime())
    .map(([competition]) => competition);
});
</script>

<template>
  <main class="competitions-page">
    <header class="competitions-header">
      <p class="competitions-header__eyebrow">Navigation</p>
      <h1>Competitions</h1>
      <p class="competitions-header__subtitle">Choisissez une competition pour afficher son planning detaille.</p>
    </header>

    <section class="competitions-list" aria-label="Liste des competitions">
      <RouterLink
        v-for="competition in competitions"
        :key="competition"
        :to="`/${competition}`"
        class="competition-card"
      >
        <span class="competition-card__label">{{ competition }}</span>
        <span class="competition-card__arrow" aria-hidden="true">›</span>
      </RouterLink>

      <p v-if="competitions.length === 0" class="competitions-empty">
        Aucune competition disponible.
      </p>
    </section>
  </main>
</template>

<style scoped>
.competitions-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 0.75rem 6rem;
}

.competitions-header {
  margin-bottom: 1.25rem;
}

.competitions-header__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #dc2626;
}

.competitions-header h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
}

.competitions-header__subtitle {
  margin: 0.4rem 0 0;
  color: #6b7280;
}

.competitions-list {
  display: grid;
  gap: 0.9rem;
}

.competition-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 20px;
  text-decoration: none;
  color: #111111;
  background: #ffffff;
  border: 1px solid rgba(17, 17, 17, 0.08);
  box-shadow: 0 14px 28px rgba(17, 17, 17, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.competition-card:hover {
  transform: translateY(-2px);
  background: #fcfcfc;
  box-shadow: 0 18px 36px rgba(17, 17, 17, 0.1);
  border-color: rgba(17, 17, 17, 0.14);
}

.competition-card__label {
  font-size: 1rem;
  font-weight: 700;
}

.competition-card__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #f3f4f6;
  color: #111111;
  font-size: 1.4rem;
  line-height: 1;
}

.competitions-empty {
  margin: 0;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  background: #fff7f7;
  color: #991b1b;
  border: 1px dashed rgba(220, 38, 38, 0.28);
}

@media (max-width: 640px) {
  .competitions-page {
    padding: 1.1rem 0.25rem 6.5rem;
  }

  .competition-card {
    padding: 0.95rem 1rem;
  }
}
</style>