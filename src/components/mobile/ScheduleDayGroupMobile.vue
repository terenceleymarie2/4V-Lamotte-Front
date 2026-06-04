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
    <section class="mobile-cards">
        <article
            v-for="(game, gameIndex) in schedule.games"
            :key="`${schedule.date}-${game.hour}-${game.field}-${gameIndex}`"
            class="match-card"
        >
        <div class="match-card__top">
            <h3 class="match-card__title">{{ game.teamA }} vs {{ game.teamB }}</h3>
            <div v-if="isAdmin && game.id != null" class="match-card__actions">
            <button
                class="action-btn action-btn--edit action-btn--card"
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
                class="action-btn action-btn--delete action-btn--card"
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
            <dd class="score-value" :class="scoreClass(game.score)">{{ game.score || '-' }}</dd>
            </div>
        </dl>
        </article>
    </section>
</template>

<style scoped>

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

.match-card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.match-card__actions {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
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

.match-card__details dd.score-value--win {
    color: #1f8f4e;
}

.match-card__details dd.score-value--draw {
    color: #111111;
}

.match-card__details dd.score-value--loss {
    color: #c62828;
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