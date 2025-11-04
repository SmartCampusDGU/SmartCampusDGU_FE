import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // 언어 자동 감지
import Backend from 'i18next-http-backend'; // 번역 파일을 HTTP로 불러오기 위한 백엔드

i18n
  // HTTP 백엔드 로드 (번역 파일을 비동기적으로 가져옴)
  .use(Backend) 
  // 사용자의 브라우저 언어 감지
  .use(LanguageDetector) 
  // react-i18next를 i18next 인스턴스에 연결
  .use(initReactI18next) 
  // i18next를 초기화
  .init({
    // 기본 언어 설정
    fallbackLng: 'en',
    // 사용할 언어 목록
    supportedLngs: ['en', 'ko'],
    // 번역 파일을 찾을 경로 설정
    backend: {
      loadPath: '/locales/{{lng}}/sensorDataTypes.json',
    },
    // i18n을 사용할 때 name을 번역 키로 사용하도록 설정
    keySeparator: false, 
    interpolation: {
      escapeValue: false,
    },
    
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;