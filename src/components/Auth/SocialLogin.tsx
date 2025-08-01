export default function SocialLogin() {
  return (
    <div className="flex flex-col items-center px-6 space-y-4">
      <h2 className="text-center font-semibold text-lg mt-30 mb-20">
        간편하게 로그인하고
        <br />
        비타체크와 영양제 관리해요!
      </h2>

      <button className="w-full bg-yellow-300 py-4 font-semibold rounded-full text-sm font-medium">
        카카오로 시작하기
      </button>
      <button className="w-full bg-green-400 py-4 font-semibold text-white rounded-full text-sm font-medium">
        네이버로 시작하기
      </button>
      <button className="w-full border py-4 font-semibold rounded-full text-sm font-medium">
        Google로 시작하기
      </button>

      <div className="text-sm text-gray-500 mt-4">
        <a href="/login" className="underline">
          이메일로 로그인
        </a>
        <span className="mx-2">|</span>
        <a href="/signup" className="underline">
          이메일로 회원가입
        </a>
      </div>
    </div>
  );
}
