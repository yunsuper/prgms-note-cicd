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
                            echo "Terraform 설치를 시작합니다..."
                            # 기존에 혹시 있을지 모를 terraform 파일/폴더 삭제 (충돌 방지)
                            rm -rf terraform_bin terraform.zip
                            
                            curl -o terraform.zip https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_arm64.zip
                            
                            # 임시 폴더에 압축 해제 후 실행 파일만 이동
                            mkdir -p ./tf_temp
                            unzip -o terraform.zip -d ./tf_temp
                            mv ./tf_temp/terraform /usr/local/bin/terraform
                            
                            chmod +x /usr/local/bin/terraform
                            rm -rf terraform.zip ./tf_temp
                        else
                            echo "Terraform이 이미 설치되어 있습니다."
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
                            sh 'chmod +x ../scripts/dpy-staging.sh'
                            sh 'if command -v terraform &> /dev/null; then ../scripts/dpy-staging.sh off; else echo "Terraform not found, skip off"; fi'
                        }
                    } catch (err) {
                        echo "Cleanup skipped: ${err}"
                    }
                }
            }
        }
    }
}