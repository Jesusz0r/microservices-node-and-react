import { Events } from "@encuentradepa/common";

export class PaymentCreated extends Events.Publisher<Events.Types.PaymentCreated> {
  readonly subject = Events.Subjects.PaymentCreated;
}
