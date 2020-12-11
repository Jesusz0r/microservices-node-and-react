import { Events } from "@encuentradepa/common";

export class OrderCancelledPublisher extends Events.Publisher<Events.EventTypes.OrderCancelled> {
  readonly subject = Events.Subjects.OrderCancelled;
}
