import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrapList from "@/components/Scrap/ScrapList";
import ScrapTabHeader from "@/components/Scrap/ScrapTabHeader";
import ScrapIngredientList from "@/components/Scrap/ScrapIngredientList";
import {
  getLikedSupplements,
  type SupplementsScrapList,
  getLikedIngredients,
  type IngredientScrap,
  toggleLikeSupplement,
  toggleLikeIngredient,
} from "@/apis/scrapIngredientList";

const ScrapPage = () => {
  const [tab, setTab] = useState<"product" | "ingredient">("product");

  const [productItems, setProductItems] = useState<
    { id: number; imageUrl: string; title: string }[]
  >([]);

  // 성분은 id + name 으로 관리
  const [ingredientItems, setIngredientItems] = useState<
    { id: number; name: string }[]
  >([]);

  // 처리 중인 id
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const supplements: SupplementsScrapList[] = await getLikedSupplements();
        const mapped = supplements.map((item) => ({
          id: item.supplementId,
          imageUrl: item.imageUrl,
          title: item.name,
        }));
        setProductItems(mapped);
      } catch (error) {
        console.error("찜한 제품 로딩 실패:", error);
      }
    };

    const fetchLikedIngredientsFn = async () => {
      try {
        const ingredients: IngredientScrap[] = await getLikedIngredients();
        const mapped = ingredients.map((item) => ({
          id: item.ingredientId,
          name: item.name,
        }));
        setIngredientItems(mapped);
      } catch (error) {
        console.error("찜한 성분 로딩 실패:", error);
      }
    };

    if (tab === "product") fetchLikedProducts();
    else fetchLikedIngredientsFn();
  }, [tab]);

  // 제품 찜 토글(취소) - 옵티미스틱
  const handleToggleLikeProduct = async (id: number) => {
    if (processingIds.includes(id)) return;
    const removed = productItems.find((p) => p.id === id);
    if (!removed) return;

    setProcessingIds((prev) => [...prev, id]);
    setProductItems((prev) => prev.filter((p) => p.id !== id));

    try {
      await toggleLikeSupplement(id);
    } catch (e) {
      console.error("제품 찜 취소 실패, 롤백:", e);
      setProductItems((prev) => [removed, ...prev]);
      alert("찜 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setProcessingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  // 성분 찜 토글(취소) - 옵티미스틱
  const handleToggleLikeIngredient = async (id: number) => {
    if (processingIds.includes(id)) return;
    const removed = ingredientItems.find((i) => i.id === id);
    if (!removed) return;

    setProcessingIds((prev) => [...prev, id]);
    setIngredientItems((prev) => prev.filter((i) => i.id !== id));

    try {
      await toggleLikeIngredient(id);
    } catch (e) {
      console.error("성분 찜 취소 실패, 롤백:", e);
      setIngredientItems((prev) => [removed, ...prev]);
      alert("찜 취소에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setProcessingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <div className="bg-white sm:bg-[#F5F5F5] min-h-screen sm:pt-8 sm:px-4">
      <div className="sm:max-w-[850px] sm:mx-auto sm:bg-white sm:rounded-[20px] sm:shadow-sm sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="w-full px-6 pt-4 pb-2 flex items-center sm:px-0 sm:pt-0 sm:pb-4">
            <button
              onClick={goBack}
              className="mr-2 text-2xl text-black cursor-pointer sm:hidden"
              aria-label="뒤로가기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-[24px] font-semibold py-2">찜한 제품/성분</h1>
            </div>
          </div>
        </div>

        <ScrapTabHeader activeTab={tab} onChange={setTab} />

        {tab === "product" ? (
          <ScrapList
            items={productItems}
            onToggleLike={handleToggleLikeProduct}
            processingIds={processingIds}
          />
        ) : (
          <ScrapIngredientList
            items={ingredientItems}
            onToggleLike={handleToggleLikeIngredient}
            processingIds={processingIds}
          />
        )}
      </div>
    </div>
  );
};

export default ScrapPage;
