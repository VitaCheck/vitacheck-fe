import { FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import catImage from '../assets/cat.png';
import searchIcon from '../assets/search.png';
import downIcon from '../assets/arrow_drop_down.png';
import Navbar from '@/components/NavBar';
import NoSearchResult from '@/components/ingredient/NoSearchResult';
import { fetchIngredientSearch, fetchPopularIngredients, recordSearchLog } from '@/apis/ingredient';
import type { IngredientSearchResult, PopularIngredient } from '@/types/ingredient';

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

const IngredientPage = () => {
  const [selected, setSelected] = useState('20대');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [searchResults, setSearchResults] = useState<IngredientSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popularIngredients, setPopularIngredients] = useState<PopularIngredient[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // 로그인 상태 확인 (NavBar와 동일한 방식)
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = Boolean(token);

  // 디버깅을 위한 로그 추가
  console.log('🔥 [DEBUG] localStorage accessToken:', token);
  console.log('🔥 [DEBUG] isLoggedIn:', isLoggedIn);

  // 인기성분 데이터 로드
  const loadPopularIngredients = async (ageGroup: string) => {
    setIsLoadingPopular(true);

    try {
      console.log('🔥 [UI] 인기성분 API 호출 시작:', ageGroup);

      // 연령대별 파라미터 매핑 개선
      let apiAgeGroup: string = ageGroup;

      // API에서 기대하는 형식으로 변환 (백엔드 API 문서 기준)
      if (ageGroup === '10대') apiAgeGroup = '10대';
      else if (ageGroup === '20대') apiAgeGroup = '20대';
      else if (ageGroup === '30대') apiAgeGroup = '30대';
      else if (ageGroup === '40대') apiAgeGroup = '40대';
      else if (ageGroup === '50대') apiAgeGroup = '50대';
      else if (ageGroup === '60대 이상') apiAgeGroup = '60대 이상';
      else if (ageGroup === '전체 연령') {
        apiAgeGroup = '전체';
      }

      // 공백 제거하여 정확한 파라미터 전송
      apiAgeGroup = apiAgeGroup.trim();

      console.log('🔥 [UI] API로 전송할 연령대:', `"${apiAgeGroup}"`);
      console.log('🔥 [UI] API로 전송할 연령대 길이:', apiAgeGroup.length);

      const response = await fetchPopularIngredients(apiAgeGroup);
      console.log('🔥 [UI] loadPopularIngredients 응답:', response);

      if (response && response.result) {
        // 새로운 API 응답 구조 처리: result.content 또는 result 배열
        let ingredientsData = response.result;

        // result.content가 있는 경우 (페이징 응답)
        if (response.result.content && Array.isArray(response.result.content)) {
          ingredientsData = response.result.content;
        }
        // result가 직접 배열인 경우
        else if (Array.isArray(response.result)) {
          ingredientsData = response.result;
        }
        // 둘 다 아닌 경우 빈 배열
        else {
          console.log('🔥 [UI] 응답 구조가 예상과 다름:', response.result);
          ingredientsData = [];
        }

        console.log('🔥 [UI] 인기성분 데이터 설정:', ingredientsData);
        setPopularIngredients(ingredientsData);
      } else {
        console.log('🔥 [UI] 응답에 result가 없음');
        // 기본 성분 리스트 표시
        const defaultIngredients = [
          { id: 1, ingredientName: '비타민C' },
          { id: 2, ingredientName: '오메가3' },
          { id: 3, ingredientName: '프로바이오틱스' },
          { id: 4, ingredientName: '마그네슘' },
          { id: 5, ingredientName: '비타민D' },
        ];
        setPopularIngredients(defaultIngredients);
      }
    } catch (error: any) {
      console.error('🔥 [UI] 인기성분 로드 실패:', error);

      // API 호출 실패 시 기본 성분 리스트 표시
      console.log('🔥 [UI] API 호출 실패 - 기본 성분 리스트 표시');
      const defaultIngredients = [
        { id: 1, ingredientName: '비타민C' },
        { id: 2, ingredientName: '오메가3' },
        { id: 3, ingredientName: '프로바이오틱스' },
        { id: 4, ingredientName: '마그네슘' },
        { id: 5, ingredientName: '비타민D' },
      ];
      setPopularIngredients(defaultIngredients);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('ingredient_search_history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }

    // 초기 인기성분 로드
    loadPopularIngredients(selected);
  }, [isLoggedIn]); // isLoggedIn 의존성 추가

  // popularIngredients 상태 변화 추적
  useEffect(() => {
    console.log('🔥 [UI] popularIngredients 상태 변화:', popularIngredients);
  }, [popularIngredients]);

  // 로그인 상태가 변경될 때마다 인기성분 다시 로드
  useEffect(() => {
    loadPopularIngredients(selected);
  }, [isLoggedIn, selected]);

  const saveSearchHistory = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const newHistory = [trimmed, ...searchHistory.filter((k) => k !== trimmed)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('ingredient_search_history', JSON.stringify(newHistory));
  };

  const deleteHistoryItem = (keyword: string) => {
    const newHistory = searchHistory.filter((k) => k !== keyword);
    setSearchHistory(newHistory);
    localStorage.setItem('ingredient_search_history', JSON.stringify(newHistory));
  };

  const handleHistoryClick = (keyword: string) => {
    setSearchKeyword(keyword);
    saveSearchHistory(keyword);
    navigate(`/ingredient/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleChange = (age: string) => {
    setSelected(age);
    setShowAgeModal(false);
    // 연령대 변경 시 새로운 인기성분 로드
    loadPopularIngredients(age);
  };

  const toggleAgeModal = () => {
    setShowAgeModal(!showAgeModal);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const submitSearch = async () => {
    const trimmed = searchKeyword.trim();
    if (trimmed.length === 0) return;

    setHasSearched(true);
    setIsLoading(true);
    saveSearchHistory(trimmed);

    try {
      // 검색 기록 API 호출 (성공/실패와 관계없이 진행)
      await recordSearchLog(trimmed);

      // 실제 API 호출로 성분 검색
      const response = await fetchIngredientSearch({ keyword: trimmed });

      if (response && response.result) {
        setSearchResults(response.result);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error('성분 검색 실패:', error);

      // 404 에러나 다른 에러의 경우에도 빈 결과로 처리하여 "검색 결과 없음" UI 표시
      if (error?.response?.status === 404) {
        // 404 에러는 "검색 결과 없음"으로 처리
        setSearchResults([]);
      } else {
        // 다른 에러의 경우에도 빈 결과로 처리
        setSearchResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const ingredientList = ['유산균', '비타민C', '글루타치온', '밀크씨슬', '오메가3'];
  const filteredList = ingredientList.filter((item) =>
    item.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

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
    <div className="mx-auto max-w-screen-xl px-4 pt-0 sm:px-36 sm:pt-10">
      {/* ✅ 모바일에서만 이 페이지의 Navbar 표시 (PC에서는 전역 Navbar만) */}
      <div className="fixed top-0 right-3 left-3 z-50 bg-white md:hidden">
        {/* Safe Area 지원 및 배포 환경 대응 */}
        <div
          className="w-full"
          style={{
            paddingTop: 'max(env(safe-area-inset-top), 20px)',
          }}
        >
          <Navbar />
        </div>
      </div>
      {/* 모바일에서 상단바 높이만큼 여백 추가 */}
      <div className="md:hidden" style={{ height: 'max(env(safe-area-inset-top), 20px)' }} />
      <div className="h-20 md:hidden" /> {/* Navbar 높이만큼 여백 (20px + Navbar 높이) */}
      <h1 className="mb-6 text-2xl font-semibold sm:mb-8 sm:pt-8 sm:text-4xl">성분별</h1>
      {/* 검색창 */}
      <section className="mb-6 flex justify-center">
        <div
          className={`flex w-full items-center ${
            isMobile
              ? 'max-w-sm rounded-full border border-gray-300 bg-white px-6 py-3'
              : 'max-w-5xl rounded-full border border-gray-300 bg-gray-100 px-6 py-4 shadow-sm'
          }`}
        >
          <input
            type="text"
            placeholder="성분을 입력해주세요."
            value={searchKeyword}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className={`w-full outline-none ${
              isMobile
                ? 'bg-transparent text-lg text-gray-400 placeholder-gray-300'
                : 'text-base text-gray-800 placeholder-gray-400'
            }`}
          />

          {searchKeyword && (
            <button onClick={handleClearSearch} className="ml-2 cursor-pointer">
              <img
                src="/images/성분 검색결과/x.png"
                alt="지우기"
                className={isMobile ? 'h-5 w-5' : 'h-6 w-6'}
              />
            </button>
          )}

          <img
            src={searchIcon}
            alt="검색"
            onClick={submitSearch}
            className={`ml-2 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`}
          />
        </div>
      </section>
      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-500"></div>
        </div>
      )}
      {/* 검색 결과 또는 검색 결과 없음 메시지 */}
      {!isLoading && hasSearched && searchResults.length === 0 ? (
        <NoSearchResult />
      ) : !isLoading && searchResults.length > 0 ? (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">검색 결과</h3>
          <div className="grid grid-cols-1 gap-3">
            {searchResults.map((item) => (
              <Link
                key={item.id}
                to={`/ingredient/${encodeURIComponent(item.name)}`}
                className={`flex items-center justify-between rounded-3xl bg-[#f2f2f2] px-5 py-4 transition hover:bg-gray-300 ${
                  isMobile ? 'mx-auto w-full max-w-sm' : 'w-full'
                }`}
              >
                <span className="text-base font-semibold">{item.name}</span>
                <FiChevronRight size={20} className="text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {/* 검색 기록 */}
      {!hasSearched && searchHistory.length > 0 && (
        <section className="mb-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-gray-700">
          {searchHistory.map((item) => (
            <div
              key={item}
              className="flex items-center rounded-full bg-gray-100 px-3 py-1.5 shadow-sm"
            >
              <button onClick={() => handleHistoryClick(item)} className="mr-2 hover:underline">
                {item}
              </button>
              <button
                onClick={() => deleteHistoryItem(item)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          ))}
        </section>
      )}
      {/* 캐릭터 & 설명 */}
      {!hasSearched && (
        <section
          className={`flex ${
            isMobile ? 'justify-center gap-4' : 'justify-center gap-6'
          } mb-10 items-center`}
        >
          <div className="mb-5 h-[95px] overflow-hidden rounded-full">
            <img
              src={catImage}
              alt="캐릭터"
              className={
                isMobile ? 'h-30 w-30 object-cover object-top' : 'h-30 w-30 object-contain'
              }
            />
          </div>
          <p
            className={`${
              isMobile ? 'text-left text-sm' : 'text-base'
            } leading-relaxed font-medium text-black`}
          >
            효능, 섭취 시기, 권장 섭취량 등
            <br />
            다양한 정보를 알 수 있어요!
          </p>
        </section>
      )}
      {/* TOP 5 성분 */}
      {!hasSearched && (
        <section>
          <div className="mb-5 flex items-center gap-x-3">
            <h2 className="pl-2 text-lg font-semibold whitespace-nowrap md:text-2xl">
              연령대별 자주 찾는 성분 TOP 5
            </h2>
            <div className="relative">
              <button
                onClick={toggleAgeModal}
                className={`flex appearance-none items-center gap-2 rounded-full py-1 pr-6 pl-3 text-sm font-semibold whitespace-nowrap ${
                  isMobile
                    ? 'min-w-[80px] justify-center bg-[#FFEB9D]'
                    : 'border border-gray-200 bg-white shadow-sm'
                }`}
              >
                {selected}
                <img src={downIcon} alt="드롭다운" className="h-5 w-6" />
              </button>

              {/* 나이 선택 모달 */}
              {showAgeModal && (
                <>
                  {/* PC 버전: 드롭다운 형태 */}
                  {!isMobile && (
                    <div className="absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg">
                      <div className="p-3">
                        {['10대', '20대', '30대', '40대', '50대', '60대 이상', '전체 연령'].map(
                          (age) => (
                            <button
                              key={age}
                              onClick={() => handleChange(age)}
                              className={`w-full rounded-lg px-3 py-2 text-left font-medium transition-colors ${
                                selected === age
                                  ? 'bg-[#FFEB9D] text-black'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {age}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 모바일 버전: 하단에서 올라오는 모달 */}
          {showAgeModal && isMobile && (
            <div className="fixed inset-0 z-50">
              {/* 어두운 오버레이 */}
              <button
                aria-label="모달 닫기"
                className="absolute inset-0 bg-black/40"
                onClick={toggleAgeModal}
              />

              {/* 바텀시트 */}
              <div
                className="absolute right-0 bottom-0 left-0 rounded-t-3xl bg-white p-6"
                style={{
                  paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex justify-center">
                  <div className="h-1 w-12 rounded-full bg-gray-300"></div>
                </div>

                <div className="mb-4">
                  <h3 className="mb-2 text-left text-lg font-semibold">연령 선택</h3>
                  <div className="h-px w-full bg-gray-300"></div>
                </div>

                <div className="space-y-3">
                  {/* 위쪽 행: 10대, 20대, 30대, 40대 */}
                  <div className="grid grid-cols-4 gap-3">
                    {['10대', '20대', '30대', '40대'].map((age) => (
                      <button
                        key={age}
                        onClick={() => handleChange(age)}
                        className={`rounded-4xl px-4 py-3 font-medium transition-colors ${
                          selected === age
                            ? 'bg-[#FFEB9D] text-black'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>

                  {/* 아래쪽 행: 50대, 60대 이상, 전체 연령 */}
                  <div className="flex justify-center gap-3">
                    {['50대', '60대 이상', '전체 연령'].map((age) => (
                      <button
                        key={age}
                        onClick={() => handleChange(age)}
                        className={`rounded-4xl px-4 py-3 font-medium transition-colors ${
                          selected === age
                            ? 'bg-[#FFEB9D] text-black'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 성분 리스트 */}
          {isLoadingPopular ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500">인기성분을 불러오는 중...</span>
            </div>
          ) : popularIngredients.length === 0 ? (
            <div className="py-8 text-center">
              <p className="mb-2 text-gray-500">
                {selected === '전체 연령'
                  ? '전체 연령 인기성분을 불러올 수 없습니다.'
                  : `${selected} 인기성분을 불러올 수 없습니다.`}
              </p>
              <p className="mb-4 text-sm text-gray-400">
                {selected === '전체 연령'
                  ? '잠시 후 다시 시도해주세요.'
                  : '다른 연령대를 선택해보세요!'}
              </p>
              {selected === '전체 연령' && (
                <button
                  onClick={() => loadPopularIngredients(selected)}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  다시 시도
                </button>
              )}
            </div>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-3 pb-10">
              {popularIngredients.map((item, index) => (
                <Link
                  key={item.id || `popular-${index}`}
                  to={`/ingredient/${encodeURIComponent(item.ingredientName)}`}
                  className="flex w-full items-center justify-between rounded-3xl bg-[#f2f2f2] px-5 py-4 transition hover:bg-gray-300"
                >
                  <span className="text-base font-semibold">{item.ingredientName}</span>
                  <FiChevronRight size={20} className="text-gray-500" />
                </Link>
              ))}
            </div>
          ) : (
            <div
              className={`grid justify-start gap-4 pt-3 pb-10 ${
                popularIngredients.length === 1
                  ? 'grid-cols-1'
                  : popularIngredients.length === 2
                    ? 'grid-cols-2'
                    : popularIngredients.length === 3
                      ? 'grid-cols-3'
                      : popularIngredients.length === 4
                        ? 'grid-cols-4'
                        : 'grid-cols-5'
              }`}
            >
              {popularIngredients.map((item, index) => (
                <Link
                  key={item.id || `popular-${index}`}
                  to={`/ingredient/${encodeURIComponent(item.ingredientName)}`}
                >
                  <div className="flex h-32 w-full items-center justify-center rounded-xl bg-white px-6 py-10 text-center text-lg font-semibold shadow shadow-md transition hover:shadow-lg">
                    {item.ingredientName}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default IngredientPage;
