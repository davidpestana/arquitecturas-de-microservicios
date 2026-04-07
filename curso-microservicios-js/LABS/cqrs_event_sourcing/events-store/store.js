export const events = [];
export function save(evento) {
  events.push(evento);
  console.log("💾 Guardado en Event Store:", evento.tipo);
}
export function all() {
  return events;
}
