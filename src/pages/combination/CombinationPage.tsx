import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cat from '../../assets/CatWithPointer.png';
import Chick from '../../assets/chick.png';
import flipIcon from '../../assets/flip.png';
import axios from '@/lib/axios';
import Navbar from '@/components/NavBar';

// 모바일 여부 판단용 훅
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return isMobile;
};

interface Combination {
  id: number;
  type: 'GOOD' | 'CAUTION';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [riskyCombinations, setRiskyCombinations] = useState<Combination[]>([]);
  const [goodCombinations, setGoodCombinations] = useState<Combination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const placeholder = '제품을 입력해주세요.';
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/v1/combinations/recommend');
        const result = response.data.result;
        if (result) {
          setGoodCombinations(result.goodCombinations || []);
          setRiskyCombinations(result.cautionCombinations || []);
        } else {
          setGoodCombinations([]);
          setRiskyCombinations([]);
        }
      } catch (e) {
        console.error('조합 추천 데이터를 불러오는 데 실패했습니다.', e);
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
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    navigate(`/add-combination?query=${encodeURIComponent(trimmed)}`);
  };

  const handleDelete = (itemToDelete: string) => {
    const updated = searchHistory.filter((item) => item !== itemToDelete);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const formatIngredientNameForPC = (ingredientName: string) => {
    if (ingredientName.includes('+')) {
      const parts = ingredientName.split('+').map((p) => p.trim());
      if (parts.every((p) => p.length < 7)) return ingredientName;
      return parts.map((part, idx) => (idx === 0 ? part : `\n+\n${part}`)).join('');
    }
    return ingredientName;
  };

  const LoadingSkeletonCard = ({ isMobile }: { isMobile: boolean }) => (
    <div
      className={`${
        isMobile ? 'h-[135px] w-[150px]' : 'h-[155px] w-[230px]'
      } relative animate-pulse overflow-hidden rounded-[14px] bg-gray-200`}
    >
      <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );

  const FlipCard: React.FC<FlipCardProps> = ({ name, description }) => {
    const [flipped, setFlipped] = useState(false);
    return (
      <>
        {/* 모바일 카드 */}
        <div
          className="block h-[135px] w-[150px] cursor-pointer md:hidden"
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative h-full w-full transition-transform duration-500 ${
              flipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {name}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[18px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
          </div>
        </div>

        {/* PC 카드 */}
        <div
          className="hidden h-[165px] w-[235px] cursor-pointer md:block"
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative h-full w-full transition-transform duration-500 ${
              flipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-white px-[2px] py-[2px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span style={{ whiteSpace: 'pre-line' }}>{formatIngredientNameForPC(name)}</span>
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-[14px] bg-[#FFFBCC] px-[6px] py-[10px] text-center text-[20px] font-medium text-[#414141] shadow-[2px_2px_12.2px_0px_#00000040]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              {description}
              <img
                src={flipIcon}
                alt="회전 아이콘"
                className="absolute top-[10px] right-[10px] h-[20px] w-[20px]"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  // 모바일에서는 전역 헤더 숨김(있으면)
  useEffect(() => {
    if (!isMobile) return;
    const headerEl = document.querySelector('header');
    if (headerEl instanceof HTMLElement) {
      headerEl.style.display = 'none';
    }
    return () => {
      if (headerEl instanceof HTMLElement) {
        headerEl.style.display = '';
      }
    };
  }, [isMobile]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-2 sm:px-36 sm:pt-10">
      {/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      <div className="md:hidden">
        <Navbar />
      </div>

      {/* 조합추가 - 모바일 */}
      <h1 className="font-Pretendard mb-5 block pt-6 pl-2 text-[24px] leading-[100%] font-bold tracking-[-0.02em] md:hidden">
        조합 추가
      </h1>

      {/* 조합추가 - PC */}
      <h1 className="mb-6 hidden pl-2 text-2xl font-semibold sm:mb-8 sm:ml-8 sm:text-4xl md:block">
        조합 추가
      </h1>

      {/* 검색창 - 모바일 */}
      <div className="mb-4 flex justify-center md:hidden">
        <div className="flex w-full max-w-md items-center rounded-full border border-gray-300 bg-white px-4 py-3">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-full bg-transparent text-lg text-gray-400 placeholder-gray-300"
          />
          <img
            src="/images/search.png"
            alt="검색"
            onClick={handleSearch}
            className="ml-2 h-5 w-5 cursor-pointer"
          />
        </div>
      </div>

      {/* 검색창 - PC */}
      <section className="mb-6 hidden justify-center md:flex">
        <div className="flex w-full max-w-3xl items-center rounded-full border border-gray-300 bg-white px-6 py-4 shadow-sm">
          <input
            type="text"
            placeholder="제품을 입력해주세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-full text-base text-gray-800 placeholder-gray-400 outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="ml-2 cursor-pointer">
              <img src="/images/성분 검색결과/x.png" alt="지우기" className="h-6 w-6" />
            </button>
          )}
          <img
            src="/images/search.png"
            alt="검색"
            onClick={handleSearch}
            className="ml-2 h-6 w-6"
          />
        </div>
      </section>

      {/* 검색 기록 - 모바일 */}
      {searchHistory.length > 0 && (
        <div className="block flex justify-center md:hidden">
          <div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px]"
            style={{ width: '300px', height: 'auto', opacity: 1 }}
          >
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
                <button
                  onClick={() => handleDelete(item)}
                  className="text-[16px] text-[#8A8A8A]"
                  title="삭제"
                >
                  <img
                    src="/images/PNG/조합 2-1/delete.png"
                    alt="삭제 아이콘"
                    className="mt-[2px] h-[16px] w-[16px]"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 기록 - PC */}
      {searchHistory.length > 0 && (
        <div className="mb-5 hidden flex-wrap justify-center gap-[24px] px-[35.64px] md:flex">
          {searchHistory.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-[8px] rounded-[6px] px-[12px] py-[4px] transition hover:bg-gray-100"
            >
              <button
                onClick={() => {
                  setSearchTerm(item);
                  navigate(`/add-combination?query=${encodeURIComponent(item)}`);
                }}
                className="font-Pretendard text-[18px] leading-[120%] font-medium tracking-[-0.02em] text-[#6B6B6B] hover:text-black"
              >
                {item}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="flex h-[20px] w-[20px] items-center justify-center"
                title="삭제"
              >
                <img
                  src="/images/PNG/조합 2-1/delete.png"
                  alt="삭제"
                  className="h-[16px] w-[16px]"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 고양이 일러스트 + 설명 - 모바일 */}
      <div className="relative my-20 flex justify-center md:hidden">
        <div className="relative w-[200px]">
          <p className="font-Pretendard absolute top-[-30px] left-[-80px] w-[200px] text-start text-[18px] leading-[120%] font-medium tracking-[-0.02em] text-black">
            성분 과잉 섭취 <br />
            걱정 마세요!
          </p>
          <img src={Cat} alt="고양이" className="w-full" />
          <img src={Chick} alt="병아리" className="absolute bottom-[18px] left-[22px] w-[45px]" />
          <p className="font-Pretendard absolute right-[-90px] bottom-[-30px] w-[200px] text-right text-[18px] leading-[90%] font-medium tracking-[-0.02em] text-black">
            성분별 총량을 한눈에!
          </p>
        </div>
      </div>

      {/* 고양이 일러스트 + 설명 - PC */}
      <div className="relative my-10 flex hidden w-full justify-center md:flex">
        <div className="relative flex w-full max-w-screen-xl items-center justify-center gap-[40px]">
          {/* 왼쪽 제목 (위쪽 정렬) */}
          <div className="flex h-full flex-col justify-start">
            <p className="font-Pretendard text-center text-[25px] leading-[120%] font-medium tracking-[-0.02em]">
              성분 과잉 섭취 걱정 마세요!
            </p>
          </div>

          {/* 가운데 이미지 */}
          <div className="relative w-[200px] shrink-0">
            <img src={Cat} alt="고양이" className="w-full" />
            <img src={Chick} alt="병아리" className="absolute bottom-[18px] left-[22px] w-[45px]" />
          </div>

          {/* 오른쪽 제목 (아래쪽 정렬) */}
          <div className="flex h-full flex-col justify-end">
            <p className="font-Pretendard text-center text-[25px] leading-[120%] font-medium tracking-[-0.02em]">
              성분별 총량을 한눈에!
            </p>
          </div>
        </div>
      </div>

      {/* 구분선 (모바일) */}
      <div>
        <div className="mx-auto block h-[0.5px] w-[390px] bg-[#B2B2B2] md:hidden" />
      </div>

      {/* 주의가 필요한 조합 - 모바일 */}
      <div className="mt-8 px-7 md:hidden">
        <h2
          style={{
            width: '390px',
            height: '26px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '22px',
            lineHeight: '120%',
            letterSpacing: '-0.02em',
            color: '#000000',
          }}
        >
          주의가 필요한 조합 TOP 5
        </h2>
        <p
          style={{
            width: '200px',
            height: '17px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '120%',
            letterSpacing: '-0.02em',
            color: '#6B6B6B',
            marginTop: '6px',
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>

      {/* 조합 카드들 - 모바일 (주의) */}
      <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
        <div className="mt-5 mr-4 mb-5 ml-4 flex w-max gap-[16px]">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <LoadingSkeletonCard key={i} isMobile />)
            : riskyCombinations.map((combo) => (
                <FlipCard key={combo.id} name={combo.name} description={combo.description} />
              ))}
        </div>
      </div>

      {/* 주의가 필요한 조합 - PC (풀블리드 배경) */}
      <div className="hidden md:block">
        {/* 배경을 좌우 패딩까지 확장 */}
        <div className="-mx-4 lg:-mx-[80px] xl:-mx-[120px] 2xl:-mx-[250px]">
          {/* 안쪽은 다시 동일한 패딩으로 정렬 복구 */}
          <div className="mx-auto max-w-screen-xl px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px]">
            <h2 className="text-lg font-semibold whitespace-nowrap md:text-2xl">
              주의가 필요한 조합 TOP 5
            </h2>
            <span className="font-Pretendard text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[16px] xl:text-[18px]">
              카드를 눌러서 확인해 보세요 !
            </span>

            <div className="mt-8 mb-15 flex justify-center">
              <div className="flex w-full gap-[15px] lg:gap-[25px] xl:gap-[25px]">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <LoadingSkeletonCard key={i} isMobile={false} />
                    ))
                  : riskyCombinations.map((combo) => (
                      <FlipCard key={combo.id} name={combo.name} description={combo.description} />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 궁합이 좋은 조합 - 모바일 */}
      <div className="mt-10 px-7 md:hidden">
        <h2
          style={{
            width: '390px',
            height: '26px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '22px',
            lineHeight: '120%',
            letterSpacing: '-0.02em',
            color: '#000000',
          }}
        >
          궁합이 좋은 조합 TOP 5
        </h2>
        <p
          style={{
            width: '300px',
            height: '17px',
            fontFamily: 'Pretendard',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '120%',
            letterSpacing: '-0.02em',
            color: '#6B6B6B',
            marginTop: '6px',
          }}
        >
          카드를 눌러서 확인해 보세요 !
        </p>
      </div>

      {/* 조합 카드들 - 모바일 (좋음) */}
      <div className="hide-scrollbar overflow-x-auto px-3 md:hidden">
        <div className="mt-5 mr-4 mb-15 ml-4 flex w-max gap-[16px]">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <LoadingSkeletonCard key={i} isMobile />)
            : goodCombinations.map((combo) => (
                <FlipCard key={combo.id} name={combo.name} description={combo.description} />
              ))}
        </div>
      </div>

      {/* 궁합이 좋은 조합 - PC (풀블리드 배경) */}
      <div className="hidden md:block">
        {/* 배경을 좌우 패딩까지 확장 */}
        <div className="-mx-4 lg:-mx-[80px] xl:-mx-[120px] 2xl:-mx-[250px]">
          {/* 안쪽은 다시 동일한 패딩으로 정렬 복구 */}
          <div className="mx-auto max-w-screen-xl px-4 lg:px-[80px] xl:px-[120px] 2xl:px-[250px]">
            <h2 className="text-lg font-semibold whitespace-nowrap md:text-2xl">
              궁합이 좋은 조합 TOP 5
            </h2>
            <span className="font-Pretendard text-[16px] leading-[120%] font-semibold tracking-[-0.02em] text-[#6B6B6B] lg:text-[16px] xl:text-[18px]">
              카드를 눌러서 확인해 보세요 !
            </span>

            <div className="mt-8 mb-20 flex justify-center">
              <div className="flex w-full gap-[15px] lg:gap-[25px] xl:gap-[25px]">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <LoadingSkeletonCard key={i} isMobile={false} />
                    ))
                  : goodCombinations.map((combo) => (
                      <FlipCard key={combo.id} name={combo.name} description={combo.description} />
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
