<script setup lang="ts">
import type { Schedule, Game } from '../models/schedule';
import ScheduleDayGroupDesktop from './mobile/ScheduleDayGroupDesktop.vue';
import ScheduleDayGroupMobile from './mobile/ScheduleDayGroupMobile.vue';

defineProps<{
  schedule: Schedule;
  formatDate: (date: string) => string;
  isAdmin?: boolean;
}>();

const emit = defineEmits<{
  'delete-game': [id: number];
  'edit-game': [game: Game, scheduleDate: string];
}>();
</script>

<template>
  <div>
    <div class="day-group__header">
      <h2 class="day-group__title">{{ formatDate(schedule.date) }}</h2>
      <RouterLink v-if="isAdmin" class="add-btn" to="/admin">+ Ajouter</RouterLink>
    </div>

    <div v-if="schedule.games.length === 0" class="day-group__empty">
      Aucun match programmé.
    </div>
    
    <div v-else>
      <div class="desktop-view">
        <!-- Desktop version -->
        <ScheduleDayGroupDesktop
          :schedule="schedule"
          :is-admin="isAdmin"
          @delete-game="emit('delete-game', $event)"
          @edit-game="(game, scheduleDate) => emit('edit-game', game, scheduleDate)"
        />
      </div>

      <div class="mobile-view">
        <!-- Mobile version -->
        <ScheduleDayGroupMobile
          :schedule="schedule"
          :is-admin="isAdmin"
          @delete-game="emit('delete-game', $event)"
          @edit-game="(game, scheduleDate) => emit('edit-game', game, scheduleDate)"
        />
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.day-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.7rem;
}

.day-group__title {
  margin: 0;
  color: #d10000;
  font-size: 1.15rem;
}

.add-btn {
  flex-shrink: 0;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: #cf3d3d;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s ease;
}

.add-btn:hover {
  background: #b83333;
}

.day-group__empty {
  background: #fff6f6;
  border: 1px dashed #f1c5c5;
  border-radius: 8px;
  padding: 0.7rem;
  color: #f1c5c5;
}

.desktop-view {
  display: block;
  width: 100%;
}



.mobile-view {
  display: none;
}



/* ── Action buttons (edit / delete) ───────────────────── */
:deep(.delete-cell) {
  width: 5rem;
  text-align: right;
  white-space: nowrap;
}

:deep(.action-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

:deep(.action-btn--edit) {
  color: #1a6fb5;
}

:deep(.action-btn--edit:hover) {
  background: #eef4fd;
  color: #0f4f88;
}

:deep(.action-btn--delete) {
  color: #c0392b;
}

:deep(.action-btn--delete:hover) {
  background: #fff0f0;
  color: #922b21;
}

:deep(.action-btn--card) {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

@media (max-width: 900px) {
  .day-group__title {
    font-size: 1rem;
    margin-bottom: 0.55rem;
  }

  .desktop-view {
    display: none;
  }

  .mobile-view {
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