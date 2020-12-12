import { Events } from "@encuentradepa/common";

class OrderCancelled extends Events.Publisher<Events.EventTypes.OrderCancelled> {
  readonly subject = Events.Subjects.OrderCancelled;
}

export { OrderCancelled };
