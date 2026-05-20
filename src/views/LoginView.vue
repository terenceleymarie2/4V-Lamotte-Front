<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSchedulesStore } from '../stores/schedules';

const router = useRouter();
const store = useSchedulesStore();

const password = ref('');
const error = ref('');

const submit = () => {
  if (password.value === 'azertyuiop') {
    sessionStorage.setItem('isAdmin', 'true');
    store.isAdmin = true;
    router.push('/');
  } else {
    error.value = 'Code d\'accès incorrect.';
    password.value = '';
  }
};
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <p class="login-eyebrow">Administration</p>
      <h1 class="login-title">Accès restreint</h1>
      <p class="login-subtitle">Entrez le code d'accès pour continuer.</p>

      <form class="login-form" @submit.prevent="submit">
        <label class="field">
          <span>Code d'accès</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            autofocus
          />
        </label>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button class="primary-button" type="submit">Valider</button>
      </form>

      <RouterLink class="login-back" to="/">Retour au planning</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background:
    radial-gradient(ellipse at top left, rgba(207, 61, 61, 0.1) 0%, transparent 45%),
    linear-gradient(160deg, #fffaf9 0%, #ffffff 60%);
  font-family: Arial, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #f0e4e4;
  box-shadow:
    0 2px 6px rgba(30, 30, 30, 0.04),
    0 16px 40px rgba(30, 30, 30, 0.08);
}

.login-eyebrow {
  margin: 0 0 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: #cf3d3d;
  font-size: 0.7rem;
  font-weight: 700;
}

.login-title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
  color: #111;
}

.login-subtitle {
  margin: 0 0 1.5rem;
  color: #6b6b6b;
  font-size: 0.9rem;
}

.login-form {
  display: grid;
  gap: 1rem;
}

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

.field input {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  font: inherit;
  font-size: 0.95rem;
  background: #fafafa;
  color: #111;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field input:focus {
  outline: none;
  border-color: #cf3d3d;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(207, 61, 61, 0.12);
}

.login-error {
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: #fff0f0;
  color: #b42318;
  border: 1px solid #f3c0c0;
  font-size: 0.88rem;
  font-weight: 600;
}

.primary-button {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: #cf3d3d;
  color: #fff;
  transition: background 0.15s ease;
}

.primary-button:hover {
  background: #b83333;
}

.login-back {
  display: block;
  margin-top: 1.25rem;
  text-align: center;
  color: #888;
  font-size: 0.85rem;
  text-decoration: none;
}

.login-back:hover {
  color: #444;
}
</style>
