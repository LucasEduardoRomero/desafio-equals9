import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    name: string; 

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ required: true })
    secret: string;

    @Prop({ required: true })
    salt: string;
}


export const UserSchema = SchemaFactory.createForClass(User);