import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);

    // Solo por que estamos extendiendo una clase nativa de JS (Error) tenemos que usar este método
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
