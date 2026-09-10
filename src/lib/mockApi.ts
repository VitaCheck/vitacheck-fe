import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import productImage from "@/assets/mainvita.png";

const products = [
  { id: 101, name: "센트룸 멀티비타민", brand: "센트룸", ingredients: ["비타민C", "비타민D", "아연"] },
  { id: 102, name: "종근당건강 프로메가 오메가3", brand: "종근당건강", ingredients: ["오메가3"] },
  { id: 103, name: "뉴트리코어 비타민D 4000IU", brand: "뉴트리코어", ingredients: ["비타민D"] },
  { id: 104, name: "락토핏 골드", brand: "종근당건강", ingredients: ["프로바이오틱스"] },
  { id: 105, name: "솔가 마그네슘", brand: "솔가", ingredients: ["마그네슘"] },
  { id: 106, name: "고려은단 비타민C 1000", brand: "고려은단", ingredients: ["비타민C"] },
];

const ingredients = [
  { id: 1, name: "비타민C", description: "항산화 작용과 정상적인 면역 기능에 필요한 영양소입니다.", effect: "항산화, 결합조직 형성, 철 흡수", caution: "과다 섭취 시 위장 불편을 느낄 수 있습니다.", recommendedDosage: 100, upperLimit: 2000, unit: "mg", alternatives: [{ name: "키위", imageOrEmoji: "🥝" }, { name: "파프리카", imageOrEmoji: "🫑" }] },
  { id: 2, name: "비타민D", description: "칼슘과 인의 흡수 및 이용에 필요한 영양소입니다.", effect: "뼈 건강, 면역 기능", caution: "지용성 비타민이므로 고용량 섭취 전 전문가와 상담하세요.", recommendedDosage: 15, upperLimit: 100, unit: "μg", alternatives: [{ name: "연어", imageOrEmoji: "🐟" }, { name: "달걀", imageOrEmoji: "🥚" }] },
  { id: 3, name: "오메가3", description: "EPA와 DHA를 포함한 필수지방산입니다.", effect: "혈행 건강, 기억력 개선", caution: "항응고제를 복용 중이라면 섭취 전 상담이 필요합니다.", recommendedDosage: 500, upperLimit: 3000, unit: "mg", alternatives: [{ name: "고등어", imageOrEmoji: "🐟" }, { name: "호두", imageOrEmoji: "🌰" }] },
  { id: 4, name: "마그네슘", description: "에너지 이용과 신경, 근육 기능에 필요한 미네랄입니다.", effect: "에너지 생성, 신경과 근육 기능", caution: "신장 질환이 있다면 전문가와 상담하세요.", recommendedDosage: 315, upperLimit: 350, unit: "mg", alternatives: [{ name: "아몬드", imageOrEmoji: "🥜" }, { name: "시금치", imageOrEmoji: "🥬" }] },
  { id: 5, name: "프로바이오틱스", description: "유익균을 보충해 장 건강을 돕는 성분입니다.", effect: "장 건강, 배변 활동", caution: "처음 섭취할 때 일시적인 복부 팽만이 있을 수 있습니다.", recommendedDosage: 100000000, upperLimit: 0, unit: "CFU", alternatives: [{ name: "요거트", imageOrEmoji: "🥛" }, { name: "김치", imageOrEmoji: "🥬" }] },
];

let likedSupplementIds = new Set([102, 104]);
let likedIngredientIds = new Set([1, 3]);
let routines = [
  { notificationRoutineId: 1, isCustom: false, supplementId: 101, supplementName: "센트룸 멀티비타민", supplementImageUrl: productImage, schedules: [{ dayOfWeek: "MON", time: "08:00" }, { dayOfWeek: "TUE", time: "08:00" }, { dayOfWeek: "WED", time: "08:00" }, { dayOfWeek: "THU", time: "08:00" }, { dayOfWeek: "FRI", time: "08:00" }], enabled: true, taken: false },
  { notificationRoutineId: 2, isCustom: false, supplementId: 102, supplementName: "종근당건강 프로메가 오메가3", supplementImageUrl: productImage, schedules: [{ dayOfWeek: "MON", time: "21:00" }, { dayOfWeek: "WED", time: "21:00" }, { dayOfWeek: "FRI", time: "21:00" }], enabled: true, taken: true },
];
let notificationSettings = [
  { type: "INTAKE", channel: "PUSH", enabled: true },
  { type: "EVENT", channel: "PUSH", enabled: false },
];

