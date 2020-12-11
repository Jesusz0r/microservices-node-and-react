import { Events } from "@encuentradepa/common";

export class TicketUpdated extends Events.Publisher<Events.EventTypes.TicketUpdated> {
  readonly subject = Events.Subjects.TicketUpdated;
}
