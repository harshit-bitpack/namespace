import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui";
import AppDetails from "./AppDetails";
import AppBuild from "./AppBuild";
import AppImages from "./AppImages";
import useFetchMetadata from "@/lib/hooks/useFetchMetadata";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { screenShot } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";

export default function AppEdit({
  appName,
  alchemy_api_key_urls,
  biconomy_api_id_updateUri,
}: {
  appName: string;
  alchemy_api_key_urls: {
    api_key_url_ethereum: string;
    api_key_url_polygon: string;
    api_key_url_zkevm: string;
  };
  biconomy_api_id_updateUri: string;
}) {
  const { metadata, isMetaLoading, expire, tokenLife } =
    useFetchMetadata(appName);
  const { register, handleSubmit, getValues, resetField, watch, setValue } =
    useForm();
  const [screenShots, setScreenShots] = useState<screenShot[]>([]);
  return (
    <>
      <div className="flex flex-col xl:flex-row items-center justify-between w-full px-4 py-3 rounded-lg bg-white">
        <div className="flex flex-row gap-x-2 items-center justify-center">
          <CheckCircleIcon className="text-green-500" />
          <p>{appName}</p>
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
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">App Details</TabsTrigger>
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="images">App Images</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AppDetails
            appName={appName}
            metadata={metadata}
            isMetaLoading={isMetaLoading}
            alchemy_api_key_urls={alchemy_api_key_urls}
          />
        </TabsContent>

        <TabsContent value="build">
          <AppBuild
            appName={appName}
            metadata={metadata}
            isMetaLoading={isMetaLoading}
          />
        </TabsContent>

        <TabsContent value="images">
          <AppImages
            appName={appName}
            metaData={metadata}
            isMetaLoading={isMetaLoading}
            getValues={getValues}
            register={register}
            resetField={resetField}
            watch={watch}
            setValue={setValue}
            screenShots={screenShots}
            setScreenShots={setScreenShots}
            biconomy_api_id_updateUri={biconomy_api_id_updateUri}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
