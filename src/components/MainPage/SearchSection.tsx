const SearchSection = () => {
  return (
    <div className="flex justify-around mt-4">
      <button className="p-4 bg-blue-200 rounded-md">목적별 검색</button>
      <button className="p-4 bg-green-200 rounded-md">성분별 검색</button>
      <button className="p-4 bg-red-200 rounded-md">조른 분석</button>
      <button className="p-4 bg-yellow-200 rounded-md">알림</button>
    </div>
  );
};

export default SearchSection;
