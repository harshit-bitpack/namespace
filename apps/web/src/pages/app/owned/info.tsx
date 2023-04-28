import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useOwnedDomains from "@/lib/hooks/useOwnedDomains";
import NavbarApp from "@/components/Navbar/App";
import Spacer from "@/components/Spacer";
import Spinner from "@/components/Spinner";
import Info from "@/components/Info";

// TODO: refactor to reusable components
export default function OwnedInfo() {
  const router = useRouter();
  const { address } = useAccount();
  const { isLoading, error, appNfts, devNfts } = useOwnedDomains();

  const name = router.query.name as string;
  if (!name) return;
  const ext = name.split(".").pop();

  if (![...appNfts, ...devNfts].includes(name) && !isLoading) {
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
              Connect your wallet to view Details
            </p>
          </div>
        )}

        {address && [...devNfts, ...appNfts].length === 0 && isLoading && (
          <Spinner />
        )}

        {address && [...devNfts, ...appNfts].length === 0 && !isLoading && (
          <div className="flex flex-col justify-center items-center gap-y-2 w-full">
            <p className="text-[#909090] text-xs text-center">
              You don&isLoadingapos;t have any domains yet
            </p>
          </div>
        )}

        {address && !isLoading && <Info name={name} />}
      </div>

      <Spacer />
    </div>
  );
}
