import api from "@/lib/axios";

export interface SupplementDetail {
  supplementId: number;
  brandName: string;
  brandImageUrl: string;
  supplementName: string;
  supplementImageUrl: string;
  coupangLink: string;
  intakeTime: string;
}

export interface SupplementDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SupplementDetail;
}

export const fetchSupplementDetail = async (
  id: number
): Promise<SupplementDetail> => {
  const response = await api.get<SupplementDetailResponse>(
    `/api/v1/supplements`,
    { params: { id } }
  );
  return response.data.result;
};
