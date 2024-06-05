variable "cipassword"{
  type = string
  default = "micalucho"
}

resource "proxmox_vm_qemu" "nodo-profe" {
    count = 3
    name = "nodo-mica-lucho-${count.index + 1}"
    desc = "Nodo para probar para el TP Integrador."

    # Node name has to be the same name as within the cluster
    # this might not include the FQDN
    target_node = "pve"

    # The destination resource pool for the new VM
    # pool = "pool0"

    # The template name to clone this vm from
    clone = "Debian11-generic"
    full_clone = false

    os_type = "cloud-init"
    cores = 2
    sockets = 1
    vcpus = 0
    cpu = "host"
    memory = 2048
    scsihw = "virtio-scsi-pci"
    agent = 0

    # Setup the disk
    disk {
        size = "20G"
        type = "scsi"
        storage = "ceph"
        iothread = 0
        ssd = 0
       discard = "on"
    }

    network {
        model = "virtio"
        bridge = "vmbr1"
    }

    # Setup the ip address using cloud-init.
    # Keep in mind to use the CIDR notation for the ip.
    ipconfig0 = "ip=10.230.50.10${count.index + 1}/16,gw=10.230.0.1"
    cipassword = var.cipassword
    sshkeys = <<EOF
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKt91pu7zfLvm6MrIuJwVNY2CKARFC+pwql8ufj9jZH6 micaeladellongo@gmail.com
    EOF
}
