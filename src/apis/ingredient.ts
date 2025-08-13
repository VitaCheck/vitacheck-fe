import axios from "@/lib/axios";

interface IngredientAlternative {
  name: string;
  imageOrEmoji: string;
}

interface IngredientSupplement {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
}

interface IngredientData {
  name: string;
  description: string;
  effect: string;
  caution: string;
  upperLimit: number;
  recommendedDosage: number;
  unit: string;
  subIngredients: string[];
  alternatives: IngredientAlternative[];
  supplements: IngredientSupplement[];
}

// 더미 데이터 추가
const DUMMY_INGREDIENT_DATA: Record<string, IngredientData> = {
  비타민A: {
    name: "비타민A",
    description:
      "비타민A는 시각 기능, 면역 체계, 세포 성장에 중요한 역할을 하는 지용성 비타민입니다.",
    effect: "야맹증 예방, 시각 기능 향상, 면역력 증진, 피부 건강 유지",
    caution:
      "과다 섭취 시 두통, 메스꺼움, 간 손상 등의 부작용이 있을 수 있습니다. 임산부는 특히 주의해야 합니다.",
    upperLimit: 3000,
    recommendedDosage: 900,
    unit: "μg",
    subIngredients: ["베타카로틴", "레티놀"],
    alternatives: [
      { name: "요거트", imageOrEmoji: "🥛" },
      { name: "발효 식초", imageOrEmoji: "🍎" },
      { name: "김치", imageOrEmoji: "🥬" },
      { name: "된장", imageOrEmoji: "🫘" },
      { name: "장아찌", imageOrEmoji: "🥒" },
      { name: "오이", imageOrEmoji: "🥒" },
    ],
    supplements: [
      {
        id: 1,
        name: "비타민A 1000IU",
        brand: "네추럴라이프",
        price: 15000,
        rating: 4.5,
      },
      {
        id: 2,
        name: "비타민A 플러스",
        brand: "헬스원",
        price: 22000,
        rating: 4.2,
      },
    ],
  },
  비타민C: {
    name: "비타민C",
    description:
      "비타민C는 항산화 작용을 하는 수용성 비타민으로, 콜라겐 합성과 면역 체계 강화에 중요합니다.",
    effect: "항산화 작용, 콜라겐 합성, 면역력 증진, 철분 흡수 촉진",
    caution: "과다 섭취 시 설사, 복통 등의 위장 장애가 발생할 수 있습니다.",
    upperLimit: 2000,
    recommendedDosage: 100,
    unit: "mg",
    subIngredients: ["아스코르브산", "칼슘아스코르베이트"],
    alternatives: [
      { name: "레몬", imageOrEmoji: "🍋" },
      { name: "오렌지", imageOrEmoji: "🍊" },
      { name: "브로콜리", imageOrEmoji: "🥦" },
      { name: "피망", imageOrEmoji: "🫑" },
      { name: "키위", imageOrEmoji: "🥝" },
      { name: "딸기", imageOrEmoji: "🍓" },
    ],
    supplements: [
      {
        id: 3,
        name: "비타민C 1000mg",
        brand: "네추럴라이프",
        price: 12000,
        rating: 4.7,
      },
    ],
  },
  // 소문자 버전
  비타민a: {
    name: "비타민A",
    description:
      "비타민A는 시각 기능, 면역 체계, 세포 성장에 중요한 역할을 하는 지용성 비타민입니다.",
    effect: "야맹증 예방, 시각 기능 향상, 면역력 증진, 피부 건강 유지",
    caution:
      "과다 섭취 시 두통, 메스꺼움, 간 손상 등의 부작용이 발생할 수 있습니다. 임산부는 특히 주의해야 합니다.",
    upperLimit: 3000,
    recommendedDosage: 900,
    unit: "μg",
    subIngredients: ["베타카로틴", "레티놀"],
    alternatives: [
      { name: "요거트", imageOrEmoji: "🥛" },
      { name: "발효 식초", imageOrEmoji: "🍎" },
      { name: "김치", imageOrEmoji: "🥬" },
      { name: "된장", imageOrEmoji: "🫘" },
      { name: "장아찌", imageOrEmoji: "🥒" },
      { name: "오이", imageOrEmoji: "🥒" },
    ],
    supplements: [
      {
        id: 1,
        name: "비타민A 1000IU",
        brand: "네추럴라이프",
        price: 15000,
        rating: 4.5,
      },
      {
        id: 2,
        name: "비타민A 플러스",
        brand: "헬스원",
        price: 22000,
        rating: 4.2,
      },
    ],
  },
  비타민c: {
    name: "비타민C",
    description:
      "비타민C는 항산화 작용을 하는 수용성 비타민으로, 콜라겐 합성과 면역 체계 강화에 중요합니다.",
    effect: "항산화 작용, 콜라겐 합성, 면역력 증진, 철분 흡수 촉진",
    caution: "과다 섭취 시 설사, 복통 등의 위장 장애가 발생할 수 있습니다.",
    upperLimit: 2000,
    recommendedDosage: 100,
    unit: "mg",
    subIngredients: ["아스코르브산", "칼슘아스코르베이트"],
    alternatives: [
      { name: "레몬", imageOrEmoji: "🍋" },
      { name: "오렌지", imageOrEmoji: "🍊" },
      { name: "브로콜리", imageOrEmoji: "🥦" },
      { name: "피망", imageOrEmoji: "🫑" },
      { name: "키위", imageOrEmoji: "🥝" },
      { name: "딸기", imageOrEmoji: "🍓" },
    ],
    supplements: [
      {
        id: 3,
        name: "비타민C 1000mg",
        brand: "네추럴라이프",
        price: 12000,
        rating: 4.7,
      },
    ],
  },
  유산균: {
    name: "유산균",
    description:
      "우리 몸에 살고 있는 100개가 넘는 균주 중에서 몸에 좋은 균을 유익균(유산균) 또는 프로바이오틱스라고 해요. 반대로 나쁜 영향을 주는 균을 '유해균'이라고 해요.건강한 장 환경과 원활한 배변활동을 위해서는 여러 종류의 균들이 균형을 이뤄야해요.",
    effect: "장 건강 개선, 면역력 강화, 피부 건강 개선, 대사 조절",
    caution: "프로바이오틱스(유산균) 알러지 주의",
    upperLimit: 50,
    recommendedDosage: 0.6,
    unit: "mg",
    subIngredients: ["락토바실러스", "비피도박테리움"],
    alternatives: [
      { name: "요거트", imageOrEmoji: "🥛" },
      { name: "발효 식초", imageOrEmoji: "🍎" },
      { name: "김치", imageOrEmoji: "🥬" },
      { name: "된장", imageOrEmoji: "🫘" },
      { name: "장아찌", imageOrEmoji: "🥒" },
      { name: "오이", imageOrEmoji: "🥒" },
    ],
    supplements: [
      {
        id: 4,
        name: "유산균 100억",
        brand: "네추럴라이프",
        price: 25000,
        rating: 4.6,
      },
      {
        id: 5,
        name: "프로바이오틱스 플러스",
        brand: "헬스원",
        price: 30000,
        rating: 4.4,
      },
    ],
  },
  글루타치온: {
    name: "글루타치온",
    description:
      "글루타치온은 항산화 작용을 하는 아미노산으로, 세포 보호와 해독 작용에 중요한 역할을 합니다.",
    effect: "항산화 작용, 해독 작용, 면역력 증진, 피부 건강 개선",
    caution:
      "과다 섭취 시 두통이나 현기증이 발생할 수 있습니다. 임산부나 수유부는 의사와 상담 후 섭취해야 합니다.",
    upperLimit: 500,
    recommendedDosage: 100,
    unit: "mg",
    subIngredients: ["글루타민", "시스테인"],
    alternatives: [
      { name: "브로콜리", imageOrEmoji: "🥦" },
      { name: "마늘", imageOrEmoji: "🧄" },
      { name: "양파", imageOrEmoji: "🧅" },
      { name: "아스파라거스", imageOrEmoji: "🫛" },
      { name: "시금치", imageOrEmoji: "🥬" },
      { name: "아보카도", imageOrEmoji: "🥑" },
    ],
    supplements: [
      {
        id: 6,
        name: "글루타치온 500mg",
        brand: "네추럴라이프",
        price: 45000,
        rating: 4.8,
      },
    ],
  },
  밀크씨슬: {
    name: "밀크씨슬",
    description:
      "밀크씨슬은 간 건강에 도움을 주는 허브 성분으로, 실리마린이라는 활성 성분을 함유하고 있습니다.",
    effect: "간 기능 개선, 해독 작용, 항산화 작용, 지방 대사 촉진",
    caution:
      "과다 섭취 시 복통이나 설사가 발생할 수 있습니다. 간 질환이 있는 경우 의사와 상담 후 섭취해야 합니다.",
    upperLimit: 420,
    recommendedDosage: 140,
    unit: "mg",
    subIngredients: ["실리마린", "실리빈"],
    alternatives: [
      { name: "아티초크", imageOrEmoji: "🥬" },
      { name: "우엉", imageOrEmoji: "🥬" },
      { name: "민들레", imageOrEmoji: "🌼" },
      { name: "감초", imageOrEmoji: "🌿" },
      { name: "강황", imageOrEmoji: "🟡" },
      { name: "생강", imageOrEmoji: "🫘" },
    ],
    supplements: [
      {
        id: 7,
        name: "밀크씨슬 500mg",
        brand: "네추럴라이프",
        price: 28000,
        rating: 4.5,
      },
    ],
  },
  오메가3: {
    name: "오메가3",
    description:
      "오메가3는 필수 지방산으로, 심혈관 건강과 뇌 기능 향상에 중요한 역할을 하는 영양소입니다.",
    effect: "심혈관 건강 개선, 뇌 기능 향상, 염증 감소, 시력 보호",
    caution:
      "과다 섭취 시 출혈 위험이 증가할 수 있습니다. 혈액 응고제를 복용 중인 경우 의사와 상담해야 합니다.",
    upperLimit: 3000,
    recommendedDosage: 1000,
    unit: "mg",
    subIngredients: ["EPA", "DHA", "ALA"],
    alternatives: [
      { name: "고등어", imageOrEmoji: "🐟" },
      { name: "연어", imageOrEmoji: "🐟" },
      { name: "견과류", imageOrEmoji: "🥜" },
      { name: "아마씨", imageOrEmoji: "🌱" },
      { name: "치아씨드", imageOrEmoji: "🌱" },
      { name: "월넛", imageOrEmoji: "🌰" },
    ],
    supplements: [
      {
        id: 8,
        name: "오메가3 1000mg",
        brand: "네추럴라이프",
        price: 35000,
        rating: 4.7,
      },
      {
        id: 9,
        name: "피쉬오일 플러스",
        brand: "헬스원",
        price: 42000,
        rating: 4.6,
      },
    ],
  },
};

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

  // 더미 데이터로 테스트
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 [API] 개발 환경 - 더미 데이터 사용");
    const results = Object.entries(DUMMY_INGREDIENT_DATA)
      .filter(([key, data]) => {
        if (
          ingredientName &&
          !key.toLowerCase().includes(ingredientName.toLowerCase())
        )
          return false;
        if (keyword && !data.name.toLowerCase().includes(keyword.toLowerCase()))
          return false;
        return true;
      })
      .map(([key, data]) => ({
        ingredientId: key,
        ingredientName: data.name,
        amount: 0,
        unit: "string",
      }));

    console.log("🔍 [API] 더미 데이터 결과:", results);
    return { results };
  }

  const { data } = await axios.get("/api/v1/supplements/search", {
    params: {
      ingredientName,
      keyword,
      brand,
    },
  });
  return data;
};

