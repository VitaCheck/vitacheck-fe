// import api from "@/lib/axios";

// export interface SupplementSummary {
//   supplementId: number;
//   supplementName: string;
//   brandName: string;
//   imageUrl: string;
//   searchCount: number;
// }

// export interface PagedResponse<T> {
//   isSuccess: boolean;
//   code: string;
//   message: string;
//   result: {
//     content: T[];
//     totalPages: number;
//     totalElements: number;
//     size: number;
//     number: number;
//     numberOfElements: number;
//     first: boolean;
//     last: boolean;
//     empty: boolean;
//   };
// }

// export async function getPopularSupplementsByAge(params: {
//   ageGroup: string;
//   page?: number;
//   size?: number;
// }): Promise<PagedResponse<SupplementSummary>> {
//   const { ageGroup, page = 0, size = 10 } = params;
//   const res = await api.get<PagedResponse<SupplementSummary>>(
//     "/api/v1/supplements/popular-supplements",
//     { params: { ageGroup, page, size } }
//   );
//   return res.data;
// }


import api from "@/lib/axios";

export type Gender = "MALE" | "FEMALE" | "ALL";

export interface SupplementSummary {
  supplementId: number;
  supplementName: string;
  brandName: string;
  imageUrl: string;
  searchCount: number;
}

export interface PagedResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}

interface PopularParams {
  ageGroup: string;
  page?: number;
  size?: number;
  gender?: Gender; // 선택
}

/**
 * 인기 영양제 조회 (비로그인 허용)
 * - gender 기본값은 'ALL'(미전달 시 전체로 처리)
 * - 토큰 없으면 Authorization 헤더 없이 호출
 */
export async function getPopularSupplementsByAge({
  ageGroup,
  page = 0,
  size = 10,
  gender = "ALL",
}: PopularParams): Promise<PagedResponse<SupplementSummary>> {
  const params: Record<string, string | number> = { ageGroup, page, size };
  if (gender !== "ALL") params.gender = gender;

  const token = localStorage.getItem("accessToken");

  // ✅ 로그인: Authorization 포함해서 axios 인스턴스로 호출
  if (token) {
    const res = await api.get<PagedResponse<SupplementSummary>>(
      "/api/v1/supplements/popular-supplements",
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }

  // ✅ 비로그인: 인터셉터 영향 없는 fetch로 호출
  const base = import.meta.env.VITE_SERVER_API_URL;
  const qs = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {})
  ).toString();

  const resp = await fetch(
    `${base}/api/v1/supplements/popular-supplements?${qs}`,
    { method: "GET" }
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`popular-supplements fetch failed: ${resp.status} ${text}`);
  }
  return (await resp.json()) as PagedResponse<SupplementSummary>;
}
