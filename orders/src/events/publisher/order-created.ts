import { Events } from "@encuentradepa/common";

class OrderCreatedPublisher extends Events.Publisher<Events.EventTypes.OrderCreated> {
  readonly subject = Events.Subjects.OrderCreated;
}

export { OrderCreatedPublisher };
