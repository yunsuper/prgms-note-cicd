terraform {
  required_providers {
    kubernetes = { source = "hashicorp/kubernetes" }
  }
}
variable "kubernetes_config_path" { default = "~/.kube/config" }
provider "kubernetes" { config_path = var.kubernetes_config_path }
resource "kubernetes_namespace" "ns" {
  metadata { name = "prgms-notes" }
}