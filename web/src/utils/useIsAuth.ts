import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = (useNext: boolean) => {
  const [{data, fetching}] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace(`/login${ useNext? '?next=' + router.pathname : ''}`);
    }
  }, [fetching, data, router, useNext]);
}