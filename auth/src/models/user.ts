import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Interfaz que define las propiedades necesarias para crear un nuevo usuario
interface UserAttributes {
  email: string;
  password: string;
}

// Interfaz que describe las propiedades que tendrá el documento creado
// cuando creamos un nuevo usuario en mongo
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  // _id: mongoose.Types.ObjectId;
  // createdAt: string;
  // updatedAt: string;

  // methods
  hashPassword(password: string): Promise<UserDocument>;
  comparePassword(password: string): Promise<Boolean>;
}

// Interfaz que describe el modelo de nuestro usuario
interface UserModel extends mongoose.Model<UserDocument> {
  build(user: UserAttributes): UserDocument;
  hashPassword(password: string): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret.password;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

// Creamos esta funcion como "envoltorio" para poder decirle a TypeScript el tipo de interfaz que debe tener un usuario, es decir,
// las propiedades y usamos esta nueva función para crear los nuevos usuarios de ahora en adelante. De esta forma cada vez que
// creémos un nuevo usuario, TypeScript reconocerá las propiedades del objeto que estamos pasando y nos dirá si tenemos un error o
// si no tiene la "interfaz" esperada.
userSchema.statics = {
  build: function (user: UserAttributes): UserDocument {
    return new this(user);
  },
};
userSchema.methods = {
  hashPassword: async function (password: string): Promise<UserDocument> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      this.password = hash;
    } catch (error) {
      throw error;
    }

    return this.save();
  },
  comparePassword: async function (password: string): Promise<Boolean> {
    try {
      const result = await bcrypt.compare(password, this.password);

      return result;
    } catch (error) {
      throw error;
    }
  },
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
