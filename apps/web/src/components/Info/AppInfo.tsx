import Divider from "../Divider";
import Image from "next/image";
import screenShotPlaceHolder from "@/public/MobileScreen.png";

export default function AppInfo({ metaData }: { metaData: any }) {
  console.log("metaData : ", metaData);
  const polygonChainContracts: string[] = [];
  const ethChainContracts: string[] = [];
  const zkevmChainContracts: string[] = [];
  if (metaData.contracts) {
    metaData.contracts.forEach(
      (contract: { chainId: string; address: string }) => {
        const addresses = contract.address
          .split(/[, ]+/)
          .map((address) => address.trim());
        if (contract.chainId === "137") {
          polygonChainContracts.push(...addresses);
        } else if (contract.chainId === "1") {
          ethChainContracts.push(...addresses);
        } else if (contract.chainId === "1101") {
          zkevmChainContracts.push(...addresses);
        }
      }
    );
  }
  return (
    <>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-[#101828] text-lg font-semibold">Description</h3>
        <p className="text-[#475467] text-sm">
          {metaData.description ??
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.`}
        </p>
      </div>

      <Divider />

      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-y-4 gap-x-5 w-full justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">URL</p>
          <a
            href={metaData.appUrl}
            className={`text-[#2678FD] font-semibold text-[16px] ${
              metaData && metaData.appUrl
                ? metaData.appUrl.length > 20
                  ? "truncate"
                  : ""
                : ""
            }`}
          >
            {metaData.appUrl ?? "appname.com"}
          </a>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Repo URL</p>
          <a
            href={metaData.repoUrl}
            className={`text-[#2678FD] font-semibold text-[16px] ${
              metaData && metaData.repoUrl
                ? metaData.repoUrl.length > 20
                  ? "truncate"
                  : ""
                : ""
            }`}
          >
            {metaData.repoUrl ?? "appname.com"}
          </a>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Dapp ID</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            {metaData.dappId ?? "App ID"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Language</p>
          <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
            {metaData.language ? (
              metaData.language.map((lang: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                >
                  {lang}
                </span>
              ))
            ) : (
              <>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  foo
                </span>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  bar
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-5 w-full justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Chain ID</p>
          <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
            {metaData.chains ? (
              metaData.chains.map((chain: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                >
                  {chain}
                </span>
              ))
            ) : (
              <>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  80001
                </span>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  137
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Minimum Age</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.minAge ?? 18}
          </p>
        </div>

        {/* <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Version</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.version ?? 2.34}
          </p>
        </div> */}

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">App Listed?</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.isListed ? "Yes" : "No"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">
            For mature audience?
          </p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.isForMatureAudience ? "Yes" : "No"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Moderated?</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.isSelfModerated ? "Yes" : "No"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Tags</p>
          <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
            {metaData.tags ? (
              metaData.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                >
                  {tag}
                </span>
              ))
            ) : (
              <>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  foo
                </span>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  bar
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">
            Available On Platform
          </p>
          <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
            {metaData.availableOnPlatform ? (
              metaData.availableOnPlatform.map(
                (platform: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                  >
                    {platform}
                  </span>
                )
              )
            ) : (
              <>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  foo
                </span>
                <span className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]">
                  bar
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {metaData.contracts ? (
        <>
          <div className="flex flex-col gap-y-2 w-full">
            <h3 className="text-[#101828] text-lg font-semibold">Contracts</h3>
            <Divider />
          </div>
          <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-y-4 gap-x-5 w-full justify-between items-center">
            {polygonChainContracts.length > 0 ? (
              <>
                <div className="flex flex-col gap-y-1">
                  <p className="text-[#667085] font-medium text-[16px]">
                    Polygon
                  </p>
                  <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
                    {polygonChainContracts.map(
                      (address: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                        >
                          {address}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {ethChainContracts.length > 0 ? (
              <>
                <div className="flex flex-col gap-y-1">
                  <p className="text-[#667085] font-medium text-[16px]">
                    Ethereum
                  </p>
                  <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
                    {ethChainContracts.map((address: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                      >
                        {address}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {zkevmChainContracts.length > 0 ? (
              <>
                <div className="flex flex-col gap-y-1">
                  <p className="text-[#667085] font-medium text-[16px]">
                    zkEVM
                  </p>
                  <div className="flex flex-row flex-wrap gap-x-1 gap-y-1">
                    {zkevmChainContracts.map((address: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[#363F72] rounded-lg bg-[#F8F9FC] py-[2px] px-2 font-medium text-[12px]"
                      >
                        {address}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="flex flex-col gap-y-2 w-full">
        <h3 className="text-[#101828] text-lg font-semibold">Build Inform</h3>
        <Divider />
      </div>

      {metaData.downloadBaseUrls ? (
        metaData.downloadBaseUrls.map((obj: any, idx: number) => {
          return (
            <div
              key={idx}
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-6 w-full justify-between items-center p-3 border bg-black bg-opacity-5 rounded"
            >
              <div className="flex flex-col gap-y-1">
                <p className="text-[#667085] font-medium text-[16px]">
                  App Type
                </p>
                <p className="text-[#2678FD] font-semibold text-[16px]">
                  {obj.platform ?? "Lorem Ipsum"}
                </p>
              </div>

              {obj.platform !== "web" ? (
                <>
                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Architecture
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">
                      {obj.architecture ?? "Lorem Ipsum"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Screen DPI
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">
                      {obj.screenDPI ?? "240 x 420"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Min Version
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">
                      {obj.minVersion ?? "10.2.1"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Max Version
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">
                      {obj.maxVersion ?? "12.1.1"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Version Code
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">
                      {obj.versionCode ?? "0.6.9"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      PackageId
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">
                      {obj.packageId ?? "com.example.appname"}
                    </p>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="flex flex-col gap-y-1">
                <p className="text-[#667085] font-medium text-[16px]">
                  Version
                </p>
                <p className="text-[#344054] font-semibold text-[16px]">
                  {obj.version ?? "0.6.9"}
                </p>
              </div>

              <div className="flex flex-col gap-y-1">
                <p className="text-[#667085] font-medium text-[16px]">
                  App File
                </p>
                <a
                  href={obj.url}
                  className="truncate text-[#2678FD] font-semibold text-16 hover:underline"
                >
                  {obj.url || "application.apk"}
                </a>
              </div>

              {/* {
                metaData.downloadBaseUrls.platform === 'web'
                ?
                <>
                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Optimized for mobile?
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">Yes</p>
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <p className="text-[#667085] font-medium text-[16px]">
                      Meroku Installable?
                    </p>
                    <p className="text-[#344054] font-semibold text-[16px]">Yes</p>
                  </div>
                </>
                :
                <></>
              } */}
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-y-4 gap-x-6 w-full justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">App Type</p>
            <p className="text-[#2678FD] font-semibold text-[16px]">Android</p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">
              Architecture
            </p>
            <p className="text-[#344054] font-semibold text-[16px]">
              Lorem Ipsum
            </p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">Screen DPI</p>
            <p className="text-[#344054] font-semibold text-[16px]">
              240 x 540
            </p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">
              Min Version
            </p>
            <p className="text-[#344054] font-semibold text-[16px]">0.6.9</p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">
              Max Version
            </p>
            <p className="text-[#344054] font-semibold text-[16px]">0.6.9</p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">Version</p>
            <p className="text-[#344054] font-semibold text-[16px]">0.6.9</p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">
              Version Code
            </p>
            <p className="text-[#344054] font-semibold text-[16px]">0.6.9</p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">PackageId</p>
            <p className="text-[#344054] font-semibold text-[16px]">
              com.example.appname
            </p>
          </div>

          <div className="flex flex-col gap-y-1">
            <p className="text-[#667085] font-medium text-[16px]">App File</p>
            <p className="text-[#2678FD] font-semibold text-[16px]">
              application.apk
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-2 w-full">
        <h3 className="text-[#101828] text-lg font-semibold">
          App Screenshots
        </h3>
        <Divider />
      </div>
      <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
        {metaData?.images?.screenshots?.length > 0 ? (
          metaData?.images?.screenshots.map(
            (screenshot: string, idx: number) => (
              <Image
                key={idx}
                src={screenshot}
                alt="App Screenshot"
                width={157}
                height={323}
                className="rounded-lg border-4 border-white"
              />
            )
          )
        ) : (
          <>
            <Image
              src={screenShotPlaceHolder}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
            <Image
              src={screenShotPlaceHolder}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
            <Image
              src={screenShotPlaceHolder}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
            <Image
              src={screenShotPlaceHolder}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
          </>
        )}
      </div>
    </>
  );
}
