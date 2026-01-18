#!/bin/sh

# 변수 파일 이름 정의
VAR_FILE="staging.tfvars"

# 환경 변수 기본값 설정
# [수정] KUBECONFIG_PATH를 빈 값으로 설정하여 테라폼이 파일을 찾지 않게 유도합니다.
: ${KUBECONFIG_PATH:=""}
: ${IMG_BE:="yunsuper/notes-be:latest"}
: ${IMG_FE:="yunsuper/notes-fe:latest"}

if [ "$1" = "on" ] ; then
    echo "--- 스테이징 환경 배포 시작 ---"
    
    # 1. Terraform 초기화
    terraform init -reconfigure -no-color
    
    # 2. Terraform 실행
    # [중요] kubernetes_config_path를 빈 문자열로 넘기면 테라폼은 자동으로 내부 ServiceAccount 토큰을 사용합니다.
    terraform apply --auto-approve -no-color \
        -var-file="${VAR_FILE}" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}" \
        -var "container_image_be=${IMG_BE}" \
        -var "container_image_fe=${IMG_FE}"

elif [ "$1" = "off" ] ; then
    echo "--- 스테이징 자원 회수 (Cleanup) 시작 ---"
    
    terraform init -reconfigure -no-color
    terraform destroy --auto-approve -no-color \
        -var-file="${VAR_FILE}" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}"
else
    echo "Usage: $0 <on/off>"
fi