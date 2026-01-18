# 데이터베이스 접속 정보 (로컬 쿠버네티스 내부용)
db_host      = "notes-db-service" # 실제 DB 서비스 이름에 맞게 수정 필요
db_port      = "5432"
db_user      = "postgres"
db_passwd    = "1585"             # 아까 알려주신 비밀번호
db_name      = "notes_db"

# 앱 서비스 주소 (CORS 및 API 호출용)
frontend_url = "http://localhost:30030"
backend_url  = "http://localhost:30031"

# 이미지 주소 (기본값으로 설정하지만 스크립트에서 덮어쓰게 됨)
container_image_be = "yunsuper/notes-be:latest"
container_image_fe = "yunsuper/notes-fe:latest"