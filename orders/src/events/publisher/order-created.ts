import { Events } from "@encuentradepa/common";

export class OrderCreatedPublisher extends Events.Publisher<Events.EventTypes.OrderCreated> {
  readonly subject = Events.Subjects.OrderCreated;
}
