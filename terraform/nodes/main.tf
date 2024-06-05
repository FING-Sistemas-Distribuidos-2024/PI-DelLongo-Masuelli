terraform {
  required_providers {
    proxmox = {
      source = "Telmate/proxmox"
      version = "2.9.14"
    }
  }
}
provider "proxmox" {
     pm_tls_insecure = true
     pm_api_url = "https://172.29.0.1:8006/api2/json"
     # Mejor usar export PM_PASS=password y export PM_USER=usuario@pve
     # pm_password = something
     # pm_user = "user@pve"
     pm_otp = ""
}
