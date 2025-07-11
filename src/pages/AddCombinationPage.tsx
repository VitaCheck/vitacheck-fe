import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import CombinationProductCard from "../components/CombinationProductCard";
import SelectedProductList from "../components/SelectedProductList";
import SadCat from "../assets/sad-cat.png";

const mockProducts = [
  { name: "고려은단 비타민E 400IU", imageUrl: "/images/vita1.png" },
  { name: "고려은단 비타민C 1000", imageUrl: "/images/vita2.png" },
  { name: "센트룸 비타민C 1000", imageUrl: "/images/vita3.png" },
  { name: "종근당 비타민E 400IU", imageUrl: "/images/vita4.png" },
  { name: "비오틴플러스 비타민C 1000", imageUrl: "/images/vita5.png" },
  { name: "고려은단 비타민B 복합", imageUrl: "/images/vita6.png" },
  { name: "뉴트리라이트 비타민D 2000IU", imageUrl: "/images/vita7.png" },
  { name: "GNC 비타민B 콤플렉스", imageUrl: "/images/vita8.png" },
  { name: "솔가 비타민E 400IU", imageUrl: "/images/vita9.png" },
  { name: "디어네이처 비타민C+D+아연", imageUrl: "/images/vita10.png" },
  { name: "종근당 락토핏 골드", imageUrl: "/images/lacto1.png" },
  { name: "종근당 락토핏 슬림", imageUrl: "/images/lacto2.png" },
  { name: "종근당 락토핏 패밀리", imageUrl: "/images/lacto3.png" },
  { name: "종근당 락토핏 코어", imageUrl: "/images/lacto4.png" },
  { name: "락토핏 키즈 프로바이오틱스", imageUrl: "/images/lacto5.png" },
  { name: "락토핏 맘 포스트바이오틱스", imageUrl: "/images/lacto6.png" },
  { name: "락토핏 위케어 유산균", imageUrl: "/images/lacto7.png" },
  { name: "락토핏 플러스 프로바이오틱스", imageUrl: "/images/lacto8.png" },
];

export default function AddCombinationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(defaultQuery);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...searchHistory.filter((item) => item !== trimmed),
    ].slice(0, 3);

    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);
    navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`);
  };

  const handleToggle = (item: any) => {
    const exists = selectedItems.find((i) => i.name === item.name);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.name !== item.name));
    } else {
      if (selectedItems.length >= 10) {
        alert("최대 10개까지 선택할 수 있습니다.");
        return;
      }
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemove = (name: string) => {
    setSelectedItems(selectedItems.filter((i) => i.name !== name));
  };

  const handleDeleteHistory = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const filteredProducts = mockProducts.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 font-pretendard pb-40">
      <NavBar />

      <h1 className="text-3xl font-extrabold mb-10">조합 추가</h1>

      {/* 검색창 */}
      <div className="flex items-center w-full bg-[#f2f2f2] rounded-full px-4 py-3 mb-4 shadow-inner">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
          placeholder="성분을 입력해주세요."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch} className="text-xl">
          🔍
        </button>
      </div>

      {/* 검색 기록 */}
      <div className="flex flex-wrap gap-3 justify-center text-sm mb-10">
        {searchHistory.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
          >
            <button
              onClick={() => {
                setQuery(item);
                navigate(`/add-combination?query=${encodeURIComponent(item)}`);
              }}
              className="hover:underline"
            >
              {item}
            </button>
            <button
              onClick={() => handleDeleteHistory(item)}
              className="text-gray-400 hover:text-red-500"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* 본문 */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">#{query}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((item, idx) => (
                  <CombinationProductCard
                    key={idx}
                    item={item}
                    isSelected={selectedItems.some((i) => i.name === item.name)}
                    onToggle={() => handleToggle(item)}
                  />
                ))}
              </div>
            </>
          ) : (
            query && (
              <div className="flex flex-col items-center justify-center mt-20">
                <img
                  src={SadCat}
                  alt="검색 결과 없음"
                  className="w-[120px] mb-4"
                />
                <p className="text-gray-500 text-base">
                  일치하는 검색 결과가 없습니다.
                </p>
              </div>
            )
          )}
        </div>

        {/* 분석 목록 - 검색 결과 있을 때만 표시 */}
        {filteredProducts.length > 0 && (
          <>
            {/* PC 사이드바 */}
            <div className="hidden lg:block w-[280px] shrink-0 sticky top-[100px] bg-white shadow-md rounded-lg p-4 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-base">분석 목록</h3>
                <button
                  onClick={() =>
                    navigate("/combination-result", { state: selectedItems })
                  }
                  className="text-sm bg-yellow-300 px-3 py-1 rounded-full"
                >
                  시작
                </button>
              </div>
              <SelectedProductList
                selectedItems={selectedItems}
                onRemove={handleRemove}
              />
            </div>

            {/* 모바일 하단 */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t rounded-t-xl shadow-2xl z-50">
              <div className="flex justify-between items-center px-4 pt-4">
                <h3 className="font-semibold text-sm">분석 목록</h3>
                <button className="text-sm bg-yellow-300 px-3 py-1 rounded-full">
                  시작
                </button>
              </div>
              <p className="px-4 text-xs text-gray-500 mb-2">최대 10개 선택</p>
              <div className="px-4 pb-4 overflow-x-auto">
                <div className="flex gap-3 w-max">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-[140px] min-w-[140px] p-2 rounded-xl shadow flex-shrink-0"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-[100px] object-contain rounded"
                      />
                      <p className="text-xs mt-1 text-center">{item.name}</p>
                      <button
                        onClick={() => handleRemove(item.name)}
                        className="absolute top-1 right-2 text-lg text-gray-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
