import { Events } from "@encuentradepa/common";
export class TicketCreated extends Events.Publisher<Events.EventTypes.TicketCreated> {
  readonly subject = Events.Subjects.TicketCreated;
}