// 스웨거 문서에 따른 성분 상세 정보 API
export const fetchIngredientDetail = async (name: string | number) => {
  const ingredientName = String(name);
  console.log("🏠 [API] fetchIngredientDetail 호출됨");
  console.log("🏠 [API] 요청 성분명:", ingredientName);

  // 더미 데이터로 테스트
  if (process.env.NODE_ENV === "development") {
    console.log("🏠 [API] 개발 환경 - 더미 데이터 사용");
    const dummyData = DUMMY_INGREDIENT_DATA[ingredientName];
    console.log("🏠 [API] 더미 데이터 검색 결과:", dummyData);

    if (!dummyData) {
      console.error(
        "🏠 [API] 더미 데이터에서 성분을 찾을 수 없음:",
        ingredientName
      );
      throw new Error(`Ingredient detail not found for: ${ingredientName}`);
    }

    console.log("🏠 [API] 더미 데이터 반환:", dummyData);
    return dummyData;
  }

  const encoded = encodeURIComponent(ingredientName);
  const res = await axios.get(`/api/v1/ingredients/${encoded}`);

  if (!res.data || !res.data.result) {
    throw new Error(`Ingredient detail not found for: ${ingredientName}`);
  }

  return res.data.result;
};

// 대체 식품 API
export const fetchIngredientAlternatives = async (name: string | number) => {
  const ingredientName = String(name);
  console.log("🥗 [API] fetchIngredientAlternatives 호출됨");
  console.log("🥗 [API] 요청 성분명:", ingredientName);

  // 더미 데이터로 테스트
  if (process.env.NODE_ENV === "development") {
    console.log("🥗 [API] 개발 환경 - 더미 데이터 사용");
    const dummyData = DUMMY_INGREDIENT_DATA[ingredientName];
    console.log("🥗 [API] 더미 데이터 검색 결과:", dummyData);

    if (!dummyData) {
      console.warn(
        "🥗 [API] 더미 데이터에서 성분을 찾을 수 없음:",
        ingredientName
      );
      return [];
    }

    const alternatives = dummyData.alternatives || [];
    console.log("🥗 [API] 대체식품 데이터:", alternatives);
    return alternatives;
  }

  const encoded = encodeURIComponent(ingredientName);
  const res = await axios.get(`/api/v1/ingredients/${encoded}`);
  return res.data.result.alternatives || [];
};

// 관련 영양제 API
export const fetchIngredientSupplements = async (name: string | number) => {
  const ingredientName = String(name);
  console.log("💊 [API] fetchIngredientSupplements 호출됨");
  console.log("💊 [API] 요청 성분명:", ingredientName);

  // 더미 데이터로 테스트
  if (process.env.NODE_ENV === "development") {
    console.log("💊 [API] 개발 환경 - 더미 데이터 사용");
    const dummyData = DUMMY_INGREDIENT_DATA[ingredientName];
    console.log("💊 [API] 더미 데이터 검색 결과:", dummyData);

    if (!dummyData) {
      console.warn(
        "💊 [API] 더미 데이터에서 성분을 찾을 수 없음:",
        ingredientName
      );
      return [];
    }

    const supplements = dummyData.supplements || [];
    console.log("💊 [API] 영양제 데이터:", supplements);
    return supplements;
  }

  const encoded = encodeURIComponent(ingredientName);
  const res = await axios.get(`/api/v1/ingredients/${encoded}`);
  return res.data.result.supplements || [];
};
