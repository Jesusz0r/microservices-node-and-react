import { Events } from "@encuentradepa/common";

export class ExpirationCompleted extends Events.Publisher<Events.EventTypes.ExpirationCompleted> {
  readonly subject = Events.Subjects.ExpirationCompleted;
}
