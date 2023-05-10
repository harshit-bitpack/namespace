import { useEffect, useState } from "react";
import { useSDK } from "@thirdweb-dev/react";
import { useAccount } from "wagmi";
import { env } from "@/env/schema.mjs";
import appABI from "../../config/appABI.json";
import devABI from "../../config/devABI.json";

export default function useOwnedDomains() {
  const { address } = useAccount();
  const sdk = useSDK();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [appNfts, setAppNfts] = useState<string[]>([]);
  const [devNfts, setDevNfts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!sdk || !address) return;
      setLoading(true);

      try {
        const appContract = await sdk.getContract(
          process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS as string,
          appABI
        );
        const devContract = await sdk.getContract(
          process.env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS as string,
          devABI
        );

        const appBalance = await appContract.call("balanceOf", [address]);
        const devBalance = await devContract.call("balanceOf", [address]);

        const appIds = (
          await Promise.all(
            Array.from(Array(Number(appBalance)).keys()).map((i) =>
              appContract.call("tokenOfOwnerByIndex", [address, i])
            )
          )
        ).map((i) => Number(i));
        const devIds = (
          await Promise.all(
            Array.from(Array(Number(devBalance)).keys()).map((i) =>
              devContract.call("tokenOfOwnerByIndex", [address, i])
            )
          )
        ).map((i) => Number(i));

        const appNames = await Promise.all(
          appIds.map((i) => appContract.call("tokensName", [i]))
        );
        const devNames = await Promise.all(
          devIds.map((i) => devContract.call("tokensName", [i]))
        );

        setAppNfts(appNames);
        setDevNfts(devNames);
      } catch (e) {
        setError(`${e}`);
      }

      setLoading(false);
    };
    fetchData();

    return () => {};
  }, [sdk, address]);

  return {
    appNfts,
    devNfts,
    isLoading: loading,
    error,
  };
}
