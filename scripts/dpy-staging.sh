#!/bin/sh

# [로컬 최적화] 변수 파일 이름 정의
VAR_FILE="staging.tfvars"

# 환경 변수가 없을 경우 사용할 기본값 설정
: ${KUBECONFIG_PATH:="~/.kube/config"}
: ${IMG_BE:="yunsuper/notes-be:latest"}
: ${IMG_FE:="yunsuper/notes-fe:latest"}

if [ "$1" = "on" ] ; then
    echo "--- 스테이징 환경 배포 시작 ---"
    
    # [수정] cat staging.conf setup.conf > notes.tf 를 삭제했습니다.
    # 이제 폴더 내의 각 .tf 파일(provider, backend, frontend, selenium)을 테라폼이 직접 읽습니다.
    
    # 1. Terraform 초기화 (로컬 백엔드 모드)
    terraform init -reconfigure -no-color
    
    # 2. Terraform 실행 (이미지 주소 및 변수 파일 주입)
    terraform apply --auto-approve -no-color \
        -var-file="${VAR_FILE}" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}" \
        -var "container_image_be=${IMG_BE}" \
        -var "container_image_fe=${IMG_FE}"

elif [ "$1" = "off" ] ; then
    echo "--- 스테이징 자원 회수 (Cleanup) 시작 ---"
    
    # [수정] 제거 시에도 중복 방지를 위해 cat 명령어를 삭제합니다.
    
    terraform init -reconfigure -no-color
    terraform destroy --auto-approve -no-color \
        -var-file="${VAR_FILE}" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}"
else
    echo "Usage: $0 <on/off>"
fi