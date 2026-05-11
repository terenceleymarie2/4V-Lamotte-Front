<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSchedulesStore } from "./stores/schedules";
import type { Schedule } from "./models/schedule";

const scheduleStore = useSchedulesStore();
const schedules = computed<Schedule[]>(() => scheduleStore.schedules);
const loading = ref(true);

const groupedSchedules = computed<Schedule[]>(() => {
  const toTimestamp = (date: string) => {
    const timestamp = new Date(date).getTime();
    return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
  };

  return [...schedules.value].sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));
});


onMounted(() => {
  loading.value = true;
  scheduleStore.fetchSchedules().finally(() => {
    loading.value = false;
  });
});

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
</script>

<template>
  <main class="container">
    <header class="page-header">
      <img src="/logo.png" alt="Logo" class="page-header__logo" />
      <h1>Matchs 4V - Lamotte Beuvron</h1>
    </header>

    <div v-if="loading">Chargement des données...</div>

    <div v-else-if="schedules.length === 0">Aucun schedule disponible.</div>

    <section
      v-else
      v-for="(schedule, scheduleIndex) in groupedSchedules"
      :key="`${schedule.date}-${scheduleIndex}`"
      class="day-group"
    >
      <h2 class="day-group__title">{{ formatDate(schedule.date) }}</h2>

      <div v-if="schedule.games.length === 0" class="day-group__empty">
        Aucun match programmé.
      </div>

      <table v-else class="schedule-table desktop-only">
        <thead>
          <tr>
            <th></th>
            <th>Heure</th>
            <th>Terrain</th>
            <th>Équipe A</th>
            <th>Équipe B</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(game, gameIndex) in schedule.games"
            :key="`${schedule.date}-${game.hour}-${game.field}-${gameIndex}`"
          >
            <td>{{ game.category }}</td>
            <td>{{ game.hour }}</td>
            <td>{{ game.field }}</td>
            <td>{{ game.teamA }}</td>
            <td>{{ game.teamB }}</td>
            <td>{{ game.score || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <section v-if="schedule.games.length > 0" class="mobile-only mobile-cards">
        <article
          v-for="(game, gameIndex) in schedule.games"
          :key="`${schedule.date}-${game.hour}-${game.field}-${gameIndex}`"
          class="match-card"
        >
          <h3 class="match-card__title">{{ game.teamA }} vs {{ game.teamB }}</h3>

          <dl class="match-card__details">
            <div>
              <dt></dt>
              <dd>{{ game.category }}</dd>
            </div>
            <div>
              <dt>Heure</dt>
              <dd>{{ game.hour }}</dd>
            </div>
            <div>
              <dt>Terrain</dt>
              <dd>{{ game.field }}</dd>
            </div>
            <div>
              <dt>Score</dt>
              <dd>{{ game.score || '-' }}</dd>
            </div>
          </dl>
        </article>
      </section>
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

.container h1 {
  margin: 0;
  color: #111111;
}

.day-group {
  margin-top: 1.2rem;
}

.day-group__title {
  margin: 0 0 0.7rem;
  color: #d10000;
  font-size: 1.15rem;
}

.day-group__empty {
  background: #fff6f6;
  border: 1px dashed #f1c5c5;
  border-radius: 8px;
  padding: 0.7rem;
  color: #f1c5c5;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.schedule-table thead {
  background: #cf3d3d;
  color: #fff;
}

.schedule-table th,
.schedule-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
}

.schedule-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.schedule-table tbody tr:hover {
  background: #fff1f1;
}

.schedule-table td:last-child {
  font-weight: 600;
  color: #333;
}

.mobile-only {
  display: none;
}

.mobile-cards {
  margin-top: 1rem;
  display: grid;
  gap: 0.9rem;
}

.match-card {
  background: linear-gradient(180deg, #ffffff 0%, #fff3f3 100%);
  border: 1px solid #f2d2d2;
  border-radius: 12px;
  padding: 0.9rem;
  box-shadow: 0 6px 18px rgba(207, 61, 61, 0.12);
}

.match-card__date {
  margin: 0 0 0.3rem;
  color: #1f6f53;
  font-size: 0.82rem;
  font-weight: 700;
}

.match-card__title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: #163528;
}

.match-card__details {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: nowrap;
  width: 100%;
}

.match-card__details div {
  background: #fff;
  border: 1px solid #ecf4f0;
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  white-space: nowrap;
  flex: 1 1 0;
  min-width: 0;
  justify-content: center;
}

.match-card__details dt {
  margin: 0;
  color: #4e6a5e;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.match-card__details dd {
  margin: 0;
  color: #1f2f27;
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 900px) {
  .container {
    padding: 1rem;
  }

  .page-header {
    gap: 0.55rem;
    margin-bottom: 0.8rem;
  }

  .page-header__logo {
    width: 64px;
    height: 64px;
  }

  .day-group {
    margin-top: 0.95rem;
  }

  .day-group__title {
    font-size: 1rem;
    margin-bottom: 0.55rem;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}

@media (max-width: 900px) and (orientation: landscape) {
  .container {
    padding: 0.75rem 1rem;
  }

  .mobile-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.7rem;
    align-items: start;
  }

  .match-card {
    padding: 0.75rem;
  }

  .match-card__date {
    font-size: 0.75rem;
    margin-bottom: 0.2rem;
  }

  .match-card__title {
    font-size: 0.92rem;
    margin-bottom: 0.6rem;
  }

  .match-card__details {
    gap: 0.35rem;
  }

  .match-card__details div {
    padding: 0.3rem 0.4rem;
  }

  .match-card__details dt {
    font-size: 0.67rem;
  }

  .match-card__details dd {
    font-size: 0.82rem;
    margin-top: 0.15rem;
  }
}

@media (max-width: 900px) and (orientation: portrait) {
  .container {
    padding: 0.9rem;
  }

  .mobile-cards {
    gap: 0.75rem;
  }

  .match-card {
    padding: 0.85rem;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(207, 61, 61, 0.1);
  }

  .match-card__title {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  .match-card__details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
  }

  .match-card__details div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    white-space: normal;
    padding: 0.45rem 0.55rem;
  }

  .match-card__details dt {
    font-size: 0.65rem;
  }

  .match-card__details dd {
    font-size: 0.84rem;
  }
}

@media (max-width: 420px) {
  .match-card__details dt {
    font-size: 0.64rem;
  }

  .match-card__details dd {
    font-size: 0.8rem;
  }
}
</style>