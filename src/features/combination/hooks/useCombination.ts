import { useMutation, useQuery } from "@tanstack/react-query";
import {
  postCombinationAnalyze,
  getCombinationRecommendations,
} from "../api/combinationApi";

export const useCombinationAnalyze = () =>
  useMutation({
    mutationFn: postCombinationAnalyze,
  });

export const useCombinationRecommendations = () =>
  useQuery({
    queryKey: ["combination-recommend"],
    queryFn: getCombinationRecommendations,
  });
