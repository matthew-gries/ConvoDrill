import { cacheExchange } from '@urql/exchange-graphcache'
import { simplePagination } from '@urql/exchange-graphcache/extras'
import { dedupExchange, Exchange, fetchExchange } from 'urql'
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from "wonka";
import Router from "next/router";

const errorExchange: Exchange = ({forward}) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({error}) => {
      if (error) {
        if (error?.message.includes("Not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  )
}

const cache = cacheExchange({
  keys: {
    PaginatedConvos: () => null,
  },
  resolvers: {
    Query: {
      // TODO fix pagination
      // convos: simplePagination()
    }
  },
  updates: {
    Mutation: {
      logout: (_result, args, cache, info) => {
        betterUpdateQuery<LogoutMutation, MeQuery>(cache, {query: MeDocument}, _result, () => {
          return {
            me: null
          }
        })
      },
      login: (_result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
          if (result.login.errors) {
            return query;
          } else {
            return {
              me: result.login.user
            }
          }
        })
      },
      register: (_result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
          if (result.register.errors) {
            return query;
          } else {
            return {
              me: result.register.user
            }
          }
        })
      }
    }
  }
});

console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
export const createUrqlClient = (ssrExchange: any) => ({
  url: process.env.NEXT_PUBLIC_API_URL as string,
  fetchOptions: {
    credentials: "include" as const
  },
  exchanges: [dedupExchange, cache, errorExchange, ssrExchange, fetchExchange]
});