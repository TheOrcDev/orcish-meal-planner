export const Diet = {
  ANY: "Any",
  MEDITERRANEAN: "Mediterranean Diet",
  KETO: "Ketogenic (Keto) Diet",
  HIGH_PROTEIN: "High Protein Diet",
  PALEO: "Paleo Diet",
  VEGETARIAN: "Vegetarian Diet",
  VEGAN: "Vegan Diet",
  GLUTEN_FREE: "Gluten-Free Diet",
  LOW_CARB: "Low Carb Diet",
  LOW_FAT: "Low Fat Diet",
  CARNIVORE: "Carnivore Diet",
} as const;
export type Diet = (typeof Diet)[keyof typeof Diet];

export const Goal = {
  LOSE_WEIGHT: "Lose Weight",
  HEALTHY: "To be Healthy",
  GAIN_MUSCLE: "Gain Muscle",
  KEEP_FIT: "Keep Fit",
  MAINTAIN_WEIGHT: "Maintain Weight",
  IMPROVE_ENDURANCE: "Improve Endurance",
  BUILD_STRENGTH: "Build Strength",
  INCREASE_FLEXIBILITY: "Increase Flexibility",
  REDUCE_STRESS: "Reduce Stress",
  BOOST_IMMUNE_SYSTEM: "Boost Immune System",
  ENHANCE_MOOD: "Enhance Mood",
} as const;
export type Goal = (typeof Goal)[keyof typeof Goal];
