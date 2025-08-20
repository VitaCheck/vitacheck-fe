import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cat from "../../assets/CatWithPointer.png";
import Chick from "../../assets/chick.png";
import flipIcon from "../../assets/flip.png";
import axios from "@/lib/axios";
import Navbar from "@/components/NavBar";

// 모바일 여부 판단용 훅
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return isMobile;
};

interface Combination {
  id: number;
  type: "GOOD" | "CAUTION";
  name: string;
  description: string;
  displayRank: number;
}

interface FlipCardProps {
  name: string;
  description: string;
}

const CombinationPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [riskyCombinations, setRiskyCombinations] = useState<Combination[]>([]);
  const [goodCombinations, setGoodCombinations] = useState<Combination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const placeholder = "제품을 입력해주세요.";
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/v1/combinations/recommend");
        const result = response.data.result;
        if (result) {
          setGoodCombinations(result.goodCombinations || []);
          setRiskyCombinations(result.cautionCombinations || []);
        } else {
          setGoodCombinations([]);
          setRiskyCombinations([]);
        }
      } catch (e) {
        console.error("조합 추천 데이터를 불러오는 데 실패했습니다.", e);
        setGoodCombinations([]);
        setRiskyCombinations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCombinations();
  }, []);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...searchHistory.filter((v) => v !== trimmed)].slice(0, 3);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`);
  };

  const handleDelete = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const formatIngredientNameForPC = (ingredientName: string) => {
    if (ingredientName.includes("+")) {
      const parts = ingredientName.split("+").map((p) => p.trim());
      if (parts.every((p) => p.length < 7)) return ingredientName;
      return parts
        .map((part, idx) => (idx === 0 ? part : `\n+\n${part}`))
        .join("");
    }
    return ingredientName;
  };

  const LoadingSkeletonCard = ({ isMobile }: { isMobile: boolean }) => (
    <div
      className={`${
        isMobile ? "w-[150px] h-[135px]" : "w-[230px] h-[155px]"
      } bg-gray-200 rounded-[14px] animate-pulse relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );

  const FlipCard: React.FC<FlipCardProps> = ({ name, description }) => {
    const [flipped, setFlipped] = useState(false);
    return (
      <>
        {/* 모바일 카드 */}
        <div
          className="block md:hidden w-[150px] h-[135px] cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute w-full h-full bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[18px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {name}
              <img src={flipIcon} alt="회전 아이콘" className="absolute top-[10px] right-[10px] w-[20px] h-[20px]" />
            </div>
            <div
              className="absolute w-full h-full bg-[#FFFBCC] rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[18px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {description}
              <img src={flipIcon} alt="회전 아이콘" className="absolute top-[10px] right-[10px] w-[20px] h-[20px]" />
            </div>
          </div>
        </div>

        {/* PC 카드 */}
        <div
          className="hidden md:block w-[235px] h-[165px] cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute w-full h-full bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[2px] py-[2px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span style={{ whiteSpace: "pre-line" }}>{formatIngredientNameForPC(name)}</span>
              <img src={flipIcon} alt="회전 아이콘" className="absolute top-[10px] right-[10px] w-[20px] h-[20px]" />
            </div>
            <div
              className="absolute w-full h-full bg-[#FFFBCC] rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {description}
              <img src={flipIcon} alt="회전 아이콘" className="absolute top-[10px] right-[10px] w-[20px] h-[20px]" />
            </div>
          </div>
        </div>
      </>
    );
  };

  // 모바일에서는 전역 헤더 숨김(있으면)
  useEffect(() => {
    if (!isMobile) return;
    const headerEl = document.querySelector("header");
    if (headerEl instanceof HTMLElement) {
      headerEl.style.display = "none";
    }
    return () => {
      if (headerEl instanceof HTMLElement) {
        headerEl.style.display = "";
      }
    };
  }, [isMobile]);

  return (
    <div className="px-4 sm:px-36 pt-2 sm:pt-10 max-w-screen-xl mx-auto">
      {/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      <div className="md:hidden">
        <Navbar />
      </div>
      
      {/* 조합추가 - 모바일 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[24px] leading-[100%] tracking-[-0.02em] mb-5 pl-2 pt-6">
        조합 추가
      </h1>

      {/* 조합추가 - PC */}
      <h1 className="hidden md:block text-2xl sm:text-4xl font-semibold mb-6 sm:mb-8 pl-2 sm:ml-8">조합 추가</h1>

      {/* 검색창 - 모바일 */}
<div className="flex justify-center mb-4 md:hidden">
  <div className="flex items-center w-full max-w-md px-4 py-3 bg-white border border-gray-300 rounded-full">
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
      className="w-full bg-transparent text-lg bg-transparent text-gray-400 placeholder-gray-300"
    />
    <img
      src="/src/assets/search.png"
      alt="검색"
      onClick={handleSearch}
      className="ml-2 w-5 h-5 cursor-pointer"
    />
  </div>
</div>


      {/* 검색창 - PC */}
      <section className="hidden md:flex justify-center mb-6">
        <div className="flex items-center w-full max-w-3xl rounded-full border border-gray-300 px-6 py-4 bg-white shadow-sm">
          <input
            type="text"
            placeholder="제품을 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="w-full outline-none text-base text-gray-800 placeholder-gray-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="ml-2 cursor-pointer">
              <img src="/images/성분 검색결과/x.png" alt="지우기" className="w-6 h-6" />
            </button>
          )}
          <img src="/src/assets/search.png" alt="검색" onClick={handleSearch} className="ml-2 w-6 h-6" />
        </div>
      </section>

      {/* 검색 기록 - 모바일 */}
      {searchHistory.length > 0 && (
        <div className="block md:hidden flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[14px]" style={{ width: "300px", height: "auto", opacity: 1 }}>
            {searchHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[4px]">
                <button
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(`/add-combination?query=${encodeURIComponent(item)}`);
                  }}
                  className="text-[13px] font-medium text-gray-700"
                >
                  {item}
                </button>
                <button onClick={() => handleDelete(item)} className="text-[16px] text-[#8A8A8A]" title="삭제">
                  <img src="/images/PNG/조합 2-1/delete.png" alt="삭제 아이콘" className="w-[16px] h-[16px] mt-[2px]" />
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
            <div key={idx} className="flex items-center gap-[8px] px-[12px] py-[4px] rounded-[6px] hover:bg-gray-100 transition">
              <button
                onClick={() => {
                  setSearchTerm(item);
                  navigate(`/add-combination?query=${encodeURIComponent(item)}`);
                }}
                className="text-[20px] font-Pretendard font-medium leading-[120%] tracking-[-0.02em] text-[#6B6B6B] hover:text-black"
              >
                {item}
              </button>
              <button onClick={() => handleDelete(item)} className="flex items-center justify-center w-[20px] h-[20px]" title="삭제">
                <img src="/images/PNG/조합 2-1/delete.png" alt="삭제" className="w-[16px] h-[16px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 고양이 일러스트 + 설명 - 모바일 */}
      <div className="relative flex justify-center my-20 md:hidden">
        <div className="relative w-[200px]">
          <p className="absolute text-start left-[-80px] top-[-30px] font-Pretendard font-medium text-black leading-[120%] tracking-[-0.02em] text-[18px] w-[200px]">
            성분 과잉 섭취 <br />
            걱정 마세요!
          </p>
          <img src={Cat} alt="고양이" className="w-full" />
          <img src={Chick} alt="병아리" className="absolute bottom-[18px] left-[22px] w-[45px]" />
          <p className="absolute text-right right-[-90px] bottom-[-30px] font-Pretendard font-medium text-black leading-[90%] tracking-[-0.02em] text-[18px] w-[200px]">
            성분별 총량을 한눈에!
          </p>
        </div>
      </div>

      {/* 고양이 일러스트 + 설명 - PC */}
 <div className="relative flex justify-center my-10 hidden md:flex w-full">
   <div className="relative flex items-center justify-center w-full max-w-screen-xl gap-[40px]">
    {/* 왼쪽 제목 (위쪽 정렬) */}
    <div className="flex flex-col justify-start h-full">
      <p className="font-Pretendard font-medium text-[25px] leading-[120%] tracking-[-0.02em] text-center">
        성분 과잉 섭취 걱정 마세요!
      </p>
    </div>

    {/* 가운데 이미지 */}
    <div className="relative w-[200px] shrink-0">
      <img src={Cat} alt="고양이" className="w-full" />
      <img
        src={Chick}
        alt="병아리"
        className="absolute bottom-[18px] left-[22px] w-[45px]"
      />
    </div>

    {/* 오른쪽 제목 (아래쪽 정렬) */}
    <div className="flex flex-col justify-end h-full">
      <p className="font-Pretendard font-medium text-[25px] leading-[120%] tracking-[-0.02em] text-center">
        성분별 총량을 한눈에!
      </p>
    </div>
  </div>
</div>

      {/* 구분선 (모바일) */}
      <div>
        <div className="block md:hidden w-[390px] h-[0.5px] bg-[#B2B2B2] mx-auto" />
      </div>

      {/* 주의가 필요한 조합 - 모바일 */}
      <div className="md:hidden px-7 mt-8">
        <h2
          style={{
            width: "390px",
            height: "26px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "22px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000000",
          }}
        >
         주의가 필요한 조합 TOP 5
        </h2>
        <p
          style={{
            width: "200px",
            height: "17px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#6B6B6B",
            marginTop: "6px",
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>

      {/* 조합 카드들 - 모바일 (주의) */}
      <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[16px] ml-4 mr-4 mb-5 mt-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <LoadingSkeletonCard key={i} isMobile />)
            : riskyCombinations.map((combo) => <FlipCard key={combo.id} name={combo.name} description={combo.description} />)}
        </div>
      </div>

      {/* 주의가 필요한 조합 - PC (풀블리드 배경) */}
<div className="hidden md:block">
  {/* 배경을 좌우 패딩까지 확장 */}
  <div className="-mx-4 lg:-mx-[80px] xl:-mx-[120px] 2xl:-mx-[250px]">
    {/* 안쪽은 다시 동일한 패딩으로 정렬 복구 */}
    <div className="px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px] max-w-screen-xl mx-auto">
      <h2 className="text-lg md:text-2xl font-semibold whitespace-nowrap pl-2">
        주의가 필요한 조합 TOP 5
      </h2>
      <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B]">
        카드를 눌러서 확인해 보세요 !
      </span>

      <div className="flex justify-center mt-8 mb-15">
        <div className="flex gap-[15px] lg:gap-[25px] xl:gap-[25px] w-full">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeletonCard key={i} isMobile={false} />
              ))
            : riskyCombinations.map((combo) => (
                <FlipCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description}
                />
              ))}
        </div>
      </div>
    </div>
  </div>
