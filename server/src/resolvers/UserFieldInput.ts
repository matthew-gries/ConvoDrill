import { InputType, Field } from "type-graphql";


@InputType()
export class UserFieldInput {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
}
