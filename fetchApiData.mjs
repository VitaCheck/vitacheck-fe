import axios from 'axios';

// API 설정
const API_BASE_URL = "http://3.35.50.61:8080";
const API_ENDPOINT = '/api/v1/supplements/by-purposes';

// ⚠️ 여기에 유효한 인증 토큰을 넣으세요
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVzZXJAdml0YWNoZWNrLmNvbSIsImlhdCI6MTc1NDMwODE1MiwiZXhwIjoxNzU0MzA5OTUyfQ.s1NxdmlkmDEjLaTtyE00BTC89PyQbf0SgdCkTE-Se2Y"; 

// 요청 본문 데이터
const requestBody = {
  "purposeNames": [
    "EYE"
  ]
};

// API 호출 함수
const fetchApiData = async () => {
  console.log(`API URL: ${API_BASE_URL}${API_ENDPOINT}`);
  console.log('요청 본문:', requestBody);

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINT}`,
      requestBody,
      {
        // ⭐️ 이 부분이 추가되어야 합니다.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`, // Bearer 토큰 형식
        },
      }
    );

    if (response.data.isSuccess) {
      console.log('✅ API 요청 성공!');
      console.log('--- 반환된 데이터 ---');
      console.log(response.data.result);
      console.log('--------------------');
    } else {
      console.error('⚠️ API 요청 실패:', response.data.message);
    }
  } catch (error) {
    console.error('❌ API 호출 중 오류가 발생했습니다:', error.response?.status, error.response?.data);
  }
};

// 함수 실행
fetchApiData();