</div>


      {/* 궁합이 좋은 조합 - 모바일 */}
      <div className="md:hidden px-7 mt-10">
        <h2
          style={{
            width: "390px",
            height: "26px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "22px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#000000",
          }}
        >
          궁합이 좋은 조합 TOP 5
        </h2>
        <p
          style={{
            width: "300px",
            height: "17px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "120%",
            letterSpacing: "-0.02em",
            color: "#6B6B6B",
            marginTop: "6px",
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>

      {/* 조합 카드들 - 모바일 (좋음) */}
      <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[16px] ml-4 mr-4 mb-15 mt-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <LoadingSkeletonCard key={i} isMobile />)
            : goodCombinations.map((combo) => <FlipCard key={combo.id} name={combo.name} description={combo.description} />)}
        </div>
      </div>

             {/* 궁합이 좋은 조합 - PC (풀블리드 배경) */}
       <div className="hidden md:block">
         {/* 배경을 좌우 패딩까지 확장 */}
         <div className="-mx-4 lg:-mx-[80px] xl:-mx-[120px] 2xl:-mx-[250px]">
           {/* 안쪽은 다시 동일한 패딩으로 정렬 복구 */}
           <div className="px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px] max-w-screen-xl mx-auto">
             <h2 className="text-lg md:text-2xl font-semibold whitespace-nowrap pl-2">
               궁합이 좋은 조합 TOP 5
             </h2>
             <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B]">
               카드를 눌러서 확인해 보세요 !
             </span>

             <div className="flex justify-center mt-8 mb-20">
               <div className="flex gap-[15px] lg:gap-[25px] xl:gap-[25px] w-full">
                 {isLoading
                   ? Array.from({ length: 5 }).map((_, i) => (
                       <LoadingSkeletonCard key={i} isMobile={false} />
                     ))
                   : goodCombinations.map((combo) => (
                       <FlipCard
                         key={combo.id}
                         name={combo.name}
                         description={combo.description}
                       />
                     ))}
               </div>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default CombinationPage;
