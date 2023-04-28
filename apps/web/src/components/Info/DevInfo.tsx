import Divider from "../Divider";

export default function DevInfo({ metaData }: { metaData: any }) {
  return (
    <>
      <div className="flex flex-col gap-y-2 w-full">
        <h3 className="text-[#101828] text-lg font-semibold">Details</h3>
        <Divider />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 w-full justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Website</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            appname.com
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">
            Privacy Policy URL
          </p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            appname.com
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">GithubID</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">exampleId</p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Support Url</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            support.com
          </p>
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="text-[#667085] font-medium text-[16px]">Email</p>
          <p className="text-[#2678FD] font-semibold text-[16px]">
            demoEmail53@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}
