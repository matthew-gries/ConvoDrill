import { User } from "../entities/User";
import { ResolverContext } from "../types";
import { Resolver, Field, Arg, Ctx, Mutation, ObjectType, Query, FieldResolver, Root, UseMiddleware } from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { UserFieldInput } from "./UserFieldInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { typeormDataSource } from "../typeormDatasource";
import { FieldError } from "./FieldError";
import { Convo } from "../entities/Convo";
import { isAuth } from "../middleware/isAuth";


@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];
  @Field(() => User, {nullable: true})
  user?: User
}

@Resolver(User)
export class UserResolver {

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: ResolverContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id.toString()) {
    return user.email;
    }
  
    // current user wants to see someone elses email
    return "";
  }

  @FieldResolver(() => [Convo], {nullable: true})
  @UseMiddleware(isAuth)
  async convos(
    @Root() root: User
  ): Promise<Convo[] | null> {
    return Convo.findBy({
      userId: root.id
    });
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: ResolverContext
  ): Promise<UserResponse> {

    if (newPassword.length <= 2){
      return { errors: [
        {
          field: "newPassword",
          message: "Password length must be greater than 2"
        }]
      };
    }

    const key = `${FORGOT_PASSWORD_PREFIX}${token}`;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired"
          }
        ]
      }
    }

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists"
          }
        ]
      }
    }

    await User.update({id: userId}, {
      password: await argon2.hash(newPassword)
    });

    await redis.del(key);

    // log in after changing password
    req.session.userId = user.id;
    req.headers['x-forwarded-proto'] = 'https';

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: ResolverContext
  ): Promise<boolean> {

    const user =await User.findOneBy({ email });
    if (!user) {
      // email not in DB
      return true;
    }

    const token = v4();

    // expire after 3 days
    await redis.set(`${FORGOT_PASSWORD_PREFIX}${token}`, user.id, 'EX', 1000 * 60 * 60 * 24 * 3);

    await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);

    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserFieldInput,
    @Ctx() { req }: ResolverContext
  ): Promise<UserResponse> {

    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    let user;
    try {
      const result = await typeormDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
          convos: []
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (err) {
      console.error(err);
      if (err.code === "23505") {
        // duplicate username error TODO what if there is a duplicate email
        return {
          errors: [{
            field: "username",
            message: "Duplicate username"
          }]
        };
      } else {
        return {
          errors: [{
            field: "username",
            message: "Unknown error"
          }]
        };
      }

    }

    req.session!.userId = user.id.toString();
    req.headers['x-forwarded-proto'] = 'https';

    return {
      user: user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: ResolverContext
  ): Promise<UserResponse> {
    const user = await User.findOneBy(
      usernameOrEmail.includes('@') 
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
    );

    if (!user) {
      return {
        errors: [{
          field: "usernameOrEmail",
          message: "Username or email does not exist"
        }]
      }
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [{
          field: "password",
          message: "Password is incorrect"
        }]
      }
    }

    req.session!.userId = user.id.toString();
    req.headers['x-forwarded-proto'] = 'https';

    return {
      user: user
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: ResolverContext) {
    return new Promise(resolve => req.session.destroy(err => {

      res.clearCookie(COOKIE_NAME);

      if (err) {
        console.error(err);
        resolve(false)
        return;
      }

      resolve(true);
    }));
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: ResolverContext) {
    
    // you are not logged in
    if (!req.session.userId) {
      return null;
    } else {
      // TODO change ID to a string, this will cause problems
      const id = req.session.userId;
      return User.findOneBy({ id });
    }
  }
}