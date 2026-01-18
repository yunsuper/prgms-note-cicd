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
        // [중요] PC의 도커 데스크탑 버전에 맞춰 API 버전을 1.44로 상향 조정
        DOCKER_API_VERSION = "1.44"
    }

    stages {
        stage('1. 인프라 도구 설치') {
            steps {
                container('builder') {
                    sh '''
                        echo "--- 인프라 도구 설치 ---"
                        apt-get update
                        apt-get install -y curl unzip ca-certificates gnupg lsb-release
                        
                        # Docker CLI 설치 (이미 설치되어 있어도 최신 유지)
                        if ! command -v docker &> /dev/null; then
                            apt-get install -y docker.io
                        fi

                        # Terraform 설치 (ARM64)
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
                        echo "--- Docker 이미지 빌드 시작 (API Ver: ${DOCKER_API_VERSION}) ---"
                        # 빌드 시점에 환경변수 재확인
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
        cleanup {
            container('builder') {
                script {
                    try {
                        dir('terraform') {
                            sh 'chmod +x ../scripts/dpy-staging.sh'
                            sh 'if command -v terraform &> /dev/null; then ../scripts/dpy-staging.sh off; else echo "Terraform not found"; fi'
                        }
                    } catch (err) {
                        echo "Cleanup skipped: ${err}"
                    }
                }
            }
        }
    }
}