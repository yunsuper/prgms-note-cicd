#!/bin/sh

# [로컬 최적화] KUBECONFIG 경로 설정 (환경 변수가 없으면 기본값 사용)
: ${KUBECONFIG_PATH:="~/.kube/config"}

# 실행 위치가 terraform 폴더 외부일 경우를 대비해 경로를 명시적으로 잡거나, 
# 파이프라인에서 cd terraform 후 실행한다고 가정합니다.

if [ "$1" = "on" ] ; then
    # 1. 초기화: staging.conf 파일을 백엔드 설정으로 사용하여 S3 없이 로컬 모드로 동작하게 함
    terraform init -reconfigure -no-color -backend-config="staging.conf"
    
    # 2. 배포: -var-file을 추가하여 staging.conf에 정의된 변수값들을 한꺼번에 적용
    terraform apply --auto-approve -no-color \
        -var-file="staging.conf" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}"

elif [ "$1" = "off" ] ; then
    # 3. 자원 회수: 종료 시에도 동일한 설정을 참조하여 안전하게 삭제
    terraform init -reconfigure -no-color -backend-config="staging.conf"
    terraform destroy --auto-approve -no-color \
        -var-file="staging.conf" \
        -var "kubernetes_config_path=${KUBECONFIG_PATH}"
else
    echo "Usage: $0 <on/off>"
fi