import { Events } from "@encuentradepa/common";

class OrderCreated extends Events.Publisher<Events.Types.OrderCreated> {
  readonly subject = Events.Subjects.OrderCreated;
}

export { OrderCreated };
