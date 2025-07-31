import axios from "axios";

export interface SupplementsScrapList {
  supplementId: number;
  name: string;
  brandName: string;
  imageUrl: string;
  price: number;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;

export const getLikedSupplements = async (): Promise<
  SupplementsScrapList[]
> => {
  const token = localStorage.getItem("accessToken");

  const response = await axios.get(
    `${API_BASE_URL}/api/v1/supplements/likes/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.data.isSuccess) {
    return response.data.result;
  } else {
    throw new Error("찜한 제품 조회 실패");
  }
};
