import axios from "@/lib/axios";
import type {
  IngredientSearchResponse,
  IngredientDetailResponse,
  IngredientSupplement,
} from "@/types/ingredient";

// 성분 검색 API
export const fetchIngredientSearch = async ({
  ingredientName,
  keyword,
  brand,
}: {
  ingredientName?: string;
  keyword?: string;
  brand?: string;
}) => {
  console.log("🔍 [API] fetchIngredientSearch 호출됨");
  console.log("🔍 [API] 파라미터:", { ingredientName, keyword, brand });

  try {
    // 스웨거 문서 기반 실제 API 엔드포인트
    const url = "/api/v1/ingredients/search";

    // keyword 파라미터가 우선순위를 가짐
    const searchKeyword = keyword || ingredientName || "";
    const params: any = { keyword: searchKeyword };

    // 브랜드 필터가 있으면 추가
    if (brand) {
      params.brand = brand;
    }

    console.log("🔍 [API] 요청 URL:", url);
    console.log("🔍 [API] 요청 파라미터:", params);

    const { data } = await axios.get<IngredientSearchResponse>(url, { params });
    console.log("🔍 [API] 실제 API 응답:", data);

    // API 응답 구조 검증
    if (!data || typeof data !== "object") {
      throw new Error("잘못된 API 응답 형식입니다.");
    }

    // isSuccess가 없는 경우에도 result가 있으면 성공으로 처리
    if (data.isSuccess === false) {
      throw new Error(data.message || "검색에 실패했습니다.");
    }

    // result가 배열이 아니면 빈 배열로 처리
    if (!Array.isArray(data.result)) {
      console.warn("🔍 [API] result가 배열이 아님:", data.result);
      return {
        ...data,
        result: [],
      };
    }

    return data;
  } catch (error: any) {
    console.error("🔍 [API] 검색 API 호출 실패:", error);

    if (error.response) {
      console.error("🔍 [API] 에러 응답 상태:", error.response.status);
      console.error("🔍 [API] 에러 응답 데이터:", error.response.data);

      // 404 에러인 경우 빈 결과 반환
      if (error.response.status === 404) {
        return {
          isSuccess: true,
          code: "200",
          message: "검색 결과가 없습니다.",
          result: [],
        };
      }
    } else if (error.request) {
      console.error(
        "🔍 [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
    } else {
      console.error("🔍 [API] 요청 설정 중 에러:", error.message);
    }

    throw error;
  }
};

// 성분 상세 정보 API
export const fetchIngredientDetail = async (name: string | number) => {
  const ingredientName = String(name);
  console.log("🏠 [API] fetchIngredientDetail 호출됨");
  console.log("🏠 [API] 요청 성분명:", ingredientName);

  try {
    // 1단계: 성분명으로 검색하여 id 얻기
    console.log("🏠 [API] 1단계: 성분 검색 시작");
    const searchResponse = await axios.get<IngredientSearchResponse>(
      "/api/v1/ingredients/search",
      {
        params: { keyword: ingredientName },
      }
    );

    console.log("🏠 [API] 검색 응답:", searchResponse.data);

    // 검색 응답 검증
    if (!searchResponse.data || !searchResponse.data.result) {
      throw new Error(`검색 결과가 없습니다: ${ingredientName}`);
    }

    // 검색 결과에서 첫 번째 성분의 id 사용
    const searchResults = searchResponse.data.result;
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error(`검색 결과가 없습니다: ${ingredientName}`);
    }

    const firstResult = searchResults[0];
    const ingredientId = firstResult.id; // "id" 필드 사용

    if (!ingredientId) {
      throw new Error(`검색 결과에서 id를 찾을 수 없습니다: ${ingredientName}`);
    }

    console.log("🏠 [API] 찾은 성분 ID:", ingredientId);

    // 2단계: id로 상세 정보 조회
    console.log("🏠 [API] 2단계: 상세 정보 조회 시작");

    let detailResponse;
    try {
      detailResponse = await axios.get<IngredientDetailResponse>(
        `/api/v1/ingredients/${ingredientId}`
      );
    } catch (error: any) {
      // 401 에러인 경우 (로그인되지 않은 사용자) - 기본 정보만 반환
      if (error.response?.status === 401) {
        console.log("🏠 [API] 로그인되지 않은 사용자 - 기본 정보만 반환");
        return {
          id: ingredientId,
          name: ingredientName,
          description: undefined,
          effect: undefined,
          caution: undefined,
          gender: undefined,
          age: undefined,
          upperLimit: undefined,
          recommendedDosage: undefined,
          unit: undefined,
          subIngredients: [],
          alternatives: [],
          supplements: [],
          dosageErrorCode: "UNAUTHORIZED",
          foodErrorCode: undefined,
        };
      }
      // 다른 에러는 그대로 던짐
      throw error;
    }

    console.log("🏠 [API] 상세 정보 응답:", detailResponse.data);

    // 상세 정보 응답 검증
    if (!detailResponse.data) {
      throw new Error("상세 정보 응답이 없습니다.");
    }

    // isSuccess가 false인 경우 에러 처리
    if (detailResponse.data.isSuccess === false) {
      throw new Error(
        detailResponse.data.message || "상세 정보를 가져올 수 없습니다."
      );
    }

    // result가 없는 경우 에러 처리
    if (!detailResponse.data.result) {
      throw new Error("상세 정보 결과가 없습니다.");
    }

    const result = detailResponse.data.result;
    console.log("🏠 [API] 파싱된 결과:", {
      name: result.name,
      description: result.description,
      effect: result.effect,
      caution: result.caution,
      upperLimit: result.upperLimit,
      recommendedDosage: result.recommendedDosage,
      unit: result.unit,
      subIngredients: result.subIngredients,
      alternatives: result.alternatives,
      supplements: result.supplements,
    });

    return result;
  } catch (error: any) {
    console.error("🏠 [API] 성분 상세 정보 API 호출 실패:", error);

    if (error.response) {
      console.error("🏠 [API] 에러 응답 상태:", error.response.status);
      console.error("🏠 [API] 에러 응답 데이터:", error.response.data);
      console.error("🏠 [API] 에러 응답 헤더:", error.response.headers);

      // 404 에러인 경우 더 명확한 메시지
      if (error.response.status === 404) {
        throw new Error(`성분을 찾을 수 없습니다: ${ingredientName}`);
      }
    } else if (error.request) {
      console.error(
        "🏠 [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
      throw new Error(
        "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
      );
    } else {
      console.error("🏠 [API] 요청 설정 중 에러:", error.message);
      throw error;
    }

    throw error;
  }
};

// 대체 식품 API
export const fetchIngredientAlternatives = async (name: string | number) => {
  const ingredientName = String(name);
  console.log("🥗 [API] fetchIngredientAlternatives 호출됨");
  console.log("🥗 [API] 요청 성분명:", ingredientName);

  try {
    // 1단계: 성분명으로 검색하여 id 얻기
    console.log("🥗 [API] 1단계: 성분 검색 시작");
    const searchResponse = await axios.get<IngredientSearchResponse>(
      "/api/v1/ingredients/search",
      {
        params: { keyword: ingredientName },
      }
    );

    if (!searchResponse.data || !searchResponse.data.result) {
      return [];
    }

    const searchResults = searchResponse.data.result;
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return [];
    }

    const firstResult = searchResults[0];
    const ingredientId = firstResult.id; // "id" 필드 사용

    if (!ingredientId) {
      return [];
    }

    console.log("🥗 [API] 찾은 성분 ID:", ingredientId);

    // 2단계: id로 상세 정보 조회
    const detailResponse = await axios.get<IngredientDetailResponse>(
      `/api/v1/ingredients/${ingredientId}`
    );
    console.log("🥗 [API] 상세 정보 응답:", detailResponse.data);

    if (!detailResponse.data || !detailResponse.data.result) {
      console.warn(
        "🥗 [API] 응답 데이터 구조가 예상과 다름:",
        detailResponse.data
      );
      return [];
    }

    const result = detailResponse.data.result;
    console.log("🥗 [API] 파싱된 결과:", {
      name: result.name,
      alternatives: result.alternatives,
      alternativesType: typeof result.alternatives,
      alternativesLength: Array.isArray(result.alternatives)
        ? result.alternatives.length
        : "not array",
    });

    return result.alternatives || [];
  } catch (error: any) {
    console.error("🥗 [API] 대체 식품 API 호출 실패:", error);

    if (error.response) {
      console.error("🥗 [API] 에러 응답 상태:", error.response.status);
      console.error("🥗 [API] 에러 응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error(
        "🥗 [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
    } else {
      console.error("🥗 [API] 요청 설정 중 에러:", error.message);
    }

    return [];
  }
};

// 영양제 페이징 API 응답 타입
interface SupplementPagingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    supplements?: IngredientSupplement[];
    supplementInfos?: IngredientSupplement[];
    nextCursor: string | null;
  };
}

