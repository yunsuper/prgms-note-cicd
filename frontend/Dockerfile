FROM node:20-alpine
WORKDIR /var/app

# 정적 서버 설치
RUN npm install -g serve

# 의존성 설치 및 빌드 (로컬에서 build 후 복사하거나 여기서 빌드)
# 여기서는 컨테이너 빌드 시점에 빌드하는 방식을 추천합니다.
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Entrypoint 설정
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker-entrypoint.sh"]