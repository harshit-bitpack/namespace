import { useEffect, useState } from "react";
import { useSDK, useStorage } from "@thirdweb-dev/react";
import { useAccount } from "wagmi";

import { env } from "@/env/schema.mjs";

export default function useFetchMetadata(name: string) {
  const { address } = useAccount();
  const sdk = useSDK();
  const storage = useStorage();
  const ext = name.split(".").pop();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [metadata, setMetadata] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!sdk || !address || !storage) return;
      setLoading(true);
      try {
        if (ext === "app") {
          const appContract = await sdk.getContract(
            env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS
          );

          const tokenId = await appContract.call("tokenIdForAppName", name);

          if (!tokenId) {
            throw new Error("Invalid app name");
          }

          const tokenUri = await appContract.call("tokenURI", tokenId);

          if (!tokenUri) return;

          const stored = await storage.downloadJSON(tokenUri);
          setMetadata(stored ?? {});
        }

        const devContract = await sdk.getContract(
          env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS
        );
        const tokenId = await devContract.call("tokenIdForDevName", name);
        if (!tokenId) {
          throw new Error("Invalid dev name");
        }
        const tokenUri = await devContract.call("tokenURI", tokenId);
        if (!tokenUri) return;

        const stored = await storage.downloadJSON(tokenUri);
        setMetadata(stored ?? {});
      } catch (e) {
        setError(`${e}`);
      }

      setLoading(false);
    };
    fetchData();

    return () => {};
  }, [sdk, address, name, storage, ext]);

  return {
    metadata,
    isMetaLoading: loading,
    error,
  };
}
