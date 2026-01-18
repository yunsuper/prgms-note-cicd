#!/bin/sh

# [로컬 최적화] 변수 파일 이름 정의
VAR_FILE="staging.tfvars"

# 환경 변수가 없을 경우 사용할 기본값 설정
: ${KUBECONFIG_PATH:="~/.kube/config"}
# [중요] <Your image URI here> 대신 로컬 빌드 이미지명을 기본값으로 넣거나 
# 젠킨스 파이프라인에서 환경변수로 주입받습니다.
: ${IMG_BE:="yunsuper/notes-be:latest"}
: ${IMG_FE:="yunsuper/notes-fe:latest"}

if [ "$1" = "on" ] ; then
    echo "--- 스테이징 환경 배포 시작 ---"
    
    # 1. 설정 파일 병합 (S3 backend가 제거된 staging.conf와 setup.conf를 합침)
    cat staging.conf setup.conf > notes.tf
    
    # 2. Terraform 초기화 (로컬 백엔드 모드)
    terraform init -reconfigure -no-color
    
    # 3. Terraform 실행 (이미지 주소 및 변수 파일 주입)
    terraform apply --auto-approve -no-color \
        -var-file="${VAR_FILE}" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}" \
        -var "container_image_be=${IMG_BE}" \
        -var "container_image_fe=${IMG_FE}"

elif [ "$1" = "off" ] ; then
    echo "--- 스테이징 자원 회수 (Cleanup) 시작 ---"
    
    # 제거 시에도 설정 파일 구조가 동일해야 함
    cat staging.conf setup.conf > notes.tf
    
    terraform init -reconfigure -no-color
    terraform destroy --auto-approve -no-color \
        -var-file="${VAR_FILE}" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}"
else
    echo "Usage: $0 <on/off>"
fi