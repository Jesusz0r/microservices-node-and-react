import { Events } from "@encuentradepa/common";

class OrderCreated extends Events.Publisher<Events.EventTypes.OrderCreated> {
  readonly subject = Events.Subjects.OrderCreated;
}

export { OrderCreated };
