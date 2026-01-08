# 1. 베이스 이미지 지정 - node:18
FROM node:18

# 2. 컨테이너 내 작업 디렉토리 설정 - /var/app
WORKDIR /var/app

# 3. 의존성 설치를 위한 파일 복사
# package.json과 lock 파일을 먼저 복사하여 캐시 효율을 높입니다.
COPY package.json package-lock.json ./

# 4. 프로덕션 의존성만 설치 (개발용 라이브러리 제외)
RUN npm ci --omit=dev

# 5. Typescript 소스 빌드 결과물(dist 또는 build) 복사
# 주의: 로컬에서 'npm run build'를 먼저 실행하여 build 폴더가 있어야 합니다.
COPY ./build/ ./build/

# 6. 기본 환경변수 설정
ENV PORT=3031 \
    NODE_ENV=production

# 7. 백엔드가 요청을 수신할 포트 노출
EXPOSE 3031

# 8. 컨테이너 헬스체크 설정
# 3031 포트의 /healthcheck 경로로 생존 신호를 확인합니다.
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl --fail http://localhost:3031/healthcheck || exit 1

# 9. 응용 프로그램 실행
# 빌드된 결과물의 진입점(index.js)을 실행합니다.
ENTRYPOINT ["node", "build/index.js"]