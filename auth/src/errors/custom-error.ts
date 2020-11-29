// Creamos una abstract class para crear una "estructura" que deben tener todos nuestros errores
// custom. De esta forma mantenemos una consistencia en todas nuestras apis.

// Podríamos usar una interfaz para definir la estructura de nuestros errores CustomError pero
// usar una clase abstracta en vez de interfaz tiene la ventaja de que a la hora de compilar
// a JavaScript SI se crea una clase, por lo que pudiésemos hacer checks con instanceof === CustomError.
// Por otro lado, una interfaz desaparece cuando se hace la compilación a JavaScript.
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Solo por que estamos extendiendo una clase nativa de JS (Error) tenemos que usar este método
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // No estamos definiendo un método, simplemente le estamos diciendo que si creamos una clase que hereda
  // de CustomError debe tener este método que retorna un array de objectos { message: string, field?: string }
  abstract serializeErrors(): { message: string; field?: string }[];
}
