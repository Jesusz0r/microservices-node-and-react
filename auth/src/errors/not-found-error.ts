import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("NotFound");

    // Solo por que estamos extendiendo una clase nativa de JS (Error)
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: "Not found.",
      },
    ];
  }
}
