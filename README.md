## 📘 Temario – Curso “Arquitecturas de Microservicios”

**Duración:** 12 h · **Primer tema:** [1.1 – ¿Qué es una arquitectura monolítica?](curso-microservicios-js/MODULOS/Modulo1/1.1_que_es_una_arquitectura_monolitica.md) · **Índice de ejemplos:** [`EJEMPLOS/README.md`](curso-microservicios-js/EJEMPLOS/README.md)

---

### Alumnos: fork + GitHub Codespaces

1. **Fork** del repositorio y abre un **Codespace** desde tu fork (*Code* → *Codespaces*).
2. **Teoría:** [`MODULOS/`](curso-microservicios-js/MODULOS/) · **Ejemplos:** [`EJEMPLOS/`](curso-microservicios-js/EJEMPLOS/) (cada carpeta trae un `README` con los pasos).
3. **Laboratorios:** los construyes en `curso-microservicios-js/LABS/` siguiendo los guiones `*_practica_*.md` (en `main` esa carpeta no viene rellena).

En el **Codespace por defecto** ya tienes **Node** y **Docker**; para abrir APIs y UIs en el navegador usa la pestaña **Ports**.

---

### 🧩 **Módulo 1 – Del Monolito a los Microservicios** *(2h)*

#### 1.1 Conceptos iniciales — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo1/1.1_que_es_una_arquitectura_monolitica.md)

* ¿Qué es una arquitectura monolítica?
* Limitaciones comunes: escalado, acoplamiento y mantenimiento.
* Introducción al paradigma distribuido.

#### 1.2 Evolución hacia microservicios — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo1/1.2_limitaciones_comunes.md)

* Motivaciones técnicas y organizativas.
* Principio de responsabilidad única (SRP) en la arquitectura.
* Ventajas y desventajas de la transición.

#### 1.3 Diseño conceptual — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo1/1.3_introduccion_paradigma_distribuido.md)

* Separación de dominios de negocio.
* Contextos delimitados (*Bounded Contexts*).
* Definición de contratos API entre servicios.

#### 1.4 Práctica LAB1 – “Desacoplando el monolito”

* Crear un monolito Express con endpoints `/users` y `/orders`.
* Separar en dos servicios independientes.
* Probar comunicación REST con Axios.

📁 **Material en el repositorio:** [`EJEMPLOS/monolito`](curso-microservicios-js/EJEMPLOS/monolito) · [`EJEMPLOS/distribuida`](curso-microservicios-js/EJEMPLOS/distribuida)

Los mismos ejemplos se citan en teoría en **1.1**, **1.2**, **1.3** (monolito / distribuida) y en **2.1** (comunicación síncrona). **Service Discovery** tiene ejemplo en [`EJEMPLOS/service-discovery`](curso-microservicios-js/EJEMPLOS/service-discovery), enlazado desde el tema **2.2**.

---

### ⚙️ **Módulo 2 – Comunicación, Descubrimiento y Resiliencia** *(3h)*

#### 2.1 Comunicación entre servicios — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo2/2.1_comunicacion_entre_servicios.md)

* Comunicación síncrona: REST sobre HTTP.
* Comunicación asíncrona: eventos y colas.
* JSON como formato estándar de intercambio.

#### 2.2 Service Discovery — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo2/2.2_service_discovery.md)

* Problema del direccionamiento dinámico.
* Registro y descubrimiento (Eureka, Consul, Kubernetes).
* Ejemplo con **Consul** y Node.js en [`EJEMPLOS/service-discovery`](curso-microservicios-js/EJEMPLOS/service-discovery).

#### 2.3 Balanceo y tolerancia a fallos — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo2/2.3_balanceo_y_resiliencia.md)

* Tipos de balanceo (cliente, servidor, DNS).
* Patrón *Circuit Breaker*: detección de errores y fallback.
* Librería `opossum` para Circuit Breaker en Node.js.

📁 Ejemplo breve: [`EJEMPLOS/resiliencia_minima`](curso-microservicios-js/EJEMPLOS/resiliencia_minima).

#### 2.4 Práctica LAB2 – “Resiliencia aplicada” — 📄 [Abrir laboratorio](curso-microservicios-js/MODULOS/Modulo2/2.4_practica_resiliencia.md)

* Implementar llamadas entre servicios con Axios.
* Añadir *retry*, *timeout* y *circuit breaker*.
* Simular fallos de un servicio y observar la recuperación (incl. mensajería RabbitMQ en el lab).

---

### 🔄 **Módulo 3 – Mensajería Distribuida y Eventos** *(2h)*

#### 3.1 Introducción a la mensajería distribuida — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo3/3.1_arquitectura_eventos.md)

