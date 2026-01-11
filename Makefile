# prj/Makefile

# 💡 변수 설정 (본인의 환경에 맞게 수정)
BE_IMG = yunsuper/notes-be:latest
FE_IMG = yunsuper/notes-fe:latest
NAMESPACE = prgms-notes

# --- 기존 로컬 개발용 (Docker Compose) ---
up:
	cd backend && npm run build
	docker-compose up --build -d

re:
	docker-compose down -v
	cd backend && npm run build
	docker-compose up --build -d
	@echo "10초 대기 중..."
	@sleep 10
	docker exec -i notes-db mariadb -u prgms -pprgms prgms_notes < init-test-db.sql
	@echo "데이터 주입 완료!"

down:
	docker-compose down

# --- 신규: 로컬 클러스터(k8s) 배포용 ---

# 1. 이미지 빌드 및 푸시 (한 번에 실행)
# 사용법: make cluster-push
cluster-push:
	@echo "백엔드 이미지 빌드 및 푸시 중..."
	cd backend && docker build -t $(BE_IMG) .
	docker push $(BE_IMG)
	@echo "프론트엔드 이미지 빌드 및 푸시 중..."
	cd frontend && docker build -t $(FE_IMG) .
	docker push $(FE_IMG)

# 2. 클러스터 배포
# 사용법: make cluster-deploy
cluster-deploy:
	@echo "Kubernetes 리소스 배포 중..."
	kubectl apply -f db/notes-db.yaml
	@echo "DB 서버 안정화를 위해 10초 대기..."
	@sleep 10
	kubectl apply -f backend/notes-be.yaml
	kubectl apply -f frontend/notes-fe.yaml

# 3. 클러스터 배포 제거
# 사용법: make cluster-undeploy
cluster-undeploy:
	kubectl delete -f backend/notes-be.yaml
	kubectl delete -f frontend/notes-fe.yaml
	kubectl delete -f db/notes-db.yaml

# 4. 상태 확인
# 사용법: make cluster-status
cluster-status:
	kubectl -n $(NAMESPACE) get all