import { defineStore } from "pinia";
import { CompetitionEnum, type Category } from "../models/schedule";
import { ref } from "vue";
import axios from "axios";
 
const schedulesApiUrl = import.meta.env.VITE_API_URL;

const defaultCompetition= CompetitionEnum._2026_CLUNY;
const selectedCompetition = ref<string>(defaultCompetition as unknown as string);

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);

  async function fetchCategories() {
    try {
      const response = await axios.get(`${schedulesApiUrl}/categories`);
      categories.value = response.data;
    } catch (error) {
      console.error("Erreur de récupération des categories :", error);
    }
  }

  function getCategoriesByCompetition() {
    return categories.value.filter(category => category.competition === selectedCompetition.value);
  }

    return { defaultCompetition, selectedCompetition, categories, fetchCategories, getCategoriesByCompetition };
});
