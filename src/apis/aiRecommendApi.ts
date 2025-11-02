import api from "@/lib/axios";

// ✅ 요청 타입
export interface AiRecommendRequest {
  purposes: string[];
}

// ✅ 개별 추천 조합 타입
export interface AiCombination {
  combinationName: string;
  supplementIds: number[];
  reason: string;
}

// ✅ 응답 타입
export interface AiRecommendResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    recommendedCombinations: AiCombination[];
  };
}

// ✅ 함수 export
export const fetchAiRecommendations = async (
  body: AiRecommendRequest
): Promise<AiRecommendResponse> => {
  console.log("📤 보낸 요청:", JSON.stringify(body));

  try {
    const response = await api.post<AiRecommendResponse>(
      "/api/v1/ai/recommendations/combinations",
      body,
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    console.log("✅ 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ AI 추천 요청 에러:",
      error.response?.data || error.message
    );
    throw error;
  }
};
