import { ResolverContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ResolverContext> = ({context}, next) => {

  if (!context.req.session.userId) {
    throw new Error("Not authenticated");
  }

  return next();
}