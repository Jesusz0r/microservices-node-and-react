import { Publisher, Events, Subjects } from "@encuentradepa/common";

export class TicketUpdated extends Publisher<Events.TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
