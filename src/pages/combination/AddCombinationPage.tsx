import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import CombinationProductCard from "../../components/combination/CombinationProductCard";
import ExpandableProductGroup from "../../components/combination/ExpandableProductGroup";
import SadCat from "../../../public/images/rate1.png";
import { FiSearch, FiX } from "react-icons/fi";

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

const AddCombinationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const query = searchParams.get("query") || "";
  const selectedProductNames = query ? query.split(",") : [];
  const preSelectedItems = location.state?.selectedItems || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const placeholder = "제품을 입력해주세요.";

  // 첫 렌더링에만 실행되도록 useEffect 분리
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSearchHistory(parsed);

      if (!searchTerm) {
        setSearchTerm(parsed[0] || "");
      }
    }
  }, []);

  useEffect(() => {
    if (preSelectedItems.length > 0) {
      setSelectedItems(preSelectedItems);
    }
  }, [preSelectedItems]);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...searchHistory.filter((item) => item !== trimmed),
    ].slice(0, 3);

    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);

    navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`, {
      replace: false,
      state: { selectedItems },
    });
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

  const handleDelete = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const filteredProducts = mockProducts.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] md:bg-[#FAFAFA] px-0 md:px-4 py-0 font-pretendard flex flex-col pb-[280px]">
      {/* 조합추가 - 모바일 버전 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[32px] leading-[100%] tracking-[-0.02em] mb-5 px-10 pt-10">
        조합 추가
      </h1>

      {/* 조합추가 - PC 버전 */}
      <h1 className="hidden md:block font-pretendard font-bold text-[52px] leading-[120%] tracking-[-0.02em] mb-8 px-[230px] pt-[50px]">
        조합 추가
      </h1>

      {/* 검색창 - 모바일 */}
      <div className="flex justify-center mb-4 md:hidden">
        <div className="w-[366px] h-[52px] bg-white border border-[#C7C7C7] rounded-[44px] flex items-center px-[18px] gap-[84px]">
          <input
            type="text"
            className="flex-1 h-full bg-transparent outline-none
            placeholder:font-pretendard placeholder:text-[18px]
            placeholder:text-black placeholder:opacity-40
            placeholder:leading-[120%] placeholder:tracking-[-0.02em]
            text-[18px]"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="text-gray-400 text-xl ml-[-18px]"
          >
            <FiSearch />
          </button>
        </div>
      </div>

      {/* 검색창 - PC */}
      <div className="hidden md:flex justify-center mb-3">
        <div className="w-[1400px] h-[85px] bg-transparent border border-[#C7C7C7] rounded-[88px] flex items-center px-[35.64px] gap-[165px]">
          <input
            type="text"
            className="flex-1 h-full bg-transparent outline-none
        placeholder:font-Pretendard placeholder:font-medium
        placeholder:text-black placeholder:opacity-40
        placeholder:leading-[30px] placeholder:tracking-[-0.02em]
        placeholder:text-[30px] 
        text-[30px] leading-[30px]"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={handleSearch} className="text-gray-400 text-2xl">
            <FiSearch />
          </button>
        </div>
      </div>

      {/* 검색 기록 - 모바일 */}
      {searchHistory.length > 0 && (
        <div className="block md:hidden mb-12 flex justify-center">
          <div
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[14px]"
            style={{ width: "300px", height: "auto", opacity: 1 }}
          >
            {searchHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[4px]">
                <button
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(
                      `/add-combination?query=${encodeURIComponent(item)}`
                    );
                  }}
                  className="text-[13px] font-medium text-gray-700"
                >
                  {item}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-[16px] text-[#8A8A8A]"
                  title="삭제"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 기록 - PC */}
      {searchHistory.length > 0 && (
        <div className="hidden md:flex justify-center gap-[24px] flex-wrap px-[35.64px] mb-5">
          {searchHistory.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-8 py-2">
              <button
                onClick={() => {
                  setSearchTerm(item);
                  navigate(
                    `/add-combination?query=${encodeURIComponent(item)}`,
                    {
                      replace: false,
                      state: { selectedItems },
                    }
                  );
                }}
                className="text-[20px] font-medium leading-[120%] tracking-[-0.02em] text-[#000000] hover:underline"
              >
                {item}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="text-[16px] text-[#8A8A8A]"
                title="삭제"
              >
                <img
                  src="/src/assets/delete.png"
                  alt="삭제 아이콘"
                  className="w-[28px] h-[28px] mt-[2.5px]"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 본문 */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="flex-1">
          {query && filteredProducts.length > 0 && (
            <>
              {/* 검색어 제목 - 모바일 */}
              <h2 className="block md:hidden font-pretendard font-bold text-[22px] leading-[120%] tracking-[-0.02em] px-[38px] mb-6">
                {query}
              </h2>

              {/* 검색어 제목 - PC */}
              <h2 className="hidden md:block font-pretendard font-bold text-[40px] leading-[120%] tracking-[-0.02em] mb-8 px-[230px] pt-[10px]">
                {query}
              </h2>
            </>
          )}

          {filteredProducts.length > 0 ? (
            <>
              {/* 모바일 카드: 펼쳐보기 적용 */}
              <div className="block md:hidden px-4">
                <ExpandableProductGroup
                  title={query}
                  products={filteredProducts}
                  selectedItems={selectedItems}
                  onToggle={handleToggle}
                  hideTitle={true}
                />
              </div>

              {/* PC 카드 */}
              <div className="hidden md:flex px-[230px] mt-[50px] mb-[60px] gap-[60px]">
                <div className="grid grid-cols-3 gap-[40px] w-[980px]">
                  {filteredProducts.map((item, idx) => (
                    <CombinationProductCard
                      key={idx}
                      item={item}
                      isSelected={selectedItems.some(
                        (i) => i.name === item.name
                      )}
                      onToggle={() => handleToggle(item)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            query && (
              <>
                <div className="block md:hidden flex flex-col items-center justify-center mt-20">
                  <img
                    src={SadCat}
                    alt="검색 결과 없음"
                    className="w-[160px] mt-5 mb-2"
                  />
                  <p className="font-pretendard font-medium text-[24px] leading-[120%] tracking-[-0.02em] text-[#808080] text-center">
                    일치하는 검색 결과가 없습니다.
                  </p>
                </div>

                {/* PC 전용: 검색 결과 없음 */}
                <div className="hidden md:flex flex-col items-center justify-center mt-20">
                  <img
                    src={SadCat}
                    alt="검색 결과 없음"
                    className="w-[200px] mt-5 mb-2"
                  />
                  <p className="font-pretendard font-medium text-[36px] leading-[120%] tracking-[-0.02em] text-[#808080]">
                    일치하는 검색 결과가 없습니다.
                  </p>
                </div>
              </>
            )
          )}
        </div>

        {/* 분석 목록 (검색 결과 있을 때만) */}
        {filteredProducts.length > 0 && (
          <>
            {/* PC 분석 목록 */}
            <div
              className="hidden lg:block absolute"
              style={{
                width: "314px",
                right: "250px",
                gap: "22px",
                opacity: 1,
              }}
            >
              {/* 분석 시작 버튼 */}
              <div className="w-[314px] flex-shrink-0">
                <button
                  onClick={() =>
                    navigate("/combination-result", {
                      state: { selectedItems },
                    })
                  }
                  className="w-full h-[80px] bg-[#FFEB9D] rounded-[59px] text-[30px] font-semibold font-pretendard leading-[120%] tracking-[-0.02em] text-center mt-[10px] mb-[30px]"
                >
                  분석 시작
                </button>

                {selectedItems.length > 0 && (
                  <div className="bg-[#F2F2F2] border border-[#9C9A9A] rounded-[36px] px-[34px] py-[33px] flex flex-col gap-10">
                    {selectedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-full h-[250px] bg-white border border-gray-200 rounded-[30px] flex flex-col items-center justify-center px-4 py-6 shadow"
                      >
                        <button
                          onClick={() => handleRemove(item.name)}
                          className="absolute top-3 right-4"
                        >
                          <img
                            src="/src/assets/delete.png"
                            alt="삭제"
                            className="w-[40px] h-[40px]"
                          />
                        </button>

                        <img
                          src={item.imageUrl}
                          className="w-[120px] h-[120px] object-contain mb-4"
                        />
                        <p className="text-sm text-center font-medium leading-tight">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 모바일 분석 목록 */}
            <div
              className="lg:hidden fixed bottom-0 left-0 w-full bg-white z-50"
              style={{
                boxShadow: "0px -22px 40px 0px #C1C1C140",
                paddingTop: "18px",
                paddingRight: "10px",
                paddingBottom: "max(20px, env(safe-area-inset-bottom))",
                paddingLeft: "10px",
                maxHeight: "280px",
                boxSizing: "border-box",
              }}
            >
              {/* 상단: 제목 & 시작 버튼 */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-pretendard font-bold text-[22px] leading-[120%] tracking-[-0.02em] px-3">
                  분석 목록
                </h3>
                <button
                  onClick={() =>
                    navigate("/combination-result", {
                      state: { selectedItems },
                    })
                  }
                  className="bg-transparent p-0 border-none" // 버튼 배경 제거 및 여백 제거
                >
                  <img
                    src="/src/assets/시작.png"
                    alt="분석 시작"
                    className="w-[67px] h-[32px] mr-1 object-contain"
                  />
                </button>
              </div>

              {/* 설명 텍스트 */}
              <p className="text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-[#808080] mb-5 font-pretendard px-3">
                최대 10개 선택
              </p>

              {/* 전체 감싸는 외곽 카드 */}
              <div
                className="w-full max-w-[600px] mx-auto rounded-[25px] border border-[#B2B2B2] bg-white overflow-x-auto hide-scrollbar"
                style={{ height: "160px" }}
              >
                <div className="flex gap-[10px] w-max">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-[130px] h-[130px] bg-white rounded-[10px] flex-shrink-0 flex flex-col items-center"
                      style={{
                        paddingTop: "22px",
                        paddingBottom: "12px",
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        className="w-[80px] h-[80px] mt-2 object-contain mb-3"
                      />
                      <p className="text-[13px] -mt-1 font-medium leading-[100%] tracking-[-0.02em] text-center font-pretendard text-black px-3">
                        {item.name}
                      </p>
                      <button
                        onClick={() => handleRemove(item.name)}
                        className="absolute bottom-23 right-1"
                      >
                        <img
                          src="/src/assets/delete.png"
                          alt="삭제"
                          className="w-[27px] h-[27px]"
                        />
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
};
export default AddCombinationPage;
