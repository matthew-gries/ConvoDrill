import { Center, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isMobileOrTabletUserAgent } from "../utils/isMobileOrTabletUserAgent";


const Index = () => {

  const [{data, fetching}] = useMeQuery();
  const router = useRouter();

  useEffect(() => {

    if (isMobileOrTabletUserAgent()) {
      router.push("/download");
    }

    if (!fetching) {
      if (!data?.me) {
        router.replace("/login");
      } else {
        router.replace(`/user/${data.me.username}`);
      }
    }
  }, [fetching, data, router]);


  return (
    <Center>
      <Spinner size="xl"/>
    </Center>
  )
};

export default withUrqlClient(createUrqlClient, {ssr: false})(Index);