* Rol del *broker* (RabbitMQ, Kafka) y mensajería asíncrona frente a REST.
* Contraste *request/response* vs *publish/subscribe*; productores, consumidores, colas y topics.
* Garantías de entrega (at-least-once, exactly-once).

📁 RabbitMQ mínimo (publicador / consumidor): [`EJEMPLOS/mensajeria_simple`](curso-microservicios-js/EJEMPLOS/mensajeria_simple).

#### 3.2 Patrones de enrutamiento y publicación (*exchanges*) — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo3/3.2_message_broker.md)

* Tipos de *exchange* (direct, fanout, topic) y claves de enrutamiento.
* Flujo en el broker; idempotencia y consistencia eventual.

#### 3.3 Coreografía vs Orquestación — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo3/3.3_coreografia_vs_orquestacion.md)

* Diferencia entre coordinación centralizada y descentralizada.
* Patrones de integración por eventos.

#### 3.4 Práctica LAB3 – “Eventos de pedido” — 📄 [Abrir laboratorio](curso-microservicios-js/MODULOS/Modulo3/3.4_practica_eventos.md)

* Ejecutar **RabbitMQ** con Docker Compose (local o Codespaces).
* **Coreografía:** publicar eventos (p. ej. `pedido.creado`) desde `orders-service` y encadenar **payments**, **shipping** y **notifications** mediante el bus.
* **Orquestación:** coordinar el flujo con `orchestrator-service` vía HTTP (extiende el lab según el guion).

---

### 🧠 **Módulo 4 – CQRS y Event Sourcing** *(2h)*

#### 4.1 Separación de comandos y consultas — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo4/4.1_cqrs_comandos_y_consultas.md)

* Concepto CQRS (*Command Query Responsibility Segregation*).
* Ventajas: optimización de lectura y escritura.
* Casos de uso típicos: informes, auditorías, procesamiento intensivo.

#### 4.2 Event Sourcing (introducción) — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo4/4.2_event_sourcing.md)

* Almacenar cambios como eventos en lugar de estado final.
* Reconstrucción del estado desde el historial.
* Beneficios y retos: trazabilidad, complejidad.

#### 4.3 Práctica LAB4 – “Command vs Query” — 📄 [Abrir laboratorio](curso-microservicios-js/MODULOS/Modulo4/4.3_practica_cqrs.md)

* Implementar **`POST /pedido`** (command) y **`GET /pedidos`** (query) en servicios distintos.
* Generar un evento tras cada comando y consumirlo en el servicio de consultas.
* Mostrar consistencia eventual mediante logs.

---

### 🛡️ **Módulo 5 – Gateway y Seguridad en Microservicios** *(3h)*

#### 5.1 API Gateway — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo5/5.1_api_gateway.md)

* Función: punto único de entrada, routing, autenticación.
* Ejemplos: Kong, NGINX, Spring Cloud Gateway; en el laboratorio 5.4 se usa **Express** como gateway.
* Edge Services y control de tráfico.

📁 Gateway mínimo (Express + enrutado a microservicios): [`EJEMPLOS/gateway_minimo`](curso-microservicios-js/EJEMPLOS/gateway_minimo).

#### 5.2 Seguridad distribuida — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo5/5.2_seguridad_distribuida.md)

* Principios: *Zero Trust*, autenticación y autorización distribuida.
* JSON Web Tokens (JWT) como estándar.
* Validación de tokens en cada servicio.

#### 5.3 Gestión de configuración y secretos — 📄 [Abrir tema](curso-microservicios-js/MODULOS/Modulo5/5.3_configuracion_y_secretos.md)

* Variables de entorno (.env) y configuración centralizada.
* Principio de *12-Factor App* aplicado a microservicios.

#### 5.4 Práctica LAB5 – “Gateway y autenticación JWT” — 📄 [Abrir laboratorio](curso-microservicios-js/MODULOS/Modulo5/5.4_practica_gateway_jwt.md)

* **API Gateway** en Express que **enruta** hacia microservicios usando **`axios`**.
* **`auth-service`** con **`POST /login`**; el gateway expone **`POST /api/login`** y reenvía la petición.
* Validar JWT en el gateway y proxy de **`GET /api/pedidos`** hacia **orders-service** con el token.

---

### 🧩 **Cierre y Conclusiones (opcional, 15 min)**

* Revisión de los patrones aprendidos.
* Buenas prácticas en despliegue: Docker Compose y Kubernetes.
* Recomendaciones de lectura y herramientas (Istio, Linkerd, Dapr, etc.).

📄 **Último laboratorio del curso:** [5.4 – Gateway y JWT](curso-microservicios-js/MODULOS/Modulo5/5.4_practica_gateway_jwt.md)
