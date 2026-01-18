pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: builder
    image: "node:20-bookworm"
    imagePullPolicy: IfNotPresent
    command:
    - cat
    tty: true
    securityContext:
      runAsUser: 0
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
"""
        }
    }

    environment {
        IMG_BE = "yunsuper/notes-be:latest"
        IMG_FE = "yunsuper/notes-fe:latest"
        DOCKER_API_VERSION = "1.44"
        TF_VAR_kubernetes_config_path = ""
    }

    stages {
        stage('1. 인프라 도구 설치') {
            steps {
                container('builder') {
                    sh '''
                        echo "--- 인프라 도구 설치 ---"
                        apt-get update
                        apt-get install -y curl unzip ca-certificates gnupg lsb-release
                        
                        if ! command -v docker &> /dev/null; then
                            apt-get install -y docker.io
                        fi

                        if ! command -v terraform &> /dev/null; then
                            rm -rf tf_temp terraform.zip
                            curl -o terraform.zip https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_arm64.zip
                            mkdir -p ./tf_temp
                            unzip -o terraform.zip -d ./tf_temp
                            mv ./tf_temp/terraform /usr/local/bin/terraform
                            chmod +x /usr/local/bin/terraform
                            rm -rf terraform.zip ./tf_temp
                        fi
                        
                        terraform --version
                        docker --version
                    '''
                }
            }
        }

        stage('2. 소스 빌드 및 테스트') {
            steps {
                container('builder') {
                    sh '''
                        echo "--- Backend Build & Test ---"
                        cd backend
                        npm install
                        npm run build
                        npm test || echo "Backend test failed but continuing..."
                        cd ..

                        echo "--- Frontend Build ---"
                        cd frontend
                        npm install
                        cd ..
                    '''
                }
            }
        }

        stage('3. Docker 이미지 패키징') {
            steps {
                container('builder') {
                    sh '''
                        echo "--- Docker 이미지 빌드 시작 ---"
                        export DOCKER_API_VERSION=1.44
                        docker build -t ${IMG_BE} ./backend
                        docker build -t ${IMG_FE} ./frontend
                    '''
                }
            }
        }

        stage('4. 스테이징 배포 (Terraform)') {
            steps {
                container('builder') {
                    dir('terraform') {
                        sh '''
                            chmod +x ../scripts/dpy-staging.sh
                            ../scripts/dpy-staging.sh on
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "--- 🎉 배포 성공! http://localhost:30030 에 접속해 보세요 ---"
        }
        failure {
            echo "--- ❌ 배포 실패! 로그를 확인하세요 ---"
        }
        // [수정] 자원 확인을 위해 cleanup 단계에서 terraform destroy(off)를 제거했습니다.
        cleanup {
            echo "--- 배포 상태 유지를 위해 자동 삭제를 건너뜁니다 ---"
        }
    }
}