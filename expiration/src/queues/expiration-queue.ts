import Queue from "bull";

import { natsWrapper } from "../nats-wrapper";
import { Publishers } from "../events";

if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST environment variable is required.");
}

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async ({ data }) => {
  const { orderId } = data;
  const expirationCompletedPublisher = new Publishers.ExpirationCompleted(
    natsWrapper.client
  );

  expirationCompletedPublisher.publish({ orderId });
});

export { expirationQueue };
