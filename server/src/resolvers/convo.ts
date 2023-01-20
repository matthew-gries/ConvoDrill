import { typeormDataSource } from "../typeormDatasource";
import { Resolver, Arg, Ctx, Mutation, UseMiddleware, ObjectType, Int, Field, Query, InputType, FieldResolver, Root } from "type-graphql";
import { Convo } from "../entities/Convo";
import { isAuth } from "../middleware/isAuth";
import { ResolverContext } from "../types";
import { ConvoEntry } from "../entities/ConvoEntry";
import { User } from "../entities/User";


@ObjectType()
class PaginatedConvos {

  @Field(() => [Convo])
  convos: Convo[];

  @Field()
  hasMore: boolean;
}

@InputType()
class ConvoInput {

  @Field(() => String)
  title: String;

  @Field(() => String)
  targetLanguage: String;

  @Field(() => String)
  nativeLanguage: String;
}

@Resolver(Convo)
export class ConvoResolver {

  @FieldResolver(() => [ConvoEntry], { nullable: true })
  async convoEntries(
    @Root() root: Convo
  ): Promise<ConvoEntry[] | null> {
    return ConvoEntry.find({
      where: {
        convoId: root.id
      }
    });
  }

  @FieldResolver(() => ConvoEntry, { nullable: true })
  async rootConvoEntry(
    @Root() root: Convo
  ): Promise<ConvoEntry | null> {
    return ConvoEntry.findOne({
      where: {
        convoId: root.id,
        isRoot: true
      }
    });
  }

  @FieldResolver(() => User, { nullable: false })
  async user(
    @Root() root: Convo
  ): Promise<User> {
    return User.findOneByOrFail({
      id: root.userId
    });
  }

  @Query(() => PaginatedConvos)
  @UseMiddleware(isAuth)
  async convos(
    @Arg('skip', () => Int) skip: number,
    @Arg('limit', () => Int) limit: number,
    @Ctx() { req }: ResolverContext
  ): Promise<PaginatedConvos> {

    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const userId = req.session.userId!;

    const convos: Convo[] = await typeormDataSource.query(`
      select c.*,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
      ) creator
      from convo c
      inner join public.user u on u.id = c."userId"
      where c."userId" = '${userId}'
      order by c."updatedAt" DESC
      limit ${realLimitPlusOne}
      offset ${skip}
    `);


    return {
      convos: convos.slice(0, realLimit),
      hasMore: convos.length === realLimitPlusOne
    }
  }

  @Query(() => Convo, {nullable: true})
  @UseMiddleware(isAuth)
  async convo(
    @Arg('id') id: string
  ): Promise<Convo | null> {

    return Convo.findOneBy({ id })
  }

  @Mutation(() => Convo)
  @UseMiddleware(isAuth)
  async createConvo(
    @Arg('input') input: ConvoInput,
    @Ctx() { req }: ResolverContext
  ): Promise<Convo> {

    return Convo.create({
      ...input,
      userId: req.session.userId!
    })
    .save();
  }

  @Mutation(() => Convo, { nullable: true })
  @UseMiddleware(isAuth)
  async updateConvo(
    @Arg("id") id: string,
    @Arg("input") input: ConvoInput,
    @Ctx() { req }: ResolverContext
  ): Promise<Convo | null> {
    const result = await typeormDataSource.createQueryBuilder()
      .update(Convo)
      .set({
        title: input.title,
        nativeLanguage: input.nativeLanguage,
        targetLanguage: input.targetLanguage
      })
      .where('id = :id and "userId" = :userId', {
        id, userId: req.session.userId!
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteConvo(
    @Arg('id') id: string,
    @Ctx() { req }: ResolverContext
  ): Promise<boolean> {

    // TODO might need to remove all associated convo entries
    await Convo.delete({ id, userId: req.session.userId! });
    return true;
  }
}