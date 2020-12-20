import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting.");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<Stan> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", async () => {
        console.log("Publisher connected to NATS!");
        resolve(this.client);

        this.client.on("error", (error) => {
          reject(error);
        });
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
