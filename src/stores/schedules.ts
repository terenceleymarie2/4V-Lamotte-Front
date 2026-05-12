import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Schedule } from '../models/schedule';
import type { CreateScheduleRequest } from '../models/scheduleRemote';

const schedulesApiUrl = import.meta.env.VITE_API_URL;

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<Schedule[]>([]);
  const isAdmin = ref(sessionStorage.getItem('isAdmin') === 'true');
  
  async function fetchSchedules() {
    console.log("Fetching schedules...");
    try {
      const response = await axios.get(`${schedulesApiUrl}/v2/schedules`);
      schedules.value = response.data;
    } catch (error) {
      console.error("Erreur de récupération des horaires :", error);
    }
  }

  async function createSchedule(schedule: CreateScheduleRequest) {
    await axios.post(`${schedulesApiUrl}/v2/schedules`, schedule);
    await fetchSchedules();
  }

  async function deleteGame(id: number) {
    await axios.delete(`${schedulesApiUrl}/v2/schedules/${id}`);
    await fetchSchedules();
  }

  return { schedules, isAdmin, fetchSchedules, createSchedule, deleteGame };
});
