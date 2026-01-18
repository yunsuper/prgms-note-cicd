terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}

variable "kubernetes_config_path" {
  type    = string
  default = null # 경로가 없으면 내부 권한을 사용하도록 허용
}

provider "kubernetes" {
  # config_path가 있으면 사용하고, 없으면(null) 자동으로 내부 토큰을 찾습니다.
  config_path = var.kubernetes_config_path
}

# (기존 네임스페이스 선언은 그대로 두세요)
resource "kubernetes_namespace" "ns" {
  metadata {
    name = "prgms-notes"
  }
}