// 영양제 페이징 API (새로 분리된 API)
export const fetchIngredientSupplementsPaging = async (
  name: string | number,
  cursor?: string
) => {
  const ingredientName = String(name);
  console.log("💊 [API] fetchIngredientSupplementsPaging 호출됨");
  console.log("💊 [API] 요청 성분명:", ingredientName);
  console.log("💊 [API] 커서:", cursor);

  try {
    // 1단계: 성분명으로 검색하여 id 얻기
    console.log("💊 [API] 1단계: 성분 검색 시작");
    const searchResponse = await axios.get<IngredientSearchResponse>(
      "/api/v1/ingredients/search",
      {
        params: { keyword: ingredientName },
      }
    );

    if (!searchResponse.data || !searchResponse.data.result) {
      return { supplements: [], nextCursor: null };
    }

    const searchResults = searchResponse.data.result;
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return { supplements: [], nextCursor: null };
    }

    const firstResult = searchResults[0];
    const ingredientId = firstResult.id;

    if (!ingredientId) {
      return { supplements: [], nextCursor: null };
    }

    console.log("💊 [API] 찾은 성분 ID:", ingredientId);

    // 영양제 API 호출
    const params: any = {};
    if (cursor) params.cursor = cursor;
    params.size = params.size ?? 40;

    const supplementsResponse = await axios.get<SupplementPagingResponse>(
      `/api/v1/ingredients/${ingredientId}/supplements`,
      { params }
    );

    const res = supplementsResponse.data;
    const result = res?.result ?? {};
    const rawList = Array.isArray(result.supplements)
      ? result.supplements
      : Array.isArray(result.supplementInfos)
        ? result.supplementInfos
        : [];

    const mapped = rawList.map((s: any) => ({
      id: s.id ?? s.supplementId,
      name: s.name ?? s.supplementName,
      imageUrl: s.imageUrl ?? "",
      coupangUrl: s.coupangUrl ?? "",
    }));

    return {
      supplements: mapped,
      nextCursor: result.nextCursor ?? null,
    };
  } catch (error: any) {
    console.error("💊 [API] 영양제 페이징 API 호출 실패:", error);

    if (error.response) {
      console.error("💊 [API] 에러 응답 상태:", error.response.status);
      console.error("💊 [API] 에러 응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error(
        "💊 [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
    } else {
      console.error("💊 [API] 요청 설정 중 에러:", error.message);
    }

    return { supplements: [], nextCursor: null };
  }
};

