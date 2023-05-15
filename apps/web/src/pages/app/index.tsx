import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSDK } from "@thirdweb-dev/react";
import { useAccount } from "wagmi";
import { CheckCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Input, Button } from "ui";

import { env } from "@/env/schema.mjs";
import NavbarApp from "@/components/Navbar/App";
import Spacer from "@/components/Spacer";
import GlobalSearchIcon from "@/public/global-search.svg";
import Spinner from "@/components/Spinner";
import appABI from "../../config/appABI.json";
import devABI from "../../config/devABI.json";

export default function App({
  biconomy_api_key,
  biconomy_api_id_safeMint,
}: {
  biconomy_api_key: string;
  biconomy_api_id_safeMint: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(router.query.q?.toString() ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [available, setAvailable] = useState<{
    [key: string]: boolean;
  }>();

  const { address } = useAccount();
  const sdk = useSDK();

  const searchNFTs = async () => {
    setLoading(true);
    setAvailable(undefined);
    if (!search || !sdk) return;

    const appContract = await sdk.getContract(
      process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS as string,
      appABI
    );
    const devContract = await sdk.getContract(
      process.env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS as string,
      devABI
    );

    const _available = {} as {
      [key: string]: boolean;
    };

    try {
      const data1 = await appContract.call("tokenIdForName", [
        search.replaceAll(".app", "") + ".app",
      ]);
      _available[`${search.replaceAll(".app", "")}.app`] = false;
    } catch (e) {
      const err = `${e}`;
      if (!err.includes("invalid token ID")) {
        console.error(e);
      }
      _available[`${search.replaceAll(".app", "")}.app`] = true;
    }

    // try {
    //   const data2 = await devContract.call("tokenIdForName", [
    //     search.replaceAll(".dev", "") + ".dev",
    //   ]);
    //   _available[`${search.replaceAll(".dev", "")}.dev`] = false;
    // } catch (e) {
    //   const err = `${e}`;
    //   if (!err.includes("invalid token ID")) {
    //     console.error(e);
    //   }
    //   _available[`${search.replaceAll(".dev", "")}.dev`] = true;
    // }

    setAvailable(_available);
    setLoading(false);
  };

  // const isDevAlreadyMinted = async (sdk: ThirdwebSDK): Promise<boolean> => {
  //   const devContract = await sdk.getContract(
  //     env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS,
  //     devABI
  //   );
  //   const devBalance = await devContract.call("balanceOf", [address]);
  //   return devBalance !== 0;
  // };

  const claimNFT = async (name: string) => {
    const sendTx = async (
      resolve: (value: any) => void,
      reject: (reason: any) => void
    ) => {
      try {
        if (!sdk) return reject("no sdk");

        const nftType = name.split(".").pop();

        if (nftType === "app") {
          // if (await !isDevAlreadyMinted(sdk)) {
          //   throw Error(
          //     "You don't have any Dev domain. Kindly first claim a Dev domain."
          //   );
          // }

          const appContract = await sdk.getContract(
            process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS as string,
            appABI
          );
          // const data = await appContract.call(
          //     "safeMintAppNFT",
          //     address,
          //     name,
          //     name
          // );
          // console.log(data);
          console.log("address : ", address);
          console.log("name : ", name);
          try {
            const tx = appContract.prepare("safeMintAppNFT", [address, name]);
            tx.setGaslessOptions({
              biconomy: {
                apiId: biconomy_api_id_safeMint,
                apiKey: biconomy_api_key,
                deadlineSeconds: 100,
              },
            });
            const data = await tx.send();
            console.log(data);
          } catch (e: any) {
            console.log(e);
            reject(e.message);
          }
        } else if (nftType === "dev") {
          // if (await isDevAlreadyMinted(sdk)) {
          //   throw Error("You already claimed a Dev Domain");
          // }
          const devContract = await sdk.getContract(
            process.env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS as string,
            devABI
          );

          // const data = await devContract.call(
          //     "safeMintDevNFT",
          //     address,
          //     name,
          //     name
          // );
          // console.log(data);

          const tx = devContract.prepare("safeMintDevNFT", [
            address,
            name,
            name,
          ]);
          tx.setGaslessOptions({
            biconomy: {
              apiId: "ba9c821d-3c81-4ef1-8a4c-f8b8f8727552",
              apiKey: env.BICONOMY_API_KEY,
              deadlineSeconds: 60,
            },
          });
          const data = await tx.send();
          console.log(data);
        }

        setAvailable((prev) => ({
          ...prev,
          [name]: false,
        }));
        return resolve("done");
      } catch (e: any) {
        if (e.message.includes("user rejected signing")) {
          return reject("User rejected signing");
        }
        return reject(e.message);
      }
    };

    toast.promise(new Promise((resolve, reject) => sendTx(resolve, reject)), {
      success: `Successfully claimed domain ${name}`,
      error: (data) => {
        return `${data}`;
      },
      loading: `Claiming domain ${name}...`,
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center min-h-screen w-[100vw] bg-gray-50">
      <NavbarApp />
      <Spacer />

      <div className="flex flex-col items-center justify-start max-w-[95%] md:max-w-[80%] lg:max-w-[50%] text-left md:text-center gap-y-4 md:gap-y-10 w-full min-h-[90vh] py-4">
        <div className="flex flex-col md:flex-row gap-x-3 gap-y-3 w-full md:w-[70%]rounded-lg">
          <Input
            placeholder={"Search for new domain"}
            className=""
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/ /g, ""))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                const button = document.getElementById("search-btn");
                if (button) {
                  button.click();
                }
              }
            }}
            ref={inputRef}
          />
          <Button id="search-btn" onClick={searchNFTs}>
            Search
          </Button>
        </div>

        {!available && !loading && (
          <div className="flex flex-col justify-center items-center gap-y-2 w-full">
            <Image
              src={GlobalSearchIcon}
              alt="Global Search"
              width={120}
              height={120}
            />
            <p className="text-[#909090] text-xs text-center">
              Input using the search bar. You can search for names using
              keywords, phrases, or specific terms.
            </p>
          </div>
        )}

        {loading && <Spinner />}

        {available && (
          <div className="flex flex-col w-full gap-y-3 text-left">
            <h3 className="font-medium">Search result for “{search}”</h3>

            {Object.keys(available ?? {}).map((name) => (
              <div
                key={name}
                className="flex flex-row items-center justify-between w-full px-4 py-3 rounded-lg bg-white"
              >
                <div className="flex flex-row gap-x-2 items-center justify-center">
                  <CheckCircleIcon className="text-green-500" />
                  <p>{name}</p>
                </div>

                <p className="text-opacity-30">
                  {available[name] ? "available" : "unavailable"}
                </p>

                <Button
                  className="bg-green-500 hover:bg-green-600"
                  disabled={!available[name] || !address}
                  onClick={async () => await claimNFT(name)}
                >
                  Claim
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Spacer />
    </div>
  );
}

export async function getServerSideProps() {
  // Access environment variables
  const biconomy_api_key = env.BICONOMY_API_KEY;
  const biconomy_api_id_safeMint = env.BICONOMY_API_ID_SAFE_MINT;
  // Pass environment variables as props
  return {
    props: {
      biconomy_api_key,
      biconomy_api_id_safeMint,
    },
  };
}
