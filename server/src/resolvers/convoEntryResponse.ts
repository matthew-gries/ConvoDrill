import { ConvoEntryResponse } from "../entities/ConvoEntryResponse";
import { isAuth } from "../middleware/isAuth";
import { Arg, Field, FieldResolver, InputType, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { ConvoEntry } from "../entities/ConvoEntry";
import { typeormDataSource } from "../typeormDatasource";

@InputType()
class ConvoEntryResponseInput {

  @Field(() => String)
  parentConvoEntryId: string;

  @Field(() => String)
  responseText: string;

  @Field(() => String)
  label: string;
}


@Resolver(ConvoEntryResponse)
export class ConvoEntryResponseResolver {

  @FieldResolver(() => ConvoEntry, {nullable: true})
  @UseMiddleware(isAuth)
  async parentConvoEntry(
    @Root() root: ConvoEntryResponse
  ): Promise<ConvoEntry | null> {
    return ConvoEntry.findOneBy({
      id: root.parentConvoEntryId
    });
  }


  @FieldResolver(() => ConvoEntry, {nullable: true})
  @UseMiddleware(isAuth)
  async childConvoEntry(
    @Root() root: ConvoEntryResponse
  ): Promise<ConvoEntry | null> {
    if (!root.childConvoEntryId) {
      return null;
    }

    return ConvoEntry.findOneBy({
      id: root.childConvoEntryId
    });
  }

  @Query(() => ConvoEntryResponse, {nullable: true})
  @UseMiddleware(isAuth)
  async convoEntryResponse(
    @Arg('id') id: string,
    @Arg('parentConvoEntryId') parentConvoEntryId: string
  ): Promise<ConvoEntryResponse | null> {

    return ConvoEntryResponse.findOneBy({
      id,
      parentConvoEntryId
    });
  }

  @Mutation(() => ConvoEntryResponse)
  @UseMiddleware(isAuth)
  async createConvoEntryResponse(
    @Arg('input') input: ConvoEntryResponseInput
  ): Promise<ConvoEntryResponse> {

    return ConvoEntryResponse.create({...input}).save();
  }

  @Mutation(() => ConvoEntryResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateConvoEntryResponse(
    @Arg("id") id: string,
    @Arg("input") input: ConvoEntryResponseInput
  ): Promise<ConvoEntryResponse | null> {
    const result = await typeormDataSource.createQueryBuilder()
      .update(ConvoEntryResponse)
      .set({
        label: input.label,
        responseText: input.responseText
      })
      .where('id = :id and "parentConvoEntryId" = :parentConvoEntryId', {
        id, parentConvoEntryId: input.parentConvoEntryId
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteConvoEntryResponse(
    @Arg('id') id: string,
    @Arg('parentConvoEntryId') parentConvoEntryId: string
  ): Promise<boolean> {

    await ConvoEntryResponse.delete({ id, parentConvoEntryId });
    return true;
  }
}