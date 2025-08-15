import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cat from "../../assets/CatWithPointer.png";
import Chick from "../../assets/chick.png";
import flipIcon from "../../assets/flip.png";
import { FiSearch } from "react-icons/fi";
import axios from "@/lib/axios";

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

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
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
      } catch (error) {
        console.error("조합 추천 데이터를 불러오는 데 실패했습니다.", error);
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

    const updated = [
      trimmed,
      ...searchHistory.filter((item) => item !== trimmed),
    ].slice(0, 3);

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
      const parts = ingredientName.split("+").map((part) => part.trim());
      if (parts.every((part) => part.length < 7)) {
        return ingredientName;
      }
      return parts
        .map((part, index) => {
          if (index === 0) {
            return part;
          } else {
            return `\n+\n${part}`;
          }
        })
        .join("");
    }
    return ingredientName;
  };

  // 로딩 스켈레톤 카드 컴포넌트
  const LoadingSkeletonCard = ({ isMobile }: { isMobile: boolean }) => (
    <div
      className={`${isMobile ? "w-[150px] h-[135px]" : "w-[230px] h-[155px]"} bg-gray-200 rounded-[14px] animate-pulse relative overflow-hidden`}
    >
      {/* 반짝이는 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );

  const FlipCard: React.FC<FlipCardProps> = ({ name, description }) => {
    const [flipped, setFlipped] = useState(false);

    return (
      <>
        {/* 모바일용 카드 */}
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
            {/* 앞면 */}
            <div
              className="absolute w-full h-full bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[18px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden" }}
            >
              {name}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
            {/* 뒷면 */}
            <div
              className="absolute w-full h-full bg-[#FFFBCC] rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[18px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
          </div>
        </div>

        {/* PC용 카드 */}
        <div
          className="hidden md:block w-[230px] h-[155px] cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 앞면 */}
            <div
              className="absolute w-full h-full bg-white rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span style={{ whiteSpace: "pre-line" }}>
                {formatIngredientNameForPC(name)}
              </span>
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
            {/* 뒷면 */}
            <div
              className="absolute w-full h-full bg-[#FFFBCC] rounded-[14px] shadow-[2px_2px_12.2px_0px_#00000040] px-[6px] py-[10px] text-[20px] font-medium flex items-center justify-center text-center text-[#414141]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] w-[20px] h-[20px]"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFFFFF] md:bg-[#FAFAFA] px-0 md:px-4 py-0 font-pretendard flex flex-col">
      {/* 조합추가 - 모바일 버전 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[32px] leading-[100%] tracking-[-0.02em] mb-5 px-10 pt-10">
        조합 추가
      </h1>
      {/* 조합추가 - PC 버전 */}
      <h1 className="hidden md:block font-pretendard font-bold text-[40px] leading-[120%] tracking-[-0.02em] mb-8 px-[230px] pt-[50px]">
        조합 추가
      </h1>
      {/* 검색창 - 모바일 */}
      <div className="flex justify-center mb-4 md:hidden">
        <div className="w-[366px] h-[52px] bg-white border border-[#C7C7C7] rounded-[44px] flex items-center px-[18px] gap-[84px]">
          <input
            type="text"
            className="flex-1 h-full bg-transparent outline-none
        placeholder:font-Pretendard placeholder:font-small
        placeholder:text-black placeholder:opacity-40
        placeholder:leading-[120%] placeholder:tracking-[-0.02em]
        placeholder:text-[18px]"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={handleSearch} className="text-gray-400 text-xl">
            <FiSearch />
          </button>
        </div>
      </div>
      {/* 검색창 - PC */}
      <div className="hidden md:flex justify-center mb-3">
        <div className="w-[1000px] h-[70px] bg-transparent border border-[#C7C7C7] rounded-[88px] flex items-center px-[35.64px] gap-[165px]">
          <input
            type="text"
            className="flex-1 h-full bg-transparent outline-none
        placeholder:font-Pretendard placeholder:font-medium
        placeholder:text-black placeholder:opacity-40
        placeholder:leading-[30px] placeholder:tracking-[-0.02em]
        placeholder:text-[23px] 
        text-[23px] leading-[30px]"
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
        <div className="block md:hidden flex justify-center">
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
                  <img
                    src="/src/assets/delete.png"
                    alt="삭제 아이콘"
                    className="w-[16px] h-[16px] mt-[2px]"
                  />
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
                    `/add-combination?query=${encodeURIComponent(item)}`
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
      {/* 고양이 일러스트 + 설명 - 모바일 */}
      <div className="relative flex justify-center my-20 md:hidden">
        <div className="relative w-[200px]">
          {/* 왼쪽 텍스트 */}
          <p
            className="
      absolute text-start left-[-80px] top-[-30px]
      font-Pretendard font-medium text-black
      leading-[120%] tracking-[-0.02em]
      text-[18px] w-[200px]
    "
          >
            성분 과잉 섭취 <br />
            걱정 마세요!
          </p>

          {/* 고양이 이미지 */}
          <img src={Cat} alt="고양이" className="w-full" />

          {/* 병아리 이미지 */}
          <img
            src={Chick}
            alt="병아리"
            className="absolute bottom-[18px] left-[22px] w-[45px]"
          />

          {/* 오른쪽 텍스트 */}
          <p
            className="
      absolute text-right right-[-90px] bottom-[-30px]
      font-Pretendard font-medium text-black
      leading-[90%] tracking-[-0.02em]
      text-[18px] w-[200px]
    "
          >
            성분별 총량을 한눈에!
          </p>
        </div>
      </div>
      {/* 고양이 일러스트 + 설명 - PC */}
      <div className="relative flex justify-center my-14 hidden md:flex">
        <div className="relative w-[200px]">
          {/* 왼쪽 텍스트 */}
          <p
            className="
      absolute text-start left-[-380px] top-[20px]
      font-Pretendard font-medium text-black
      leading-[120%] tracking-[-0.02em]
      text-[32px] w-[500px]
    "
          >
            성분 과잉 섭취 걱정 마세요!
          </p>

          {/* 고양이 이미지 */}
          <img src={Cat} alt="고양이" className="w-full" />

          {/* 병아리 이미지 */}
          <img
            src={Chick}
            alt="병아리"
            className="absolute bottom-[18px] left-[22px] w-[45px]"
          />

          {/* 오른쪽 텍스트 */}
          <p
            className="
      absolute text-center right-[-400px] bottom-[30px]
      font-Pretendard font-medium text-black
      leading-[120%] tracking-[-0.02em]
      text-[32px] w-[500px]
    "
          >
            성분별 총량을 한눈에!
          </p>
        </div>
      </div>
      {/* 구분선 */}
      <div>
        {/* 모바일: 고정 너비 */}
        <div className="block md:hidden w-[390px] h-[0.5px] bg-[#B2B2B2] mx-auto" />
        {/* PC: 가로 길이 자동 확장 */}
        <div className="hidden md:block w-[1400px] h-[0.5px] bg-[#B2B2B2] mx-auto my-8" />
      </div>
      {/* 주의가 필요한 조합 안내 - 모바일 */}
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
      {/* 조합 카드들 - 모바일 */}
      <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[16px] ml-4 mr-4 mb-5 mt-5">
          {isLoading
            ? // 로딩 중일 때 스켈레톤 카드 5개 표시
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeletonCard key={index} isMobile={true} />
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
      {/* PC용 제목 및 카드 wrapper - 주의가 필요한 조합 */}
      <div className="hidden md:block px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px]">
        <h2 className="w-full h-auto text-[24px] lg:text-[28px] xl:text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-1 mt-3 text-left">
          주의가 필요한 조합 TOP 5
        </h2>
        <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B] text-left">
          카드를 눌러서 확인해 보세요 !
        </span>

        {/* 카드 목록 */}
        <div className="flex justify-center mt-8 mb-15">
          <div className="flex gap-[15px] lg:gap-[25px] xl:gap-[55px] w-[1150px]">
            {isLoading
              ? // 로딩 중일 때 스켈레톤 카드 5개 표시
                Array.from({ length: 5 }).map((_, index) => (
                  <LoadingSkeletonCard key={index} isMobile={false} />
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
      {/* ===== 모바일 - 궁합이 좋은 조합 안내 ===== */}
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
      {/* 조합 카드들 - 모바일 */}
      <div className="md:hidden px-3 hide-scrollbar overflow-x-auto">
        <div className="w-max flex gap-[16px] ml-4 mr-4 mb-15 mt-5">
          {isLoading
            ? // 로딩 중일 때 스켈레톤 카드 5개 표시
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeletonCard key={index} isMobile={true} />
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
      {/* PC용 제목 및 카드 wrapper - 궁합이 좋은 조합 */}
      <div className="hidden md:block px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px] ">
        <h2 className="w-full h-auto text-[24px] lg:text-[28px] xl:text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-1 mt-3 text-left">
          궁합이 좋은 조합 TOP 5
        </h2>
        <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-[#6B6B6B] text-left">
          카드를 눌러서 확인해 보세요 !
        </span>

        {/* 카드 목록 */}
        <div className="flex justify-center mt-8 mb-20">
          <div className="flex gap-[15px] lg:gap-[25px] xl:gap-[55px] w-[1150px]">
            {isLoading
              ? // 로딩 중일 때 스켈레톤 카드 5개 표시
                Array.from({ length: 5 }).map((_, index) => (
                  <LoadingSkeletonCard key={index} isMobile={false} />
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
  );
};

export default CombinationPage;
