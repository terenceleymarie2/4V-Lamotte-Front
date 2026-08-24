<script setup lang="ts">
import { format, parse } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { CreateScheduleRequest } from '../models/scheduleRemote';
import { useCategoriesStore } from "../stores/categories";
import { useSchedulesStore } from '../stores/schedules';

const router = useRouter();
const scheduleStore = useSchedulesStore();
const categoriesStore = useCategoriesStore();
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Edit mode: populated when coming from the pencil icon
const editId = ref<number | null>(null);
const isEditMode = computed(() => editId.value !== null);

const { selectedCompetition } = storeToRefs(categoriesStore);
const categories = computed(() => categoriesStore.getCategoriesByCompetition());


const createEmptyGame = (): CreateScheduleRequest => ({
  date: "",
  competition: selectedCompetition.value,
  category: "",
  hour: "",
  field: "",
  teamA: "",
  teamB: "",
});

const form = reactive<CreateScheduleRequest>({
  ...createEmptyGame(),
});

onMounted(() => {
  const target = scheduleStore.editTarget;
  if (target?.id != null) {
    const date = parse(target.date, "EEE dd/MM/yyyy", new Date());
    editId.value = target.id;
    Object.assign(form, {
      date: format(date, "yyyy-MM-dd"),
      competition: selectedCompetition.value,
      category: target.category,
      hour: target.hour,
      field: target.field,
      teamA: target.teamA,
      teamB: target.teamB,
      score: target.score
    });
    scheduleStore.editTarget = null;
  }
});

const canSubmit = computed(() => {
  return Boolean(form.date && form.category && form.hour && form.field && form.teamA && form.teamB);
});

const submitSchedule = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!form.date || !form.category || !form.hour || !form.field || !form.teamA || !form.teamB) {
    errorMessage.value = 'Tous les champs sont obligatoires.';
    return;
  }

  isSaving.value = true;

  try {
    if (isEditMode.value) {
      await scheduleStore.patchGame(editId.value!, form);
      successMessage.value = 'Schedule modifié avec succès.';
    } else {
      await scheduleStore.createSchedule(form);
      successMessage.value = 'Schedule ajouté avec succès.';
    }
    Object.assign(form, createEmptyGame());
    editId.value = null;
    await router.push('/');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du schedule :', error);
    errorMessage.value = 'Impossible de sauvegarder le schedule.';
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
          <h1>{{ isEditMode ? 'Modifier un schedule' : 'Ajouter un schedule' }}</h1>
          <p class="admin-header__subtitle">{{ isEditMode ? 'Modifiez les informations de la rencontre.' : 'Crée une nouvelle rencontre.' }}</p>
        </div>

        <RouterLink class="admin-header__back" to="/">Retour au planning</RouterLink>
      </header>

      <p v-if="successMessage" class="feedback feedback--success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="feedback feedback--error">{{ errorMessage }}</p>

      <form class="schedule-form" @submit.prevent="submitSchedule">
        <label class="field">
          <span>Date de la rencontre</span>
          <input v-model="form.date" type="date" />
        </label>

        <div class="grid">
          <label class="field">
            <span>Catégorie</span>
            <select v-model="form.category">
              <option value="" disabled>Sélectionner une catégorie</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.category">{{ cat.category }}</option>
            </select>
          </label>

          <label class="field">
            <span>Heure</span>
            <input v-model="form.hour" type="text" placeholder="09:30" />
          </label>

          <label class="field">
            <span>Terrain</span>
            <input v-model="form.field" type="text" placeholder="22A" />
          </label>

          <label class="field field--wide">
            <span>Équipe A</span>
            <input v-model="form.teamA" type="text" placeholder="4V CC" />
          </label>

          <label class="field field--wide">
            <span>Équipe B</span>
            <input v-model="form.teamB" type="text" placeholder="4V CM" />
          </label>

          <label class="field field--wide" v-if="isEditMode">
            <span>Score</span>
            <input v-model="form.score" type="text" placeholder="0 - 0" />
          </label>
        </div>

        <div class="actions">
          <button class="primary-button" type="submit" :disabled="isSaving || !canSubmit">
            {{ isSaving ? 'Sauvegarde...' : isEditMode ? 'Enregistrer les modifications' : 'Créer le schedule' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
/* ── Page layout ──────────────────────────────────────── */
.admin-page {
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
  background:
    radial-gradient(ellipse at top left, rgba(207, 61, 61, 0.1) 0%, transparent 45%),
    linear-gradient(160deg, #fffaf9 0%, #ffffff 60%);
  font-family: Arial, sans-serif;
}

.admin-shell {
  max-width: 680px;
  margin: 0 auto;
}

/* ── Header ───────────────────────────────────────────── */
.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.admin-header__eyebrow {
  margin: 0 0 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: #cf3d3d;
  font-size: 0.7rem;
  font-weight: 700;
}

.admin-header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: #111;
  line-height: 1.15;
}

.admin-header__subtitle {
  margin: 0.4rem 0 0;
  color: #6b6b6b;
  font-size: 0.9rem;
}

.admin-header__back {
  flex-shrink: 0;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  text-decoration: none;
  background: #111;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  transition: background 0.15s ease;
}

.admin-header__back:hover {
  background: #333;
}

/* ── Feedback banners ─────────────────────────────────── */
.feedback {
  margin: 0 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
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

/* ── Form card ────────────────────────────────────────── */
.schedule-form {
  display: grid;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #f0e4e4;
  box-shadow:
    0 2px 6px rgba(30, 30, 30, 0.04),
    0 16px 40px rgba(30, 30, 30, 0.07);
}

/* ── Field ────────────────────────────────────────────── */
.field {
  display: grid;
  gap: 0.4rem;
}

.field span {
  color: #444;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.field input,
.field select {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  font: inherit;
  font-size: 0.95rem;
  background: #fafafa;
  color: #111;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.field input:hover,
.field select:hover {
  border-color: #c8c8c8;
  background: #fff;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: #cf3d3d;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(207, 61, 61, 0.12);
}

/* ── 3-column grid for short fields ──────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.field--wide {
  grid-column: span 3;
}

/* ── Divider between field groups ────────────────────── */
.grid + .field,
.grid {
  margin-top: 0;
}

/* ── Submit row ───────────────────────────────────────── */
.actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #f3eded;
}

.primary-button {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 2rem;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: #cf3d3d;
  color: #fff;
  transition: background 0.15s ease, transform 0.1s ease;
}

.primary-button:hover:not(:disabled) {
  background: #b83333;
}

.primary-button:active:not(:disabled) {
  transform: scale(0.97);
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 600px) {
  .admin-page {
    padding: 1.25rem 1rem;
  }

  .admin-header {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-header__back {
    text-align: center;
  }

  .schedule-form {
    padding: 1.25rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .field--wide {
    grid-column: span 1;
  }

  .actions {
    justify-content: stretch;
  }

  .primary-button {
    width: 100%;
    text-align: center;
  }
}
</style>