// 기존 영양제 API (하위 호환성을 위해 유지)
export const fetchIngredientSupplements = async (name: string | number) => {
  const result = await fetchIngredientSupplementsPaging(name);
  return result.supplements;
};

// 비타민 계열인지 확인하는 함수
export const isVitaminSeries = (name: string): boolean => {
  return /^비타민[A-Z]?$/.test(name);
};

// 성분 검색 결과를 비타민 계열과 단독 성분으로 분류하는 함수
export const classifyIngredientSearch = async (keyword: string) => {
  try {
    const searchResponse = await fetchIngredientSearch({ keyword });

    if (!searchResponse || !searchResponse.result) {
      return { isVitamin: false, results: [], shouldShowList: false };
    }

    const results = searchResponse.result;
    const isVitamin = isVitaminSeries(keyword);

    // 비타민 계열이면 리스트 표시, 단독 성분이면 바로 상세 페이지로
    const shouldShowList = isVitamin && results.length > 1;

    return {
      isVitamin,
      results,
      shouldShowList,
      firstResult: results[0],
    };
  } catch (error) {
    console.error("🔍 [API] 성분 분류 실패:", error);
    return { isVitamin: false, results: [], shouldShowList: false };
  }
};

// 성분 찜하기 API
export const toggleIngredientLike = async (ingredientId: number) => {
  console.log("❤️ [API] toggleIngredientLike 호출됨");
  console.log("❤️ [API] 요청 성분 ID:", ingredientId);

  try {
    const url = `/api/v1/ingredients/${ingredientId}/like`;
    console.log("❤️ [API] 요청 URL:", url);

    const { data } = await axios.post(url);
    console.log("❤️ [API] 찜하기 API 응답:", data);

    return data;
  } catch (error: any) {
    console.error("❤️ [API] 찜하기 API 호출 실패:", error);

    if (error.response) {
      console.error("❤️ [API] 에러 응답 상태:", error.response.status);
      console.error("❤️ [API] 에러 응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error(
        "❤️ [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
    } else {
      console.error("❤️ [API] 요청 설정 중 에러:", error.message);
    }

    throw error;
  }
};

// 검색 기록 API
export const recordSearchLog = async (keyword: string) => {
  console.log("📝 [API] recordSearchLog 호출됨");
  console.log("📝 [API] 검색 키워드:", keyword);

  try {
    const url = "/api/v1/search/logs";
    const params = { keyword };

    console.log("📝 [API] 요청 URL:", url);
    console.log("📝 [API] 요청 파라미터:", params);

    // 검색 기록은 실패해도 검색 기능에 영향을 주지 않도록 처리
    await axios.get(url, { params });
    console.log("📝 [API] 검색 기록 성공");
  } catch (error: any) {
    console.error("📝 [API] 검색 기록 실패:", error);
    // 검색 기록 실패는 무시하고 계속 진행
  }
};

// 인기성분 TOP 5 조회 API
export const fetchPopularIngredients = async (ageGroup: string) => {
  console.log("🔥 [API] fetchPopularIngredients 호출됨");
  console.log("🔥 [API] 요청 연령대:", ageGroup);

  try {
    // 스웨거 문서 기반 올바른 API 엔드포인트 사용
    let url = "/api/v1/ingredients/popular";
    let params: any = { limit: 5 };

    // ageGroup 파라미터 처리 - 항상 전송
    params.ageGroup = ageGroup;

    console.log("🔥 [API] 요청 URL:", url);
    console.log("🔥 [API] 요청 파라미터:", params);
    console.log("🔥 [API] 백엔드로 전송할 ageGroup:", ageGroup);
    console.log(
      "🔥 [API] 최종 요청 URL:",
      `${url}?${new URLSearchParams(params).toString()}`
    );

    // 커스텀 axios 인스턴스 사용 (인증 헤더 자동 처리)
    const { data } = await axios.get(url, { params });
    console.log("🔥 [API] 인기성분 API 응답:", data);
    console.log("🔥 [API] 응답 구조 분석:");
    console.log("  - data.result:", data?.result);
    console.log("  - data.result.content:", data?.result?.content);
    console.log("  - data.result.content 길이:", data?.result?.content?.length);
    if (data?.result?.content && Array.isArray(data.result.content)) {
      console.log("  - 첫 번째 항목:", data.result.content[0]);
      console.log(
        "  - 첫 번째 항목 키들:",
        Object.keys(data.result.content[0] || {})
      );
    }

    // API 응답 구조에 맞게 데이터 변환
    if (data && data.result) {
      let convertedResult = [];

      // result.content가 있는 경우 (페이징 응답)
      if (data.result.content && Array.isArray(data.result.content)) {
        convertedResult = data.result.content.map(
          (ingredient: any, index: number) => ({
            id: ingredient.id || index + 1,
            ingredientName:
              ingredient.name ||
              ingredient.ingredientName ||
              `성분${index + 1}`,
          })
        );
      }
      // result가 직접 배열인 경우
      else if (Array.isArray(data.result)) {
        convertedResult = data.result.map((ingredient: any, index: number) => ({
          id: ingredient.id || index + 1,
          ingredientName:
            ingredient.name || ingredient.ingredientName || `성분${index + 1}`,
        }));
      }

      // 변환된 데이터가 있으면 반환
      if (convertedResult.length > 0) {
        return {
          ...data,
          result: convertedResult,
        };
      }
    }

    return data;
  } catch (error: any) {
    console.error("🔥 [API] 인기성분 API 호출 실패:", error);

    if (error.response) {
      console.error("🔥 [API] 에러 응답 상태:", error.response.status);
      console.error("🔥 [API] 에러 응답 데이터:", error.response.data);

      // 401 에러가 발생하면 기본 성분 리스트 반환
      if (error.response.status === 401) {
        console.log("🔥 [API] 401 에러 발생 - 기본 성분 리스트 반환");
        return {
          isSuccess: true,
          code: "200",
          message: "기본 성분 리스트",
          result: [
            { id: 1, ingredientName: "비타민C" },
            { id: 2, ingredientName: "오메가3" },
            { id: 3, ingredientName: "프로바이오틱스" },
            { id: 4, ingredientName: "마그네슘" },
            { id: 5, ingredientName: "비타민D" },
          ],
        };
      }

      // 500 에러인 경우 더 자세한 정보 로깅
      if (error.response.status === 500) {
        console.error("🔥 [API] 요청했던 URL:", error.config?.url);
        console.error("🔥 [API] 요청했던 파라미터:", error.config?.params);
        console.error("🔥 [API] 요청했던 ageGroup:", ageGroup);
        console.error(
          "🔥 [API] 백엔드 에러 메시지:",
          error.response.data?.message
        );
      }
    } else if (error.request) {
      console.error(
        "🔥 [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
    } else {
      console.error("🔥 [API] 요청 설정 중 에러:", error.message);
    }

    throw error;
  }
};
