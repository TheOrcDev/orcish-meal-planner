export const Diet = {
    ANY: "Any",
    MEDITERRANEAN: "Mediterranean Diet",
    KETO: "Ketogenic (Keto) Diet",
    PALEO: "Paleo Diet",
    VEGETARIAN: "Vegetarian Diet",
    VEGAN: "Vegan Diet",
    GLUTEN_FREE: "Gluten-Free Diet",
    LOW_CARB: "Low Carb Diet",
} as const;
export type Diet = (typeof Diet)[keyof typeof Diet];

export const Goal = {
    LOSE_WEIGHT: "Lose Weight",
    HEALTHY: "To be Healthy",
    GAIN_MUSCLE: "Gain Muscle",
} as const;
export type Goal = (typeof Goal)[keyof typeof Goal];