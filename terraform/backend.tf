# --- Variables ---
variable "db_host" {
  type = string
}

variable "db_port" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_passwd" {
  type = string
}

variable "db_name" {
  type = string
}

variable "frontend_url" {
  type = string
}

variable "container_image_be" {
  type    = string
  default = "yunsuper/notes-be:latest" # 로컬 이미지 이름으로 기본값 설정
}

# --- Resources ---

# 1. 백엔드 설정값 (ConfigMap) - 중복 제거됨
resource "kubernetes_config_map" "backend-config" {
  metadata {
    name      = "notes-be-config"
    namespace = "prgms-notes"
  }
  data = {
    DB_HOST             = var.db_host
    DB_PORT             = var.db_port
    DB_USER             = var.db_user
    DB_PASSWD           = var.db_passwd
    DB_NAME             = var.db_name
    CORS_ALLOWED_ORIGIN = var.frontend_url
  }
}

# 2. 백엔드 배포 (Deployment)
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "notes-be"
    namespace = "prgms-notes"
    labels = {
      App = "notes-backend"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "notes-backend"
      }
    }
    template {
      metadata {
        labels = {
          App = "notes-backend"
        }
      }
      spec {
        container {
          name              = "notes-be"
          image             = var.container_image_be
          image_pull_policy = "IfNotPresent" # 젠킨스가 빌드한 로컬 이미지를 사용
          
          env_from {
            config_map_ref {
              name = kubernetes_config_map.backend-config.metadata[0].name
            }
          }
        }
      }
    }
  }
}

# 3. 백엔드 서비스 (Service)
resource "kubernetes_service" "backend" {
  metadata {
    name      = "notes-be"
    namespace = "prgms-notes"
  }
  spec {
    selector = {
      App = "notes-backend"
    }
    port {
      node_port   = 30031
      port        = 3031
      target_port = 3031
    }
    type = "NodePort"
  }
}