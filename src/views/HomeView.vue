<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSchedulesStore } from '../stores/schedules';
import type { Schedule } from '../models/schedule';
import type { Game } from '../models/schedule';
import ScheduleDayGroup from '../components/ScheduleDayGroup.vue';
import { storeToRefs } from "pinia";

const router = useRouter();
const scheduleStore = useSchedulesStore();
const schedules = computed<Schedule[]>(() => scheduleStore.schedules);
const isAdmin = computed(() => scheduleStore.isAdmin);
const loading = ref(true);
const route = useRoute();
const competition = computed<string>(() => (route.params.competition as string) || scheduleStore.defaultCompetition as unknown as string);
const { selectedCompetition } = storeToRefs(scheduleStore);

const groupedSchedules = computed<Schedule[]>(() => {
  const toTimestamp = (date: string) => {
    const timestamp = new Date(date).getTime();
    return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
  };

  return [...schedules.value].sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));
});

watch(
  competition,
  async (newCompetition) => {
    loading.value = true;
    selectedCompetition.value = newCompetition;
    await scheduleStore.fetchSchedules();
    loading.value = false;
  },
  { immediate: true }
);

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const handleEditGame = (game: Game, scheduleDate: string) => {
  scheduleStore.editTarget = { ...game, date: scheduleDate };
  router.push('/admin');
};
</script>

<template>
  <main class="container">
    <header class="page-header">
      <img src="/logo.png" alt="Logo" class="page-header__logo" />
      <div>
        <h1>Matchs 4V - Lamotte Beuvron</h1>
        <p class="page-header__subtitle">Planning des rencontres</p>
      </div>
    </header>

    <div v-if="loading">Chargement des données...</div>

    <div v-else-if="schedules.length === 0">Aucun schedule disponible.</div>

    <section
      v-else
      v-for="(schedule, scheduleIndex) in groupedSchedules"
      :key="`${schedule.date}-${scheduleIndex}`"
      class="day-group"
    >
      <ScheduleDayGroup
        :schedule="schedule"
        :format-date="formatDate"
        :is-admin="isAdmin"
        @delete-game="scheduleStore.deleteGame"
        @edit-game="handleEditGame"
      />
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.page-header__logo {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  object-fit: contain;
}

.page-header h1 {
  margin: 0;
  color: #111111;
}

.page-header__subtitle {
  margin: 0.2rem 0 0;
  color: #6b6b6b;
  font-size: 0.92rem;
}

.page-header__admin-link {
  margin-left: auto;
  padding: 0.65rem 0.95rem;
  border-radius: 999px;
  background: #cf3d3d;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}

.day-group {
  margin-top: 1.2rem;
}

@media (max-width: 900px) {
  .container {
    padding: 1rem;
  }

  .page-header {
    gap: 0.55rem;
    margin-bottom: 0.8rem;
    align-items: flex-start;
  }

  .page-header__logo {
    width: 64px;
    height: 64px;
  }

  .page-header__admin-link {
    margin-left: 0;
    align-self: center;
  }

  .day-group {
    margin-top: 0.95rem;
  }
}
</style>