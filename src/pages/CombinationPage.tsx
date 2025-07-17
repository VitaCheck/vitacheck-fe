import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cat from "../assets/CatWithPointer.png";
import Chick from "../assets/chick.png";
import { FiSearch, FiX } from "react-icons/fi";

const CombinationPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const placeholder = "제품을 입력해주세요.";

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
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

  return (
    <div className="w-full bg-[#FAFAFA] px-0 md:px-4 py-0 font-pretendard">
      {/* 조합추가 - 모바일 버전 */}
      <h1 className="block md:hidden font-Pretendard font-bold text-[32px] leading-[100%] tracking-[-0.02em] mb-10 px-4 pt-0">
        조합추가
      </h1>

      {/* 조합추가 - PC 버전 */}

      <h1 className="hidden md:block font-Pretendard font-bold text-[52px] leading-[120%] tracking-[-0.02em] mb-8 px-[230px] pt-[50px]">
        조합추가
      </h1>

      {/* 검색창 - 모바일 */}
      <div className="flex justify-center mb-4 md:hidden">
        <div className="w-[366px] h-[52px] bg-[#f2f2f2] border border-[#C7C7C7] rounded-[44px] flex items-center px-[18px] gap-[84px] shadow-inner">
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
      <div className="hidden md:flex justify-center mb-8">
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
      <div className="block md:hidden mb-12 px-4">
        <div className="flex flex-wrap justify-start gap-1 text-[16px] text-gray-700">
          {searchHistory.length > 0
            ? searchHistory.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1 px-5">
                  <button
                    onClick={() => {
                      setSearchTerm(item);
                      navigate(
                        `/add-combination?query=${encodeURIComponent(item)}`
                      );
                    }}
                    className="hover:underline"
                  >
                    {item}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="hover:text-[#555555] ml-2"
                    title="삭제"
                  >
                    <FiX className="text-[#8A8A8A] text-[18px]" />
                  </button>
                </div>
              ))
            : ["검색 기록 1", "검색 기록 2", "검색 기록 3"].map((item, idx) => (
                <span
                  key={idx}
                  className="text-gray-300 bg-[#F5F5F5] px-4 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
        </div>
      </div>

      {/* 검색 기록 - PC */}
      <div className="hidden md:flex justify-center gap-6 text-xl text-gray-700 mb-12 flex-wrap px-[35.64px]">
        {searchHistory.length > 0
          ? searchHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-10 py-2">
                <button
                  onClick={() => {
                    setSearchTerm(item);
                    navigate(
                      `/add-combination?query=${encodeURIComponent(item)}`
                    );
                  }}
                  className="hover:underline"
                >
                  {item}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="hover:text-[#555555] ml-2"
                  title="삭제"
                >
                  <FiX className="text-[#8A8A8A] text-[18px]" />
                </button>
              </div>
            ))
          : ["검색 기록 1", "검색 기록 2", "검색 기록 3"].map((item, idx) => (
              <span
                key={idx}
                className="text-gray-300 bg-[#F5F5F5] px-6 py-2 rounded-full"
              >
                {item}
              </span>
            ))}
      </div>

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
      <div className="relative flex justify-center my-16 hidden md:flex">
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
        <div className="block md:hidden w-[390px] h-[0.5px] bg-[#B2B2B2] mx-auto my-8" />
        {/* PC: 가로 길이 자동 확장 */}
        <div className="hidden md:block w-[1400px] h-[0.5px] bg-[#B2B2B2] mx-auto my-8" />
      </div>

      {/* 주의 조합 */}
      <div className="mt-10 mb-10 max-w-[1400px] mx-auto">
        {/* 제목 */}
        {/* 모바일용 제목 */}
        <h2 className="block md:hidden w-[366px] px-[18px] h-[26px] text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-6">
          주의가 필요한 조합 TOP 5
        </h2>
        {/* 모바일 카드 */}
        <div className="md:hidden overflow-x-auto px-[18px]">
          <div className="flex gap-[17px] w-fit">
            {[
              "철분 + 칼슘",
              "아연 + 철분",
              "아연 + 구리",
              "비타민C + 철분",
              "칼슘 + 마그네슘",
            ].map((combo, i) => (
              <div
                key={i}
                className="w-[130px] h-[114px] rounded-[14px] px-[6px] py-[10px] 
          bg-white text-[16px] font-normal flex items-center justify-center 
          text-center shadow-[2px_2px_12.2px_0px_#00000040]"
              >
                {combo}
                <span className="absolute top-[10px] right-[10px] w-[18px] h-[18px] text-[#414141] rotate-90 text-[18px] flex items-center justify-center">
                  ⟳
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* PC용 제목 */}
        <h2 className="hidden md:block w-[1400px] px-[35.64px] h-[38px] text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-6">
          주의가 필요한 조합 TOP 5
        </h2>
        {/* PC 카드 */}
        <div className="hidden md:flex justify-center">
          <div className="flex gap-[50px]">
            {[
              "철분 + 칼슘",
              "아연 + 철분",
              "아연 + 구리",
              "비타민C + 철분",
              "칼슘 + 마그네슘",
            ].map((combo, i) => (
              <div
                key={i}
                className="w-[224px] h-[170px] rounded-[14px] px-[6px] py-[10px] 
          bg-white text-[25px] font-normal flex items-center justify-center 
          text-center shadow-[2px_2px_12.2px_0px_#00000040] relative"
              >
                {combo}
                <span className="absolute top-[10px] right-[10px] w-[18px] h-[18px] text-[#414141] rotate-90 text-[18px] flex items-center justify-center">
                  ⟳
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 좋은 조합 */}
      <div className="mb-10 max-w-[1400px] mx-auto">
        {/* 제목 */}
        {/* 모바일용 제목 */}
        <h2 className="block md:hidden w-[366px] px-[18px] h-[26px] text-[22px] font-semibold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-6">
          궁합이 좋은 조합 TOP 5
        </h2>
        {/* 모바일 카드 */}
        <div className="md:hidden overflow-x-auto px-[18px]">
          <div className="flex gap-[17px] w-fit">
            {[
              "철분 + 칼슘",
              "아연 + 철분",
              "아연 + 구리",
              "비타민C + 철분",
              "칼슘 + 마그네슘",
            ].map((combo, i) => (
              <div
                key={i}
                className="w-[130px] h-[114px] rounded-[14px] px-[6px] py-[10px] 
          bg-white text-[16px] font-normal flex items-center justify-center 
          text-center shadow-[2px_2px_12.2px_0px_#00000040]"
              >
                {combo}
                <span className="absolute top-[10px] right-[10px] w-[18px] h-[18px] text-[#414141] rotate-90 text-[18px] flex items-center justify-center">
                  ⟳
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* PC용 제목 */}
        <h2 className="hidden md:block w-[1500px] px-[35.64px] h-[38px] text-[32px] font-bold font-Pretendard leading-[120%] tracking-[-0.02em] text-black mb-6">
          궁합이 좋은 조합 TOP 5
        </h2>
        {/* PC 카드 */}
        <div className="hidden md:flex justify-center">
          <div className="flex gap-[50px]">
            {[
              "철분 + 칼슘",
              "아연 + 철분",
              "아연 + 구리",
              "비타민C + 철분",
              "칼슘 + 마그네슘",
            ].map((combo, i) => (
              <div
                key={i}
                className="w-[224px] h-[170px] rounded-[14px] px-[6px] py-[10px] 
          bg-white text-[25px] font-normal flex items-center justify-center 
          text-center shadow-[2px_2px_12.2px_0px_#00000040] relative"
              >
                {combo}
                <span className="absolute top-[10px] right-[10px] w-[18px] h-[18px] text-[#414141] rotate-90 text-[18px] flex items-center justify-center">
                  ⟳
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinationPage;
