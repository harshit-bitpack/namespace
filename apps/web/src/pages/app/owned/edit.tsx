import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { CheckCircleIcon } from "lucide-react";

import useOwnedDomains from "@/lib/hooks/useOwnedDomains";
import NavbarApp from "@/components/Navbar/App";
import Spacer from "@/components/Spacer";
import Spinner from "@/components/Spinner";
import AppEdit from "@/components/AppEdit";
import DevEdit from "@/components/DevEdit";
import { env } from "@/env/schema.mjs";

// TODO: refactor to reusable components
export default function EditInfo({
  alchemy_api_key_urls,
  biconomy_api_id_updateUri,
}: {
  alchemy_api_key_urls: {
    api_key_url_ethereum: string;
    api_key_url_polygon: string;
    api_key_url_zkevm: string;
  };
  biconomy_api_id_updateUri: string;
}) {
  const router = useRouter();
  const { address } = useAccount();
  const { isLoading, error, appNfts, devNfts } = useOwnedDomains();

  const appName = router.query.name as string;
  if (!appName) return;
  const ext = appName.split(".").pop();

  if (![...appNfts, ...devNfts].includes(appName) && !isLoading) {
    return <div>Not found.</div>;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center min-h-screen w-[100vw] bg-gray-50">
      <NavbarApp />
      <Spacer />

      <div className="flex flex-col items-center justify-start max-w-[95%] md:max-w-[80%] lg:max-w-[50%] text-left md:text-center gap-y-4 md:gap-y-10 w-full min-h-[90vh] py-4">
        <div className="flex flex-col items-start justify-center w-full gap-y-4">
          <h1 className="font-bold text-4xl md:text-6xl">
            {ext === "dev" ? "Dev Details" : "App Details"}
          </h1>
        </div>

        {!address && (
          <div className="flex flex-col justify-center items-center gap-y-2 w-full">
            <p className="text-[#909090] text-xs text-center">
              Connect your wallet to view your domains
            </p>
          </div>
        )}

        {address && [...devNfts, ...appNfts].length === 0 && isLoading && (
          <Spinner />
        )}

        {address && [...devNfts, ...appNfts].length === 0 && !isLoading && (
          <div className="flex flex-col justify-center items-center gap-y-2 w-full">
            <p className="text-[#909090] text-xs text-center">
              You don&apos;t have any domains yet
            </p>
          </div>
        )}

        {/* && !isLoading */}
        {address && !isLoading && (
          <div className="flex flex-col w-full gap-y-3 text-left">
            <div className="flex flex-row items-center justify-between w-full px-4 py-3 rounded-lg bg-white">
              <div className="flex flex-row gap-x-2 items-center justify-center">
                <CheckCircleIcon className="text-green-500" />
                <p>{appName}</p>
              </div>

              {/* Registered On */}
              <div className=""></div>

              {/* Expires On */}
              <div className=""></div>
            </div>

            {/* .app nfts */}
            {ext === "app" && (
              <AppEdit
                appName={appName}
                alchemy_api_key_urls={alchemy_api_key_urls}
                biconomy_api_id_updateUri={biconomy_api_id_updateUri}
              />
            )}

            {/* .dev nfts */}
            {ext === "dev" && <DevEdit devName={appName} />}
          </div>
        )}
      </div>

      <Spacer />
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      alchemy_api_key_urls: {
        api_key_url_ethereum: env.ALCHEMY_API_KEY_URL_ETHEREUM,
        api_key_url_polygon: env.ALCHEMY_API_KEY_URL_POLYGON,
        api_key_url_zkevm: env.ALCHEMY_API_KEY_URL_ZKEVM,
      },
      biconomy_api_id_updateUri: env.BICONOMY_API_ID_UPDATE_URI,
    },
  };
}
