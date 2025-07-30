# 💊 VitaCheck

---

## ⚙️ 기술 스택

### Frontend

- React 19 (with Vite)
- TypeScript
- TailwindCSS
- React Query
- React Router

---

## 🧩 주요 기능

- 🔔 영양제 섭취 알림 생성 및 관리
- 📆 날짜별 알림 루틴 보기 (모바일 캘린더 UI)
- 📦 제품 키워드 검색 + 성분 조합 분석
- 👤 회원가입 / 로그인 (JWT 인증)
- 🖼️ 마이페이지 프로필 이미지 수정 기능

---

## 📁 프로젝트 구조 (Frontend 기준)

```bash
📦src
 ┣ 📂components       # 공통 UI 컴포넌트
 ┣ 📂pages            # 라우트 단위 페이지
 ┣ 📂hooks            # 커스텀 훅
 ┣ 📂lib              # axios 인스턴스 등 유틸
 ┣ 📂routes           # react-router 설정
 ┣ 📂assets           # 이미지, 아이콘 등 정적 파일
 ┗ App.tsx
```

---


## 📮 API 연동 방식

- `@/lib/axios.ts`에 Axios 인스턴스 구성
- JWT 토큰을 `localStorage`에 저장하고 요청 시 자동 헤더 주입
- 401, 403 등 에러 핸들링 처리 포함

---

## 🧑‍💻 팀원 소개

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/hyunseo-han">
        <img src="https://github.com/hyunseo-han.png" width="100px;" alt="hyunseo-han"/>
        <br /><sub><b>@hhyunseo-han</b></sub>
      </a>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/heeone1">
        <img src="https://github.com/heeone1.png" width="100px;" alt="heeone1"/>
        <br /><sub><b>@heeone1</b></sub>
      </a>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/lucy7noh">
        <img src="https://github.com/lucy7noh.png" width="100px;" alt="lucy7noh"/>
        <br /><sub><b>@lucy7noh</b></sub>
      </a>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/sarahlee-59">
        <img src="https://github.com/sarahlee-59.png" width="100px;" alt="sarahlee-59"/>
        <br /><sub><b>@sarahlee-59</b></sub>
      </a>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/behindacat">
        <img src="https://github.com/behindacat.png" width="100px;" alt="behindacat"/>
        <br /><sub><b>@behindacat</b></sub>
      </a>
      <br />
    </td>
  </tr>
</table>


---

## 🌱 기여 방법

```bash
# 브랜치 전략
- main: 배포용
- dev: 통합 개발 브랜치
- feat/*: 기능 단위 브랜치

# 커밋 메시지 컨벤션
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
```

---

## 📄 라이선스

MIT License
