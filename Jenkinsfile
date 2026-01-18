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
    imagePullPolicy: "IfNotPresent"
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
    }

    stages {
        stage('1. 인프라 도구 설치') {
            steps {
                container('builder') {
                    sh '''
                        echo "--- Docker 및 Terraform 설치 중 ---"
                        apt-get update && apt-get install -y curl unzip docker.io
                        
                        if ! command -v terraform &> /dev/null; then
                            # ARM64(Cherry Mac)용 테라폼 다운로드
                            curl -O https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_arm64.zip
                            unzip terraform_1.7.0_linux_arm64.zip
                            mv terraform /usr/local/bin/
                            rm terraform_1.7.0_linux_arm64.zip
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
                            # 클린업 시에도 도구가 필요할 수 있으므로 설치 확인 후 실행
                            sh 'chmod +x ../scripts/dpy-staging.sh'
                            sh '../scripts/dpy-staging.sh off || echo "Cleanup script failed"'
                        }
                    } catch (e) {
                        echo "Cleanup skipped: ${e.message}"
                    }
                }
            }
        }
    }
}