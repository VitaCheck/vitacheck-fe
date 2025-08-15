import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/back.svg";
import {
  getPopularKeywords,
  getRecentKeywords,
  getRecentProducts,
  type PopularKeyword,
} from "@/apis/search";

export default function SearchPage() {
  const navigate = useNavigate();

  const [popular, setPopular] = useState<PopularKeyword[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);

  const [recent, setRecent] = useState<string[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);

  // 최근 본 상품
  const [recentProducts, setRecentProducts] = useState<
    { id: number; name: string; imageUrl: string }[]
  >([]);
  const [loadingRecentProducts, setLoadingRecentProducts] = useState(false);
  const [errorRecentProducts, setErrorRecentProducts] = useState<string | null>(
    null
  );

  useEffect(() => {
    let ignore = false;

    // 인기 검색어
    (async () => {
      try {
        setLoadingPopular(true);
        setErrorPopular(null);
        const data = await getPopularKeywords();
        if (!ignore) setPopular(data);
      } catch (e) {
        if (!ignore) setErrorPopular("인기 검색어를 불러오지 못했습니다.");
        console.error(e);
      } finally {
        if (!ignore) setLoadingPopular(false);
      }
    })();

    // 최근 검색어
    (async () => {
      try {
        setLoadingRecent(true);
        setErrorRecent(null);
        const data = await getRecentKeywords(3);
        if (!ignore) setRecent(data);
      } catch (e) {
        if (!ignore) setErrorRecent("최근 검색어를 불러오지 못했습니다.");
        console.error(e);
      } finally {
        if (!ignore) setLoadingRecent(false);
      }
    })();

    // 최근 본 상품
    (async () => {
      try {
        setLoadingRecentProducts(true);
        setErrorRecentProducts(null);
        const data = await getRecentProducts(5);
        if (!ignore) setRecentProducts(data);
      } catch (e) {
        if (!ignore)
          setErrorRecentProducts("최근 본 상품을 불러오지 못했습니다.");
        console.error(e);
      } finally {
        if (!ignore) setLoadingRecentProducts(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const goSearch = (word: string) => {
    navigate(`/searchresult?query=${encodeURIComponent(word)}`);
  };

  const goProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* 검색창 */}
      <div className="relative flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <img
            src={BackIcon}
            alt="뒤로가기"
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </button>
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>

      {/* 최근 검색어 */}
      <div className="px-3">
        <h3 className="text-[20px] font-bold mb-2">최근 검색어</h3>

        {loadingRecent && (
          <div className="text-[14px] text-[#6B6B6B]">불러오는 중...</div>
        )}
        {errorRecent && (
          <div className="text-[14px] text-red-600">{errorRecent}</div>
        )}

        {!loadingRecent && !errorRecent && (
          <div className="flex gap-2 flex-wrap">
            {recent.length === 0 ? (
              <span className="text-[14px] text-[#6B6B6B]">
                최근 검색어가 없습니다.
              </span>
            ) : (
              recent.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => goSearch(word)}
                  className="px-[20px] py-[5.94px] border border-[#000000] rounded-full text-[16px] cursor-pointer"
                  title={word}
                >
                  {word}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 최근 본 상품 */}
      <div className="px-3">
        <h3 className="text-[20px] font-bold mb-2">최근 본 상품</h3>

        {loadingRecentProducts && (
          <div className="text-[14px] text-[#6B6B6B]">불러오는 중...</div>
        )}
        {errorRecentProducts && (
          <div className="text-[14px] text-red-600">{errorRecentProducts}</div>
        )}

        {!loadingRecentProducts && !errorRecentProducts && (
          <div className="flex gap-3 overflow-x-auto">
            {recentProducts.length === 0 ? (
              <span className="text-[14px] text-[#6B6B6B]">
                최근 본 상품이 없습니다.
              </span>
            ) : (
              recentProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goProduct(p.id)}
                  className="shrink-0"
                  title={p.name}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-[128px] h-[128px] object-contain rounded-[7px] border border-[#6B6B6B] cursor-pointer"
                  />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 인기 검색어 */}
      <div className="px-3">
        <h3 className="text-[20px] font-bold mb-2">인기 검색어</h3>

        {loadingPopular && (
          <div className="text-[14px] text-[#6B6B6B]">불러오는 중...</div>
        )}
        {errorPopular && (
          <div className="text-[14px] text-red-600">{errorPopular}</div>
        )}

        {!loadingPopular && !errorPopular && (
          <div className="flex gap-3 flex-wrap">
            {popular.length === 0 ? (
              <span className="text-[14px] text-[#6B6B6B]">
                인기 검색어가 없습니다.
              </span>
            ) : (
              popular.map((item, idx) => (
                <button
                  key={`${item.keyword}-${idx}`}
                  type="button"
                  onClick={() => goSearch(item.keyword)}
                  className="bg-[#FFEB9D] px-[20px] py-[5.94px] rounded-full text-[16px] cursor-pointer"
                  title={`${item.keyword} (점수 ${item.score})`}
                >
                  {item.keyword}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
