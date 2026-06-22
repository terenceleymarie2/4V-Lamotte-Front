<script setup lang="ts">
    import type { Schedule, Game } from '../../models/schedule';

    defineProps<{
        schedule: Schedule;
        isAdmin?: boolean;
    }>();

    const emit = defineEmits<{
        'delete-game': [id: number];
        'edit-game': [game: Game, scheduleDate: string];
    }>();

    const scoreClass = (score?: string) => {
        if (!score) {
            return '';
        }

        const matchedScore = score.match(/^(\d+)\s*-\s*(\d+)$/);
        if (!matchedScore) {
            return '';
        }

        const homeScore = Number(matchedScore[1]);
        const awayScore = Number(matchedScore[2]);

        if (homeScore > awayScore) {
            return 'score-value--win';
        }

        if (homeScore < awayScore) {
            return 'score-value--loss';
        }

        return 'score-value--draw';
    };

</script>

<template>
      <table class="schedule-table">
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
            <td class="score-value" :class="scoreClass(game.score)">{{ game.score || '-' }}</td>
            <td v-if="isAdmin" class="delete-cell">
              <button
                v-if="game.id != null"
                class="action-btn action-btn--edit"
                title="Modifier ce match"
                type="button"
                @click="emit('edit-game', game, schedule.date)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                v-if="game.id != null"
                class="action-btn action-btn--delete"
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
</template>

<style scoped>


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

.schedule-table td.delete-cell {
  font-weight: 600;
  color: #333;
}

.score-value {
    font-weight: 700;
}

.score-value--win {
    color: #1f8f4e;
}

.score-value--draw {
    color: #111111;
}

.score-value--loss {
    color: #c62828;
}
</style>