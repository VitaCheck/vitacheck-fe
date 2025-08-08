import axios from "@/lib/axios";

export const fetchIngredientSearch = async ({
  ingredientName,
  keyword,
  brand,
}: {
  ingredientName?: string;
  keyword?: string;
  brand?: string;
}) => {
  const { data } = await axios.get("/api/v1/supplements/search", {
    params: {
      ingredientName,
      keyword,
      brand,
    },
  });
  return data;
};

// 1. 성분 상세 정보
export const fetchIngredientDetail = async (name: number) => {
  const encoded = encodeURIComponent(name);
  const res = await axios.get(`/api/ingredients/${encoded}`);
  console.log("📦 API 전체 응답:", res);
  return res.data.result;
};

// 2. 대체 식품
export const fetchIngredientAlternatives = async (name: string) => {
  const encoded = encodeURIComponent(name);
  const res = await axios.get(`/api/v1/ingredients/${encoded}/alternatives`);
  return res.data.result;
};

// 3. 관련 영양제
export const fetchIngredientSupplements = async (name: string) => {
  const encoded = encodeURIComponent(name);
  const res = await axios.get(`/api/v1/ingredients/${encoded}/supplements`);
  return res.data.result;
};
