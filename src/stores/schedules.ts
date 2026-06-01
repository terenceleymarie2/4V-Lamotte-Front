import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type Game, type Schedule } from '../models/schedule';
import type { CreateScheduleRequest, PatchScheduleRequest } from '../models/scheduleRemote';
import { useCategoriesStore } from "./categories";
import { storeToRefs } from 'pinia';

const schedulesApiUrl = import.meta.env.VITE_API_URL;

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<Schedule[]>([]);
  const isAdmin = ref(sessionStorage.getItem('isAdmin') === 'true');
  const editTarget = ref<(Game & { date: string }) | null>(null);
  
  const categoriesStore = useCategoriesStore();
  const { selectedCompetition } = storeToRefs(categoriesStore);

  async function fetchSchedules() {
    try {
      const response = await axios.get(`${schedulesApiUrl}/v2/schedules?competition=${selectedCompetition.value}`);
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
