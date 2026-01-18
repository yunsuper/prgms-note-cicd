terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}

# 변수 선언만 하고 기본값은 비워둡니다.
variable "kubernetes_config_path" {
  type    = string
  default = "" 
}

provider "kubernetes" {
  # config_path가 빈 문자열이면 테라폼은 자동으로 'In-Cluster' 인증(ServiceAccount)을 사용합니다.
  config_path = var.kubernetes_config_path != "" ? var.kubernetes_config_path : null
}

# 네임스페이스 정의
resource "kubernetes_namespace" "ns" {
  metadata {
    name = "prgms-notes"
  }
}