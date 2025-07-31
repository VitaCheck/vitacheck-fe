import axios from "../../../lib/axios.ts";
export const postCombinationAnalyze = async (supplementIds: number[]) => {
  const response = await axios.post("/api/v1/combinations/analyze", {
    supplementIds,
  });
  return response.data.result;
};

export const getCombinationRecommendations = async () => {
  const response = await axios.get("/api/v1/combinations/recommend");
  return response.data.result;
};
