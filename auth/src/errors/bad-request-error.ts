import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string = "BadRequestError") {
    super(message);

    // Solo por que estamos extendiendo una clase nativa de JS (Error) tenemos que usar este método
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
