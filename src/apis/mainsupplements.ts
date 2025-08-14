import api from "@/lib/axios";

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

export async function getPopularSupplementsByAge(params: {
  ageGroup: string;
  page?: number;
  size?: number;
}): Promise<PagedResponse<SupplementSummary>> {
  const { ageGroup, page = 0, size = 10 } = params;
  const res = await api.get<PagedResponse<SupplementSummary>>(
    "/api/v1/supplements/popular-supplements",
    { params: { ageGroup, page, size } }
  );
  return res.data;
}
