# PI-DelLongo-Masuelli: Chat en Tiempo Real con WebSockets y Redis

_Estudiantes:_
- Del Longo, Micaela
- Masuelli, Luciano

Este proyecto implementa una aplicación de chat global en tiempo real utilizando WebSockets y Redis como medio de comunicación.

# Descripción de la Aplicación

## Servidor

El servidor fue implementado utilizando `Node.js`, el archivo server.js es el punto de entrada para el servidor de la aplicación de chat. Aquí se inicializan y configuran el cliente Redis y el servidor WebSocket.

**Cliente Redis**: Se crea una conexión con una instancia de Redis, que es una base de datos en memoria. Esta conexión se utiliza para almacenar y recuperar mensajes de chat. Los mensajes se almacenan con una clave única (la marca de tiempo del mensaje) y el valor es el mensaje en sí.

**Servidor WebSocket**: Se crea un servidor WebSocket que escucha en el puerto 8080. Cuando un cliente se conecta, se recuperan los últimos 10 mensajes del historial y se envían al cliente. Además, se manejan los eventos de conexión y desconexión de los clientes.

**Manejo de mensajes**: Cuando un cliente envía un mensaje, este se almacena en Redis con una clave única. Luego, se envía el mensaje a todos los clientes conectados. En una lista Redis, se almacenan las claves de los últimos 10 mensajes enviados.

## Cliente

Utilizando React se implementó el cliente de la aplicación, donde `App.js` es el componente principal de la aplicación de chat. Aquí es donde se manejan los estados de los mensajes y los usuarios, así como la conexión WebSocket.

**Estados**: Se utilizan varios estados para manejar la información del usuario (`user`), el mensaje que se está escribiendo (`message`), el último mensaje recibido (`receivedMessage`), la URL del servidor WebSocket (`socketUrl`) y el historial de mensajes (`messageHistory`).

**useWebSocket**: Se utiliza el hook `useWebSocket` para manejar la conexión WebSocket. Este hook proporciona varias funciones y valores, incluyendo `sendMessage` para enviar mensajes, `lastMessage` para acceder al último mensaje recibido y `readyState` para conocer el estado de la conexión.

**Manejo de mensajes**: Se definen funciones para manejar los mensajes. `handleSendMessage` se utiliza para enviar un mensaje y `handleMessageInput` se utiliza para actualizar el estado message cuando el usuario escribe un mensaje.

**Manejo de usuarios**: `handleUserInput` se utiliza para actualizar el estado `user` cuando el usuario introduce su nombre.

**useEffect**: Se utiliza el hook `useEffect` para actualizar el historial de mensajes cada vez que se recibe un nuevo mensaje. Primero, se trata de parsear el mensaje recibido, ya que si es un Array, se trata de un mensaje de historial. Si es un string, se trata de un mensaje normal.

**Renderizado**: En la función de renderizado, se muestran dos campos de entrada para el nombre del usuario y el mensaje, y se manejan sus eventos `onChange` para actualizar los estados correspondientes.

# Organización del Proyecto

El proyecto está organizado de la siguiente manera:
- `redis_client`: Contiene el cliente de la aplicación de chat implementado en React. También contiene el Dockerfile para contenerizar la aplicación.
- `redis_server`: Contiene el servidor de la aplicación de chat implementado en Node.js. También contiene el Dockerfile para contenerizar la aplicación.
- `kubernetes_yaml`: Contiene los archivos .yaml para desplegar la aplicación en un cluster de Kubernetes.
- `terraform`: Contiene los archivos de Terraform para crear la infraestructura de la aplicación.

# Cómo se Implementó y Desplegó la Aplicación

## Terraform

Se utilizó Terraform para automatizar la creación y gestión de la infraestructura de la aplicación. 

Para ello, se navegó hasta el directorio `terraform` y se estableció las variables de entorno de Proxmox con el siguiente comando:

```bash
  source ./set_env.sh
```

Luego, en el directorio `terraform/nodes` se inicializó Terraform con el siguiente comando:

```bash
  terraform init
```

Después, se crearon las máquinas virtuales con el siguiente comando:

```bash
  terraform apply
```
Al realizar el comando anterior, se crearon tres máquinas virtuales: un servidor (con IP = 10.230.50.101) y dos clientes (con IP = 10.230.50.102-3).

