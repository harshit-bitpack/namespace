import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "ui";

import Spacer from "@/components/Spacer";
import AppInfo from "./AppInfo";
import DevInfo from "./DevInfo";
import useFetchMetadata from "@/lib/hooks/useFetchMetadata";
import Spinner from "../Spinner";
import editDocument from "@/public/editicon.svg";
import logoPlaceholder from "@/public/iconplaceholder.png";
// import bannerPlaceholder from "@/public/Banner.png";

export default function Info({ name }: { name: string }) {
  const ext = name.split(".").pop();
  const { metadata, isMetaLoading, expire, tokenLife } = useFetchMetadata(name);
  return (
    <>
      {isMetaLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="flex flex-col xl:flex-row items-center justify-between w-full px-4 py-3 rounded-lg bg-white">
        <div className="flex flex-row gap-x-2 items-center justify-center">
          <CheckCircleIcon className="text-green-500" />
          <p>{name}</p>
        </div>
        {expire && tokenLife ? (
          <>
            <div className="text-[#667085] font-medium text-[15px]">
              <span className="mr-1">Registered on</span>
              <span>
                {new Date(
                  (expire.toNumber() - tokenLife.toNumber()) * 1000
                ).toDateString()}
              </span>
              <span></span>
            </div>
            <div className="text-[#667085] font-medium text-[15px]">
              <span className="mr-1">Expire on</span>
              <span>{new Date(expire.toNumber() * 1000).toDateString()}</span>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {!isMetaLoading && (
        <div className="flex flex-col w-full gap-y-3 text-left">
          {Object.keys(metadata).length <= 0 && (
            <div className="flex flex-col items-center justify-center w-full gap-y-3 p-10 rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden prose">
              <div>
                <Image
                  src={editDocument}
                  alt="Edit Document image"
                  height={190}
                  width={190}
                />
              </div>
              <div>
                <h3 className="text-[#101828] font-semibold text-2xl text-center">
                  Start by editing your app details
                </h3>
              </div>
              <div>
                <p className="text-[#475467] text-sm leading-5 text-center">
                  To get started, click on the edit button to start editing and
                  updating the information of your .app NFT
                </p>
              </div>
              <div>
                <Link href={`/app/owned/edit?name=${name}`}>
                  <Button className="">Edit Details</Button>
                </Link>
              </div>
            </div>
          )}

          {Object.keys(metadata).length > 0 && (
            <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
              <div className="bg-[#101828] h-60 w-full" />
              <div className="flex flex-row items-center w-full px-4 md:px-8 gap-x-4">
                <Image
                  src={metadata.images.logo ?? logoPlaceholder}
                  alt={ext === "dev" ? "Dev image" : "App image"}
                  width={160}
                  height={160}
                  className="rounded-lg border-4 border-white -mt-16"
                />

                <div className="flex flex-col gap-y-1">
                  <h3 className="text-[#101828] font-semibold text-2xl md:text-3xl">
                    {ext === "dev"
                      ? metadata.name
                        ? metadata.name
                        : "Publisher Name"
                      : metadata.name
                      ? metadata.name
                      : "App Name"}
                  </h3>
                  {ext === "app" && (
                    <h4 className="text-[#475467] font-normal text-[14px] md:text-[16px]">
                      {metadata.category ? metadata.category : "App category"}
                    </h4>
                  )}
                </div>

                <Spacer direction="horizontal" />

                <Link
                  href={`/app/owned/edit?name=${name}`}
                  className="disabled md:block"
                >
                  <Button className="bg-green-500 hover:bg-green-600 hidden md:block">
                    Edit
                  </Button>
                </Link>
              </div>

              <Link href={`/app/owned/edit?name=${name}`} className="md:hidden">
                <Button className="bg-green-500 hover:bg-green-600 self-start mt-4 mx-4 min-w-[50%] md:hidden">
                  Edit Details
                </Button>
              </Link>

              <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
                {ext === "app" ? (
                  <AppInfo metaData={metadata} />
                ) : (
                  <DevInfo metaData={metadata} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