const ok = (result: unknown, message = "성공") => ({ isSuccess: true, code: "COMMON200", message, result });
const productSummary = (product: (typeof products)[number]) => ({
  id: product.id,
  supplementId: product.id,
  cursorId: 1_000_000 + product.id,
  name: product.name,
  supplementName: product.name,
  brand: product.brand,
  brandName: product.brand,
  imageUrl: productImage,
  supplementImageUrl: productImage,
  coupangUrl: "https://www.coupang.com/",
  coupangLink: "https://www.coupang.com/",
  price: 18900,
  description: `${product.name} 데모 제품입니다.`,
  method: "1일 1회, 식사 후 섭취",
  caution: "개인 건강 상태에 따라 섭취 전 전문가와 상담하세요.",
  ingredients: product.ingredients.map((ingredientName) => ({ ingredientName, amount: 100, unit: "mg" })),
  intakeTime: "식후",
  searchCount: 120,
});

const parseBody = (data: unknown) => {
  if (typeof data !== "string") return data as Record<string, unknown> | undefined;
  try { return JSON.parse(data) as Record<string, unknown>; } catch { return undefined; }
};

const listForKeyword = (keyword = "") => {
  const normalized = String(keyword).replaceAll(" ", "").toLowerCase();
  if (!normalized) return products;
  return products.filter((product) => `${product.name}${product.brand}${product.ingredients.join("")}`.replaceAll(" ", "").toLowerCase().includes(normalized));
};

const response = (config: AxiosRequestConfig, data: unknown): AxiosResponse => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: config as AxiosResponse["config"],
});

