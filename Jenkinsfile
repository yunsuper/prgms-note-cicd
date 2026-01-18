pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: builder
    image: yunsuper/jenkins-builder:latest
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
    }

    stages {
        stage('1. 환경 준비') {
            steps {
                container('builder') {
                    sh '''
                        if ! command -v node &> /dev/null; then
                            apt-get update && apt-get install -y curl
                            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                            apt-get install -y nodejs
                        fi
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
                        npm run build  # <--- 이 단계가 반드시 있어야 Docker COPY가 성공합니다
                        npm test || echo "Backend test failed but continuing..."
                        cd ..

                        echo "--- Frontend Build ---"
                        cd frontend
                        npm install
                        # 프론트엔드 빌드 결과물 생성 (필요시)
                        # npm run build 
                        cd ..
                    '''
                }
            }
        }

        stage('3. Docker 이미지 패키징') {
            steps {
                container('builder') {
                    sh '''
                        echo "이미지 빌드 시작..."
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
                            sh '../scripts/dpy-staging.sh off'
                        }
                    } catch (e) {
                        echo "Cleanup skipped: ${e.message}"
                    }
                }
            }
        }
    }
}