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
      const response = await axios.get(schedulesApiUrl);
      schedules.value = response.data;
    } catch (error) {
      console.error("Erreur de récupération des horaires :", error);
    }
  }

  async function createSchedule(schedule: Schedule) {
    await axios.post(schedulesApiUrl, schedule);
    await fetchSchedules();
  }

  return { schedules, fetchSchedules, createSchedule };
});
