import { ConvoEntry } from "../entities/ConvoEntry";
import { isAuth } from "../middleware/isAuth";
import { UseMiddleware, Arg, Mutation, Resolver, Field, InputType, Query, FieldResolver, Root } from "type-graphql";
import { typeormDataSource } from "../typeormDatasource";
import { Convo } from "../entities/Convo";
import { ConvoEntryResponse } from "../entities/ConvoEntryResponse";


@InputType()
class ConvoEntryInput {

  @Field(() => String)
  convoId: string;

  @Field(() => String)
  label: string;

  @Field(() => String)
  promptText: string;

  @Field(() => String)
  answerSuggestion: string;

  @Field(() => String, {nullable: true})
  parentConvoEntryResponseId: string
}


@Resolver(ConvoEntry)
export class ConvoEntryResolver {

  @FieldResolver(() => Convo)
  async convo(
    @Root() root: ConvoEntry
  ): Promise<Convo> {
    return Convo.findOneByOrFail({
      id: root.convoId
    });
  }

  @FieldResolver(() => [ConvoEntryResponse])
  async childConvoEntryResponses(
    @Root() root: ConvoEntry
  ): Promise<ConvoEntryResponse[]> {
    return ConvoEntryResponse.findBy({
      parentConvoEntryId: root.id
    });
  }

  @FieldResolver(() => [ConvoEntryResponse])
  async parentConvoEntryResponses(
    @Root() root: ConvoEntry
  ): Promise<ConvoEntryResponse[]> {
    return ConvoEntryResponse.findBy({
      childConvoEntryId: root.id
    });
  }

  @Query(() => ConvoEntry, {nullable: true})
  @UseMiddleware(isAuth)
  async convoEntry(
    @Arg('id') id: string,
  ): Promise<ConvoEntry | null> {

    return ConvoEntry.findOneBy({ id });
  }

  @Query(() => [ConvoEntry], {nullable: true})
  @UseMiddleware(isAuth)
  async convoEntries(
    @Arg('convoId') convoId: string
  ): Promise<ConvoEntry[] | null> {

    return ConvoEntry.findBy({convoId});
  }

  @Mutation(() => ConvoEntry)
  @UseMiddleware(isAuth)
  async createConvoEntry(
    @Arg('input') input: ConvoEntryInput
  ): Promise<ConvoEntry> {

    const count = await ConvoEntry.countBy({convoId: input.convoId});
    const isRoot = count === 0;
    const entry = await ConvoEntry.create({...input, isRoot}).save();

    // If the parent convo entry response ID is listed, then update the response to have this entry as a child
    if (input.parentConvoEntryResponseId && count !== 0) {
      await typeormDataSource.createQueryBuilder()
        .update(ConvoEntryResponse)
        .set({
          childConvoEntryId: entry.id
        })
        .where('id = :id', {
          id: input.parentConvoEntryResponseId
        })
        .execute();
    }

    return entry;
  }

  @Mutation(() => ConvoEntry, { nullable: true })
  @UseMiddleware(isAuth)
  async updateConvoEntry(
    @Arg("id") id: string,
    @Arg("input") input: ConvoEntryInput
  ): Promise<ConvoEntry | null> {
    const result = await typeormDataSource.createQueryBuilder()
      .update(ConvoEntry)
      .set({
        label: input.label,
        promptText: input.promptText,
        answerSuggestion: input.answerSuggestion
      })
      .where('id = :id and "convoId" = :convoId', {
        id, convoId: input.convoId
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteConvoEntry(
    @Arg('id') id: string,
    @Arg('convoId') convoId: string
  ): Promise<boolean> {


    const parentConvoEntryResponses = await ConvoEntryResponse.findBy({
      childConvoEntryId: id
    });

    await ConvoEntry.delete({ id, convoId });

    await typeormDataSource.getRepository(ConvoEntryResponse).save(
      parentConvoEntryResponses
        .map(parentConvoEntryResponse => {
          parentConvoEntryResponse.childConvoEntryId = null;
          return parentConvoEntryResponse;
        }));
  
    return true;
  }
}