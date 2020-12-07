import { Publisher, Events, Subjects } from "@encuentradepa/common";

export class TicketCreated extends Publisher<Events.TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
