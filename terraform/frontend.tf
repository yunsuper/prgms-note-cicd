# --- Variables ---
variable "backend_url" {
  type = string
}

variable "container_image_fe" {
  type    = string
  default = "yunsuper/notes-fe:latest" # 로컬 이미지 이름으로 기본값 설정
}

# --- Resources ---

# 1. 프론트엔드 배포 (Deployment)
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "notes-fe"
    namespace = "prgms-notes"
    labels = {
      App = "notes-frontend"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "notes-frontend"
      }
    }
    template {
      metadata {
        labels = {
          App = "notes-frontend"
        }
      }
      spec {
        container {
          name              = "notes-fe"
          image             = var.container_image_fe
          image_pull_policy = "IfNotPresent" # 젠킨스 빌드 이미지를 로컬에서 즉시 사용
          
          port {
            container_port = 3000
          }

          env {
            name  = "REACT_APP_API_BASE_URL"
            value = var.backend_url
          }
        }
      }
    }
  }
}

# 2. 프론트엔드 서비스 (Service)
resource "kubernetes_service" "frontend" {
  metadata {
    name      = "notes-fe"
    namespace = "prgms-notes"
  }
  spec {
    selector = {
      App = "notes-frontend"
    }
    port {
      node_port   = 30030
      port        = 3000
      target_port = 3000
    }
    type = "NodePort"
  }
}