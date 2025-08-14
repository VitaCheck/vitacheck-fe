import axios from "@/lib/axios";
import type {
  IngredientSearchResponse,
  IngredientDetailResponse,
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
    // 실제 API 엔드포인트 사용
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

    if (!data.isSuccess) {
      throw new Error(data.message || "검색에 실패했습니다.");
    }

    return data;
  } catch (error: any) {
    console.error("🔍 [API] 검색 API 호출 실패:", error);

    if (error.response) {
      console.error("🔍 [API] 에러 응답 상태:", error.response.status);
      console.error("🔍 [API] 에러 응답 데이터:", error.response.data);
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

    if (!searchResponse.data.isSuccess || !searchResponse.data.result) {
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
    const detailResponse = await axios.get<IngredientDetailResponse>(
      `/api/v1/ingredients/${ingredientId}`
    );

    console.log("🏠 [API] 상세 정보 응답:", detailResponse.data);
    console.log(
      "🏠 [API] 상세 정보 응답 구조:",
      JSON.stringify(detailResponse.data, null, 2)
    );

    if (!detailResponse.data.isSuccess || !detailResponse.data.result) {
      console.warn(
        "🏠 [API] 응답 데이터 구조가 예상과 다름:",
        detailResponse.data
      );
      throw new Error(`Ingredient detail not found for: ${ingredientName}`);
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
    } else if (error.request) {
      console.error(
        "🏠 [API] 요청은 보냈지만 응답을 받지 못함:",
        error.request
      );
    } else {
      console.error("🏠 [API] 요청 설정 중 에러:", error.message);
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

    if (!searchResponse.data.isSuccess || !searchResponse.data.result) {
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
    console.log(
      "🥗 [API] 상세 정보 응답 구조:",
      JSON.stringify(detailResponse.data, null, 2)
    );

    if (!detailResponse.data.isSuccess || !detailResponse.data.result) {
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

// 관련 영양제 API
export const fetchIngredientSupplements = async (name: string | number) => {
  const ingredientName = String(name);
  console.log("💊 [API] fetchIngredientSupplements 호출됨");
  console.log("💊 [API] 요청 성분명:", ingredientName);

  try {
    // 1단계: 성분명으로 검색하여 id 얻기
    console.log("💊 [API] 1단계: 성분 검색 시작");
    const searchResponse = await axios.get<IngredientSearchResponse>(
      "/api/v1/ingredients/search",
      {
        params: { keyword: ingredientName },
      }
    );

    if (!searchResponse.data.isSuccess || !searchResponse.data.result) {
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

    console.log("💊 [API] 찾은 성분 ID:", ingredientId);

    // 2단계: id로 상세 정보 조회
    const detailResponse = await axios.get<IngredientDetailResponse>(
      `/api/v1/ingredients/${ingredientId}`
    );
    console.log("💊 [API] 상세 정보 응답:", detailResponse.data);
    console.log(
      "💊 [API] 상세 정보 응답 구조:",
      JSON.stringify(detailResponse.data, null, 2)
    );

    if (!detailResponse.data.isSuccess || !detailResponse.data.result) {
      console.warn(
        "💊 [API] 응답 데이터 구조가 예상과 다름:",
        detailResponse.data
      );
      return [];
    }

    const result = detailResponse.data.result;
    console.log("💊 [API] 파싱된 결과:", {
      name: result.name,
      supplements: result.supplements,
      supplementsType: typeof result.supplements,
      supplementsLength: Array.isArray(result.supplements)
        ? result.supplements.length
        : "not array",
    });

    return result.supplements || [];
  } catch (error: any) {
    console.error("💊 [API] 영양제 API 호출 실패:", error);

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

    return [];
  }
};

// 비타민 계열인지 확인하는 함수
export const isVitaminSeries = (name: string): boolean => {
  return /^비타민[A-Z]?$/.test(name);
};

// 성분 검색 결과를 비타민 계열과 단독 성분으로 분류하는 함수
export const classifyIngredientSearch = async (keyword: string) => {
  try {
    const searchResponse = await fetchIngredientSearch({ keyword });

    if (!searchResponse.isSuccess || !searchResponse.result) {
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
