import { defineStore } from "pinia";
import { CompetitionEnum, type Category } from "../models/schedule";
import { ref } from "vue";
import axios from "axios";
import { isEmpty } from "lodash";
 
const schedulesApiUrl = import.meta.env.VITE_API_URL;

const defaultCompetition= CompetitionEnum._2026_JARDY;
const selectedCompetition = ref<string>(defaultCompetition as unknown as string);

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);

  function getDefaultCompetition(): string {
    if (!isEmpty(categories.value)) {
      const cattegoriesByDate = categories.value.reduce((acc: Map<string, string>, category) => {
        if (!acc.has(category.date)) {
          acc.set(category.date, category.competition);
        }
        return acc;
      }, new Map<string, string>());
      const orderedCategoryDates = Array.from(cattegoriesByDate.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      return cattegoriesByDate.get(orderedCategoryDates[0] as string) || defaultCompetition;
    }
    return defaultCompetition;
  }

  async function fetchCategories() {
    try {
      const response = await axios.get(`${schedulesApiUrl}/categories`);
      categories.value = response.data;
      selectedCompetition.value = getDefaultCompetition();
    } catch (error) {
      console.error("Erreur de récupération des categories :", error);
    }
  }

  function getCategoriesByCompetition() {
    return categories.value.filter(category => category.competition === selectedCompetition.value);
  }

    return { defaultCompetition, selectedCompetition, categories, fetchCategories, getCategoriesByCompetition };
});
