import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref([]);
  
  async function fetchSchedules() {
    console.log("Fetching schedules...");
    try {
      const response = await axios.get(`https://4-v-lamotte-back-3tdm.vercel.app/schedules`);
      schedules.value = response.data;
    } catch (error) {
      console.error("Erreur de récupération des horaires :", error);
    }
  }

  return { schedules, fetchSchedules }
})
