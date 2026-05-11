import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Schedule } from '../models/schedule';

const schedulesApiUrl = import.meta.env.VITE_API_URL;

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<Schedule[]>([]);
  
  async function fetchSchedules() {
    console.log("Fetching schedules...");
    try {
      const response = await axios.get(`${schedulesApiUrl}/schedules`);
      schedules.value = response.data;
    } catch (error) {
      console.error("Erreur de récupération des horaires :", error);
    }
  }

  async function createSchedules(schedules: Schedule[]) {
    await axios.post(`${schedulesApiUrl}/v2/schedules`, schedules);
    await fetchSchedules();
  }

  return { schedules, fetchSchedules, createSchedules };
});
