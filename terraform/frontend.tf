variable "backend_url" {
  type = string
}

variable "container_image_fe" {
  type = string
  default = "<Your image URI here>"
}

resource "kubernetes_deployment" "frontend" {
  metadata {
    name = "notes-fe"
    labels = {
      App = "notes-frontend"
    }
    namespace = "prgms-notes"
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
          image = var.container_image_fe
          # [로컬 최적화] 로컬 이미지를 우선 사용하도록 변경
          image_pull_policy = "IfNotPresent"
          name = "notes-fe"
          port {
            container_port = 3000
          }
          env {
            name = "REACT_APP_API_BASE_URL"
            value = var.backend_url
          }
        }
        # [삭제] 로컬 환경에서는 AWS 자격 증명이 필요 없으므로 삭제합니다.
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  metadata {
    name = "notes-fe"
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