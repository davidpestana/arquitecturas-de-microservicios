# Laboratorios resueltos (M2–M5)

Código alineado con los guiones `MODULOS/**/**_practica_*.md`. En cada carpeta:

```bash
docker compose up
```

(Desde esa carpeta; el `docker-compose.yml` genera `package.json` local al arrancar el contenedor.)

| Carpeta | Módulo | Guion |
|--------|--------|--------|
| [`resiliencia/`](./resiliencia/) | 2.4 | Resiliencia + RabbitMQ |
| [`mensajeria_eventos/`](./mensajeria_eventos/) | 3.4 | Coreografía u orquestación |
| [`cqrs_event_sourcing/`](./cqrs_event_sourcing/) | 4.3 | CQRS + bus de eventos |
| [`gateway_jwt/`](./gateway_jwt/) | 5.4 | Gateway + JWT |

**Nota:** varios labs usan el mismo nombre de contenedor `rabbitmq` y los mismos puertos (p. ej. 5672, 15672). Levanta **un stack a la vez** o usa `docker compose down` antes de cambiar de carpeta.

Esta árbol vive en la rama **`labs-resueltos`** como referencia; en **`main`** puedes dejar `LABS/` vacío y construir desde cero siguiendo los guiones.