Luego, se les instaló k3s a las máquinas virtuales. Instalando el componente de servidor en la máquina virtual con IP = 10.230.50.101 y el componente de agente en las máquinas virtuales con IP = 10.230.50.101-2.

A través de kubectl se administró el cluster de Kubernetes y se desplegó la aplicación.

## Instalación de MetalLB

Para instalar MetalLB en el cluster de Kubernetes, se ejecutó el siguiente comando:

```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.5/config/manifests/metallb-native.yaml
```

Se creó el archivo `metallb.yaml` en el directorio `kubernetes_yaml` con el configmap de MetalLB y se aplicó al cluster con el siguiente comando:

```bash
kubectl apply -f metallb.yaml
```

## Contenerización (Containerization)

Cuando se terminó de implementar la aplicación, se crearon los `Dockerfiles` para el cliente y el servidor de la aplicación (cada uno se encuentra en sus respectivos directorios). Luego, se crearon las imágenes Docker y se subieron a DockerHub.

Para crear y subir la imagen Docker del servidor, en el directorio `redis_server` se ejecutaron los siguientes comandos:

```bash
docker build -t chat-sv:<tag> .
docker tag chat-sv:<tag> <user>/chat-sv:<tag>
docker push <user>/chat-sv:<tag>
```

Para el cliente se hizo el proceso análogo en el directorio `redis_client` reemplazando `chat-sv` por `chat-client` en los comandos.

## Despliegue en Kubernetes

Para desplegar la aplicación en Kubernetes, se crearon los archivos .yaml en el directorio `kubernetes_yaml`. Estos archivos contienen la configuración de los servicios, los deployments y los ingress de la aplicación.

Para desplegar la aplicación, en el directorio `kubernetes_yaml` se ejecutó el siguiente comando:

```bash
kubectl apply -f .
```
Tras ejecutar el comando anterior (y esperar un tiempo) fue posible acceder a la aplicación a través de la IP externa del cliente y usar el chat.

# Cómo Conectarse a la Aplicación

Para conectarse a la aplicación es necesario pertenecer a la VPN de ZeroTier de la cátedra (`network id: 159924d630305675`). Se puede acceder a la aplicación en el siguiente [enlace](http://10.230.50.4/).

# Cómo Desplegar el Proyecto

## Localmente

Para construir el proyecto localmente, se pueden seguir los siguientes pasos:

1. Clonar el repositorio.
2. Cambiar todas las referencias a la IP del servidor en el cliente y del redis en el servidor por `localhost`.
3. Navegar hasta el directorio `redis_client`.
4. Ejecutar `npm install` para instalar las dependencias.
5. Ejecutar `npm start` para iniciar el cliente.
6. Navegar hasta el directorio `redis_server`.
7. Ejecutar `npm install` para instalar las dependencias.
8. Ejecutar `npm start` para iniciar el servidor.

## En Kubernetes

Para construir el proyecto en Kubernetes, se pueden seguir los siguientes pasos:

1. Clonar el repositorio.
2. Seguir los pasos descritos en la sección [Cómo se Implementó y Desplegó la Aplicación](#cómo-se-implementó-y-desplegó-la-aplicación). **Nota:** Es necesario colocar las credenciales de Proxmox en el archivo `set_env.sh`.

# Limitaciones y Decisiones de Implementación

- No se controla si el nombre de usuario ya está en uso.
- Se guardan todos los mensajes en Redis, con una clave única (la marca de tiempo del mensaje). Sin embargo so se muestran los últimos 10 mensajes anteriores.
  - Una posible mejora sería eliminar los mensajes más antiguos para evitar que la base de datos crezca indefinidamente.
- Solo es posible replicar el cliente, pero no el servidor. Esto se debe al uso de websockets para mostrar los mensajes en tiempo real.
  - Si se hubiera replicado el servidor, habría sido necesario implementar un mecanismo de comunicación entre los servidores para mantener la coherencia de los mensajes.
  - Ya que, al duplicarse, se duplicarían los websockets. Por lo tanto, los clientes se conectarían a diferentes websockets y no recibirían los mensajes de los clientes conectados a otro websocket.
- El servidor del chat cuenta con una IP externa, debido a que era necesaria para poder utilizar websockets.
- La decisión de utilizar websockets se debió a que en clase el profesor dijo que se tendría una mejor nota si se utilizaban.
