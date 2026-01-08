# prj/Makefile

# 1. 평소에 개발할 때 (코드 수정 후 반영)
# 터미널에 'make up' 입력
up:
	cd backend && npm run build
	docker-compose up --build -d

# 2. DB가 꼬였거나 데이터를 새로 넣고 싶을 때 (완전 초기화)
# 터미널에 'make re' 입력
re:
	docker-compose down -v
	cd backend && npm run build
	docker-compose up --build -d
	@echo "10초 대기 중..."
	@sleep 10
	docker exec -i notes-db mariadb -u prgms -pprgms prgms_notes < init-test-db.sql
	@echo "데이터 주입 완료!"

# 3. 서버 끄기
# 터미널에 'make down' 입력
down:
	docker-compose down