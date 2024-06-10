# PI-DelLongo-Masuelli
Este proyecto implementa una aplicación de chat en tiempo real utilizando WebSockets y Redis como medio de 
comunicación.

## Desarrollo de la aplicación

### Implementación del servidor
El servidor fue implementado utilizando Node.js, el archivo server.js es el punto de entrada para el servidor de la aplicación de chat. Aquí se inicializan y configuran el cliente Redis y el servidor WebSocket.

**Cliente Redis**: Se crea una conexión con una instancia de Redis, que es una base de datos en memoria. Esta conexión se utiliza para almacenar y recuperar mensajes de chat. Los mensajes se almacenan con una clave única (la marca de tiempo del mensaje) y el valor es el mensaje en sí.

**Servidor WebSocket**: Se crea un servidor WebSocket que escucha en el puerto 8000. Cuando un cliente se conecta, se recuperan todos los mensajes de la base de datos Redis y se envían al cliente.

**Manejo de mensajes**: Cuando un cliente envía un mensaje, este se almacena en Redis y luego se retransmite a todos los clientes conectados.

### Implementación del cliente
Utilizando React se implementó el cliente de la aplicación, deonde App.js es el componente principal de la aplicación de chat. Aquí es donde se manejan los estados de los mensajes y los usuarios, así como la conexión WebSocket.

**Estados**: Se utilizan varios estados para manejar la información del usuario (user), el mensaje que se está escribiendo (message), el último mensaje recibido (receivedMessage), la URL del servidor WebSocket (socketUrl) y el historial de mensajes (messageHistory).

**useWebSocket**: Se utiliza el hook useWebSocket para manejar la conexión WebSocket. Este hook proporciona varias funciones y valores, incluyendo sendMessage para enviar mensajes, lastMessage para acceder al último mensaje recibido y readyState para conocer el estado de la conexión.

**Manejo de mensajes**: Se definen funciones para manejar los mensajes. handleSendMessage se utiliza para enviar un mensaje y handleMessageInput se utiliza para actualizar el estado message cuando el usuario escribe un mensaje.

**Manejo de usuarios**: handleUserInput se utiliza para actualizar el estado user cuando el usuario introduce su nombre.

**useEffect**: Se utiliza el hook useEffect para actualizar el historial de mensajes cada vez que se recibe un nuevo mensaje.

**Renderizado**: En la función de renderizado, se muestran dos campos de entrada para el nombre del usuario y el mensaje, y se manejan sus eventos onChange para actualizar los estados correspondientes.

## Terraform

Utilizamos Terraform para automatizar la creación y gestión de la infraestructura de la aplicación.

## Docker y Kubernetes

Hemos creado una imagen Docker de la aplicación y la hemos subido a DockerHub. Esta imagen Docker se puede utilizar para desplegar la aplicación en un cluster de Kubernetes.

### Creación de la imagen Docker

Para crear la imagen Docker de la aplicación, utilizamos el siguiente comando:

```bash
docker build -t chat-client
docker build -t redis-sv
```

Después de crear la imagen, la subimos a DockerHub con el siguiente comando:

```bash
docker push nombre_de_tu_imagen
```

### Despliegue en Kubernetes

Gneramos los archivos .yaml que se encuentran en la carpeta /kubernetes_yaml y mediante el siguiente comando 
desplegamos la aplicación:

```bash
kubectl apply -f .
```

## Cómo construir el proyecto

Para construir el proyecto localmente, sigue estos pasos:

1. Clona el repositorio.
2. Navega hasta el directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.
4. Ejecuta `npm start` para iniciar el servidor.

## Cómo conectarse a la aplicación
El cliente de la aplicación está disponible en http://10.230.50.2/


