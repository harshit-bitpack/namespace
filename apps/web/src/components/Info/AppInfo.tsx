import Divider from "../Divider";
import Image from "next/image";

export default function AppInfo({ metaData }: { metaData: any }) {
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

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-y-4 w-full justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">URL</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            {metaData.appUrl ?? "appname.com"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Repo URL</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            {metaData.repoUrl ?? "appname.com"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Dapp ID</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            {metaData.dappId ?? "App ID"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Language</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.language ?? "English"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Chain ID</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.chainId ?? 8001}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Minimum Age</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.minimumAge ?? 18}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Version</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.version ?? 2.34}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">App Listed?</p>
          <p className="text-[#344054] font-semibold text-[16px]">Yes</p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">
            For mature audience?
          </p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.isForMatureAudience ?? "Yes"}
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Moderated?</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            {metaData.isSelfModerated ?? "Yes"}
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
      </div>

      <div className="flex flex-col gap-y-2 w-full">
        <h3 className="text-[#101828] text-lg font-semibold">Build Inform</h3>
        <Divider />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-y-4 w-full justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">App Type</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">Android</p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Architecture</p>
          <p className="text-[#344054] font-semibold text-[16px]">
            Lorem Ipsum
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Resolution</p>
          <p className="text-[#344054] font-semibold text-[16px]">240 x 540</p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Min Version</p>
          <p className="text-[#344054] font-semibold text-[16px]">0.6.9</p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Max Version</p>
          <p className="text-[#344054] font-semibold text-[16px]">Yes</p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">App File</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            application.apk
          </p>
        </div>

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
      </div>

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
              src={"https://picsum.photos/157/323"}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
            <Image
              src={"https://picsum.photos/157/323"}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
            <Image
              src={"https://picsum.photos/157/323"}
              alt="App Screenshot"
              width={157}
              height={323}
              className="rounded-lg border-4 border-white"
            />
            <Image
              src={"https://picsum.photos/157/323"}
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
