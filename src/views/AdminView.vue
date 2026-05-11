<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSchedulesStore } from '../stores/schedules';
import type { Game, Schedule } from '../models/schedule';

const router = useRouter();
const scheduleStore = useSchedulesStore();
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const categories = [
    "Moustiques Elite",
    "Poussins Elite",
    "Poussins 1",
    "Poussins 2",
    "Poussins 3",
    "Poussins 4",
    "Benjamins Elite",
    "Benjamins 1",
    "Benjamins 2",
    "Benjamins 3",
    "Benjamins 4",
    "Minimes Elite",
    "Minimes 1",
    "Minimes 2",
    "Minimes 3",
    "Minimes 4",
    "Minimes 5",
    "Cadets Elite",
    "Cadets 1",
    "Cadets 2",
    "Cadets 3",
    "Cadets 4",
    "Cadets 5",
    "Espoirs Elite",
    "Espoirs 1",
    "Club Excellence Elite",
    "Club Excellence 1",
    "Club Excellence 2",
    "Club Excellence 3",
    "Club Excellence 4",
    "Club Excellence 5",
    "Club Excellence 6",
    "Club Elite",
    "Club 1",
    "Club 2",
    "Club 3",
    "Club 4",
    "Club 5",
    "Club Feminine Elite",
    "Coupe de France Neo 2 Minime Cadet",
    "Coupe de France Mixte",
    "Coupe de France Feminine"
];

const createEmptyGame = (): Game => ({
  category: '',
  hour: '',
  field: '',
  teamA: '',
  teamB: '',
  score: '',
});

const form = reactive<Schedule>({
  date: '',
  games: [createEmptyGame()],
});

const canSubmit = computed(() => {
  return Boolean(form.date && form.games.length > 0);
});

const addGame = () => {
  form.games.push(createEmptyGame());
};

const removeGame = (index: number) => {
  if (form.games.length === 1) {
    form.games[0] = createEmptyGame();
    return;
  }

  form.games.splice(index, 1);
};

const submitSchedule = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!form.date) {
    errorMessage.value = 'La date est obligatoire.';
    return;
  }

  if (form.games.some((game) => !game.hour || !game.field || !game.teamA || !game.teamB)) {
    errorMessage.value = 'Chaque match doit au moins avoir une heure, un terrain et deux équipes.';
    return;
  }

  isSaving.value = true;

  try {
    await scheduleStore.createSchedule({
      date: form.date,
      games: form.games.map((game) => ({
        ...game,
        score: game.score || '',
      })),
    });

    successMessage.value = 'Schedule ajouté avec succès.';
    form.date = '';
    form.games = [createEmptyGame()];
    await router.push('/');
  } catch (error) {
    console.error('Erreur lors de la création du schedule :', error);
    errorMessage.value = 'Impossible de créer le schedule.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <main class="admin-page">
    <section class="admin-shell">
      <header class="admin-header">
        <div>
          <p class="admin-header__eyebrow">Administration</p>
          <h1>Ajouter un schedule</h1>
          <p class="admin-header__subtitle">Crée une nouvelle journée et ses rencontres.</p>
        </div>

        <RouterLink class="admin-header__back" to="/">Retour au planning</RouterLink>
      </header>

      <p v-if="successMessage" class="feedback feedback--success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="feedback feedback--error">{{ errorMessage }}</p>

      <form class="schedule-form" @submit.prevent="submitSchedule">
        <label class="field">
          <span>Date du schedule</span>
          <input v-model="form.date" type="date" />
        </label>

        <div class="games-header">
          <h2>Rencontres</h2>
          <button type="button" class="ghost-button" @click="addGame">Ajouter un match</button>
        </div>

        <article v-for="(game, index) in form.games" :key="index" class="game-card">
          <div class="game-card__header">
            <h3>Match {{ index + 1 }}</h3>
            <button type="button" class="ghost-button ghost-button--danger" @click="removeGame(index)">
              Supprimer
            </button>
          </div>

          <div class="grid">
            <label class="field">
              <span>Catégorie</span>
              <select v-model="game.category">
                <option value="" disabled>Sélectionner une catégorie</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </label>

            <label class="field">
              <span>Heure</span>
              <input v-model="game.hour" type="text" placeholder="09:30" />
            </label>

            <label class="field">
              <span>Terrain</span>
              <input v-model="game.field" type="text" placeholder="22A" />
            </label>

            <label class="field">
              <span>Score</span>
              <input v-model="game.score" type="text" placeholder="2 - 1" />
            </label>

            <label class="field field--wide">
              <span>Équipe A</span>
              <input v-model="game.teamA" type="text" placeholder="4V CC" />
            </label>

            <label class="field field--wide">
              <span>Équipe B</span>
              <input v-model="game.teamB" type="text" placeholder="4V CM" />
            </label>
          </div>
        </article>

        <div class="actions">
          <button class="primary-button" type="submit" :disabled="isSaving || !canSubmit">
            {{ isSaving ? 'Création...' : 'Créer le schedule' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 2rem;
  background:
    radial-gradient(circle at top left, rgba(207, 61, 61, 0.14), transparent 30%),
    linear-gradient(180deg, #fffaf9 0%, #ffffff 100%);
  font-family: Arial, sans-serif;
}

.admin-shell {
  max-width: 980px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.admin-header__eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #cf3d3d;
  font-size: 0.75rem;
  font-weight: 700;
}

.admin-header h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: #111111;
}

.admin-header__subtitle {
  margin: 0.45rem 0 0;
  color: #5c5c5c;
}

.admin-header__back {
  padding: 0.7rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  background: #111111;
  color: #fff;
  font-weight: 700;
  white-space: nowrap;
}

.feedback {
  margin: 0 0 1rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  font-weight: 600;
}

.feedback--success {
  background: #ecfbf4;
  color: #1e6b42;
  border: 1px solid #bfe6d0;
}

.feedback--error {
  background: #fff0f0;
  color: #b42318;
  border: 1px solid #f3c0c0;
}

.schedule-form {
  display: grid;
  gap: 1rem;
}

.games-header,
.game-card__header,
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.games-header h2,
.game-card h3 {
  margin: 0;
}

.ghost-button,
.primary-button {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.ghost-button {
  background: #f4f4f4;
  color: #222;
}

.ghost-button--danger {
  background: #fff1f1;
  color: #a61b1b;
}

.primary-button {
  background: #cf3d3d;
  color: #fff;
  padding-inline: 1.25rem;
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.game-card {
  padding: 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #f0dfdf;
  box-shadow: 0 12px 30px rgba(30, 30, 30, 0.06);
}

.game-card__header {
  margin-bottom: 0.9rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

.field span {
  color: #4d4d4d;
  font-size: 0.9rem;
  font-weight: 700;
}

.field input,
.field select {
  width: 100%;
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  padding: 0.85rem 0.95rem;
  font: inherit;
  background: #fff;
}

.field input:focus,
.field select:focus {
  outline: 2px solid rgba(207, 61, 61, 0.2);
  border-color: #cf3d3d;
}

.field--wide {
  grid-column: span 2;
}

@media (max-width: 900px) {
  .admin-page {
    padding: 1rem;
  }

  .admin-header,
  .games-header,
  .game-card__header,
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-header__back,
  .ghost-button,
  .primary-button {
    width: 100%;
    text-align: center;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .field--wide {
    grid-column: span 1;
  }
}
</style>