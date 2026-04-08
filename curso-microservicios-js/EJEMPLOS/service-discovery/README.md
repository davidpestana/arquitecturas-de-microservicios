# Ejemplo: Service Discovery con Consul

## Objetivo pedagógico

Ver **registro** de un microservicio al iniciar y **descubrimiento** por nombre desde un cliente, sin hardcodear IP/puerto definitivos en el consumidor: el cliente pregunta a **Consul** qué instancias hay vivas y llama a una de ellas.

## Qué necesitas

- Docker

## Cómo ejecutarlo

Desde esta carpeta `service-discovery`:

```bash
docker compose up --build
```

Interfaz web habitual: **http://localhost:8500** (según `docker-compose.yaml`).
`servicioA` y `servicioB` también se levantan en contenedores y usan la red interna de Docker para hablar con Consul.

## Qué deberías ver

- En **servicioA**: logs de registro en Consul y peticiones `GET /hello` cuando arranque `B`.
- En **servicioB**: URL resuelta y el JSON de respuesta del `hello`.
- En la **UI de Consul**: el servicio listado y, si aplica, el health check en estado *passing*.

## Qué comprobar

- Con **solo** Consul y **sin** `servicioA`, `servicioB` debería fallar el descubrimiento o no ver instancias saludables.
- Tras levantar `servicioA`, `servicioB` debe completar la llamada.
- Si paras `servicioA`, Consul debe marcar el health check como no saludable.

## Dónde poner el foco

- Diferencia entre **“sé la URL en el código”** (como en [distribuida](../distribuida/)) y **“pregunto al registro quién soy y dónde estoy”**.
- En Kubernetes u orquestadores modernos el papel de “Consul + agente” está a menudo **integrado** en el plano de servicios, pero la **idea** (nombre lógico → endpoints reales) es la misma.

## Conclusiones

El descubrimiento permite **rotar**, **escalar** y **reemplazar** instancias sin recompilar el cliente por cada cambio de IP. El paquete npm `consul` usado aquí está **deprecated**; sirve como **demostración didáctica**; en producción suele usarse el ecosistema oficial de Hashicorp, Kubernetes Services, etc. Encaja con el **módulo 2.2**.