export const mockAdapter: AxiosAdapter = async (config) => {
  const url = config.url?.split("?")[0] ?? "";
  const method = config.method?.toLowerCase() ?? "get";
  const params = (config.params ?? {}) as Record<string, unknown>;
  const body = parseBody(config.data);

  if (url === "/api/v1/supplements/popular") {
    const content = products.map(productSummary);
    return response(config, ok({ content, totalPages: 1, totalElements: content.length, size: content.length, number: 0, numberOfElements: content.length, first: true, last: true, empty: false }));
  }

  if (url === "/api/v1/auth/login") {
    return response(config, ok({ accessToken: "demo-access-token", refreshToken: "demo-refresh-token" }, "데모 로그인 성공"));
  }

  if (url === "/api/v1/supplements/search") {
    const supplements = listForKeyword(String(params.keyword ?? "")).map(productSummary);
    return response(config, ok({ supplements, nextCursor: null }));
  }

  if (url === "/api/v1/supplements") {
    const product = products.find((item) => item.id === Number(params.id)) ?? products[0];
    return response(config, ok({ ...productSummary(product), brandId: product.id, brandImageUrl: null }));
  }

  if (url === "/api/v1/supplements/brand") {
    const product = products.find((item) => item.id === Number(params.id));
    const items = (product ? products.filter((item) => item.brand === product.brand) : products).map(productSummary);
    return response(config, { [product?.brand ?? "인기 제품"]: items });
  }

  if (url === "/api/v1/ingredients/search") {
    const keyword = String(params.keyword ?? "").replaceAll(" ", "").toLowerCase();
    const result = ingredients.filter((item) => !keyword || item.name.replaceAll(" ", "").toLowerCase().includes(keyword)).map(({ id, name, description }) => ({ id, name, description }));
    return response(config, ok(result));
  }

  if (url === "/api/v1/ingredients/popular") {
    return response(config, ok(ingredients.map((item, index) => ({ ingredientId: item.id, id: item.id, ingredientName: item.name, name: item.name, description: item.description, rank: index + 1, searchCount: 100 - index * 10 }))));
  }

  const ingredientMatch = url.match(/^\/api\/v1\/ingredients\/(\d+)(\/supplements|\/like)?$/);
  if (ingredientMatch) {
    const ingredient = ingredients.find((item) => item.id === Number(ingredientMatch[1])) ?? ingredients[0];
    if (ingredientMatch[2] === "/like") {
      if (likedIngredientIds.has(ingredient.id)) likedIngredientIds.delete(ingredient.id); else likedIngredientIds.add(ingredient.id);
      return response(config, ok({ isLiked: likedIngredientIds.has(ingredient.id) }));
    }
    if (ingredientMatch[2] === "/supplements") {
      const supplements = products.filter((item) => item.ingredients.includes(ingredient.name)).map(productSummary);
      return response(config, ok({ supplements, nextCursor: null }));
    }
    return response(config, ok({ ...ingredient, subIngredients: [], supplements: products.filter((item) => item.ingredients.includes(ingredient.name)).map(productSummary) }));
  }

  if (url === "/api/v1/purposes/filter") {
    const goals = Array.isArray(params.goals) ? params.goals : [params.goals ?? "EYE"];
    const nameByGoal: Record<string, string> = { EYE: "눈건강", IMMUNE: "면역력", TIRED: "피로감", SLEEP_STRESS: "수면/스트레스", BONE: "뼈건강" };
    return response(config, ok(goals.map((goal, index) => ({ name: nameByGoal[String(goal)] ?? "건강 관리", ingredients: [{ ingredientId: ingredients[index % ingredients.length].id, ingredientName: ingredients[index % ingredients.length].name, supplementInfos: products.filter((_, productIndex) => productIndex % 2 === index % 2).map(productSummary) }] }))));
  }

  if (url === "/api/v1/combinations/recommend") {
    return response(config, ok({ goodCombinations: [{ id: 1, type: "GOOD", name: "비타민D + 오메가3", description: "식사 후 함께 섭취하기 좋은 데모 조합입니다.", displayRank: 1 }, { id: 2, type: "GOOD", name: "비타민C + 아연", description: "면역 관리에 활용할 수 있는 데모 조합입니다.", displayRank: 2 }], cautionCombinations: [{ id: 3, type: "CAUTION", name: "마그네슘 + 고용량 비타민D", description: "개인 섭취량을 확인하고 조절하세요.", displayRank: 1 }] }));
  }

  if (url === "/api/v1/combinations/analyze") {
    return response(config, ok({ ingredientResults: [{ ingredientName: "비타민C", totalAmount: 1000, unit: "mg", recommendedAmount: 100, upperAmount: 2000, dosageRatio: 50, overRecommended: false }, { ingredientName: "비타민D", totalAmount: 25, unit: "μg", recommendedAmount: 15, upperAmount: 100, dosageRatio: 25, overRecommended: false }] }));
  }

  if (url === "/api/v1/likes/me") {
    return response(config, ok(products.filter((product) => likedSupplementIds.has(product.id)).map(productSummary)));
  }

  const supplementLikeMatch = url.match(/^\/api\/v1\/supplements\/(\d+)\/like$/);
  if (supplementLikeMatch) {
    const id = Number(supplementLikeMatch[1]);
    if (likedSupplementIds.has(id)) likedSupplementIds.delete(id); else likedSupplementIds.add(id);
    return response(config, ok({ isLiked: likedSupplementIds.has(id) }));
  }

  if (url === "/api/v1/users/me/likes/ingredients") {
    return response(config, ok(ingredients.filter((item) => likedIngredientIds.has(item.id)).map((item) => ({ ingredientId: item.id, name: item.name, effect: item.effect }))));
  }

  if (url === "/api/v1/notifications/routines") {
    if (method === "post" && body) {
      routines = [...routines, { notificationRoutineId: Date.now(), isCustom: true, supplementId: Number(body.supplementId) || 0, supplementName: String(body.supplementName ?? "나의 영양제"), supplementImageUrl: productImage, schedules: (body.schedules as never[]) ?? [], enabled: true, taken: false }];
    }
    return response(config, ok(routines));
  }

  if (url.startsWith("/api/v1/notifications/routines/")) return response(config, ok({}));

  if (url === "/api/v1/notification-settings/me") {
    if (method === "patch" && body) {
      notificationSettings = notificationSettings.map((setting) => setting.type === body.type && setting.channel === body.channel ? { ...setting, enabled: Boolean(body.isEnabled) } : setting);
    }
    return response(config, ok(notificationSettings));
  }

  if (url === "/api/v1/users/me") return response(config, ok({ email: "demo@vitacheck.com", nickname: "비타체크 데모", fullName: "VitaCheck Demo", provider: "EMAIL", age: 25, birthDate: "2001-01-01", phoneNumber: "010-0000-0000", gender: "FEMALE", profileImageUrl: null }));
  if (url === "/api/v1/users/me/profile-image") return response(config, ok(null));
  if (url === "/api/v1/terms") return response(config, ok([{ id: 1, title: "서비스 이용약관", content: "<p>VitaCheck 포트폴리오 데모 서비스 이용약관입니다.</p>", version: "1.0", effectiveDate: "2026-09-10", required: true }, { id: 2, title: "개인정보 처리방침", content: "<p>이 데모는 실제 개인정보를 수집하지 않습니다.</p>", version: "1.0", effectiveDate: "2026-09-10", required: true }]));
  if (url === "/api/v1/search/popular") return response(config, ok(["비타민D", "오메가3", "마그네슘", "유산균"].map((keyword, index) => ({ keyword, score: 100 - index * 10 }))));
  if (url === "/api/v1/recent") return response(config, ok(["비타민D", "오메가3", "마그네슘"]));
  if (url === "/api/v1/me/recent-products") return response(config, ok(products.slice(0, 3).map(productSummary)));
  if (url === "/api/v1/ai/recommendations/combinations") return response(config, ok({ recommendedCombinations: [{ combinationName: "활력 관리 조합", supplementIds: [101, 103], reason: "피로감과 면역 관리 목적의 데모 추천입니다." }, { combinationName: "눈 건강 조합", supplementIds: [102, 105], reason: "눈 건강과 일상 컨디션 관리를 위한 데모 추천입니다." }] }));

  return response(config, ok({}));
};
