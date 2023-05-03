import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui";
import AppDetails from "./AppDetails";
import AppBuild from "./AppBuild";
import AppImages from "./AppImages";
import useFetchMetadata from "@/lib/hooks/useFetchMetadata";
import { useForm } from "react-hook-form";

export default function AppEdit({ appName }: { appName: string }) {
  const { metadata, isMetaLoading } = useFetchMetadata(appName);
  const { register, handleSubmit, getValues, resetField, watch } = useForm();
  return (
    <>
      {/* {isMetaLoading && (
        <Spinner />
      )} */}
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
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
