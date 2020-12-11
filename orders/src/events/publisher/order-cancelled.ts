import { Events } from "@encuentradepa/common";

class OrderCancelledPublisher extends Events.Publisher<Events.EventTypes.OrderCancelled> {
  readonly subject = Events.Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };
