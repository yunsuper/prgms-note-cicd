# [수정] terraform, variable, provider 블록을 모두 제거했습니다. (provider.tf와 중복 방지)

# 1. 셀레니움 전용 네임스페이스 생성
# [참고] 만약 prgms-notes 네임스페이스와 통합하고 싶다면 이 블록을 삭제하고
# 아래 namespace 항목들을 "prgms-notes"로 통일해도 됩니다.
resource "kubernetes_namespace" "selenium_ns" {
  metadata {
    name = "selenium"
  }
}

# 2. Selenium Standalone Chrome 배포
resource "kubernetes_deployment" "selenium" {
  metadata {
    name      = "selenium"
    namespace = kubernetes_namespace.selenium_ns.metadata[0].name
    labels = {
      App = "selenium-chrome"
    }
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
          # ARM64(M1/M2 Mac) 및 일반 환경 모두 호환되는 이미지
          image = "seleniarm/standalone-chromium:latest"
          name  = "selenium-grid"
          
          port {
            container_port = 4444
          }

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
    namespace = kubernetes_namespace.selenium_ns.metadata[0].name
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