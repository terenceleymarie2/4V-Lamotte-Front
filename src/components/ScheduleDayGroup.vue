<script setup lang="ts">
import type { Schedule } from '../models/schedule';

defineProps<{
  schedule: Schedule;
  formatDate: (date: string) => string;
  isAdmin?: boolean;
}>();

const emit = defineEmits<{
  'delete-game': [id: number];
}>();
</script>

<template>
  <div>
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
          <th v-if="isAdmin"></th>
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
          <td v-if="isAdmin" class="delete-cell">
            <button
              v-if="game.id != null"
              class="delete-btn"
              title="Supprimer ce match"
              type="button"
              @click="emit('delete-game', game.id!)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <section v-if="schedule.games.length > 0" class="mobile-only mobile-cards">
      <article
        v-for="(game, gameIndex) in schedule.games"
        :key="`${schedule.date}-${game.hour}-${game.field}-${gameIndex}`"
        class="match-card"
      >
        <div class="match-card__top">
          <h3 class="match-card__title">{{ game.teamA }} vs {{ game.teamB }}</h3>
          <button
            v-if="isAdmin && game.id != null"
            class="delete-btn delete-btn--card"
            title="Supprimer ce match"
            type="button"
            @click="emit('delete-game', game.id!)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>

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
  </div>
</template>

<style scoped>
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

.desktop-only {
  display: table;
}

.mobile-cards {
  margin-top: 1rem;
  display: grid;
  gap: 0.9rem;
}

.mobile-only {
  display: none;
}

.match-card {
  background: linear-gradient(180deg, #ffffff 0%, #fff3f3 100%);
  border: 1px solid #f2d2d2;
  border-radius: 12px;
  padding: 0.9rem;
  box-shadow: 0 6px 18px rgba(207, 61, 61, 0.12);
}

.match-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.match-card__date {
  margin: 0 0 0.3rem;
  color: #1f6f53;
  font-size: 0.82rem;
  font-weight: 700;
}

.match-card__title {
  margin: 0;
  font-size: 1rem;
  color: #163528;
}

/* ── Delete button ─────────────────────────────────────── */
.delete-cell {
  width: 2.5rem;
  text-align: center;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #c0392b;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.delete-btn:hover {
  background: #fff0f0;
  color: #922b21;
}

.delete-btn--card {
  flex-shrink: 0;
  margin-top: 0.1rem;
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