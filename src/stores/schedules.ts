import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Schedule, Game } from '../models/schedule';
import type { CreateScheduleRequest, PatchScheduleRequest } from '../models/scheduleRemote';

const schedulesApiUrl = import.meta.env.VITE_API_URL;

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<Schedule[]>([]);
  const isAdmin = ref(sessionStorage.getItem('isAdmin') === 'true');
  const editTarget = ref<(Game & { date: string }) | null>(null);
  
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

  async function patchGame(id: number, data: PatchScheduleRequest) {
    await axios.patch(`${schedulesApiUrl}/v2/schedules/${id}`, data);
    await fetchSchedules();
  }

  return { schedules, isAdmin, editTarget, fetchSchedules, createSchedule, deleteGame, patchGame };
});
