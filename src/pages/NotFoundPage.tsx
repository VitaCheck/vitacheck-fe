const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#313131] font-[Pretendard]">
      <div className="w-full max-w-[400px] flex flex-col min-h-screen relative">
        <main className="flex-grow bg-[#f5f5f5] p-4">
          <h1 className="text-2xl mb-4">❌페이지를 찾을 수 없습니다❌</h1>
          <p className="mb-4 text-sm text-gray-600">
            현재 경로: <code>{window.location.pathname}</code>
          </p>
          <a href="/" className="text-blue-400 hover:text-blue-700">
            홈으로 돌아가기
          </a>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;
