terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
  # [2단계] AWS S3 백엔드 설정을 삭제했습니다. 
  # 이제 실행 경로에 .tfstate 파일이 생성되어 로컬에서 관리됩니다.
}

variable "kubernetes_config_path" {
    # 젠킨스 에이전트 내부에서 실행될 때를 고려하여 경로를 유연하게 설정할 수 있습니다.
    default = "~/.kube/config"
}

provider "kubernetes" {
  config_path = var.kubernetes_config_path
}

# 1. 셀레니움 전용 네임스페이스 생성
resource "kubernetes_namespace" "ns" {
  metadata {
    name = "selenium"
  }
}

# 2. Selenium Standalone Chrome 배포
resource "kubernetes_deployment" "selenium" {
  metadata {
    name = "selenium"
    labels = {
      App = "selenium-chrome"
    }
    namespace = kubernetes_namespace.ns.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "selenium-chrome"
      }
    }
    template {
      metadata {
        labels = {
          App = "selenium-chrome"
        }
      }
      spec {
        container {
          # ARM64 환경(M1/M2/M3 Mac 등)에서 구동 가능한 셀레니움 이미지를 사용합니다.
          # 일반 이미지는 ARM에서 작동하지 않을 수 있으므로 seleniarm을 권장합니다.
          image = "seleniarm/standalone-chromium:latest"
          name  = "selenium-grid"
          
          port {
            container_port = 4444
          }

          # 리소스 제한 (로컬 환경 최적화)
          resources {
            limits = {
              cpu    = "500m"
              memory = "1Gi"
            }
            requests = {
              cpu    = "200m"
              memory = "512Mi"
            }
          }
        }
      }
    }
  }
}

# 3. 외부 접속을 위한 서비스 설정 (NodePort 30050)
resource "kubernetes_service" "chrome-selenium" {
  metadata {
    name      = "chrome"
    namespace = kubernetes_namespace.ns.metadata[0].name
  }
  spec {
    selector = {
      App = "selenium-chrome"
    }
    port {
      node_port   = 30050
      port        = 4444
      target_port = 4444
    }
    type = "NodePort"
  }
}