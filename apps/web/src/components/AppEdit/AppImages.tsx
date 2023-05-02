import Image from "next/image";
import { useState } from "react";
import { Button } from "ui";
import {
  UseFormResetField,
  UseFormWatch,
  UseFormRegister,
  UseFormGetValues,
  FieldValues,
} from "react-hook-form";
import { ThirdwebSDK, useStorageUpload } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
import { toast } from "sonner";
import { env } from "@/env/schema.mjs";

const AppImagesRow = ({
  children,
  label,
  description,
  isRequired,
}: {
  children: React.ReactNode;
  label: string;
  description?: string;
  isRequired?: boolean;
}) => {
  return (
    <div className="flex flex-row w-full">
      <div className="w-[40%] flex flex-col gap-y-1">
        <span className="text-sm font-medium">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </span>
        {description && <span className="text-sm">{description}</span>}
      </div>
      <div className="w-[60%] flex flex-col gap-y-4">{children}</div>
    </div>
  );
};

const UploadImage = ({
  id,
  register,
  getValues,
  resetField,
  watch,
}: {
  id: string;
  register: UseFormRegister<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-y-4 items-start gap-x-4 justify-between w-full">
      {watch(id) && getValues(id)?.length > 0 ? (
        <Image
          src={URL.createObjectURL(getValues(id)[0])}
          alt="App logo"
          width={100}
          height={100}
          className="rounded-lg hover:opacity-30 ease-in-out transition-all active:scale-90 cursor-pointer"
          onClick={() => resetField(id)}
        />
      ) : (
        // TODO
        <></>
      )}

      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, (MAX. 5mb)
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          {...register(id)}
        />
      </label>
    </div>
  );
};

export default function AppImages({
  metaData,
  isMetaLoading,
  register,
  getValues,
  resetField,
  watch,
  appName,
}: {
  metaData: any;
  isMetaLoading: any;
  register: UseFormRegister<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  appName: string;
}) {
  console.log("MetaData : ", metaData);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: upload } = useStorageUpload();
  const sdk = useSDK();

  const onSave = async () => {
    const updatingMetaData = async (
      resolve: (value: any) => void,
      reject: (value: any) => void
    ) => {
      if (!sdk) return;
      setIsSaving(true);
      const logo = getValues("dropzone-file-logo")
        ? getValues("dropzone-file-logo")[0]
        : undefined;
      const banner = getValues("dropzone-file-banner")
        ? getValues("dropzone-file-banner")[0]
        : undefined;
      let screenshots = [];
      for (let i = 1; i <= 5; i++) {
        const screenshot = getValues(`dropzone-file-screenshot${i}`)
          ? getValues(`dropzone-file-screenshot${i}`)[0]
          : undefined;
        if (screenshot) {
          screenshots.push(screenshot);
        }
      }
      if (!metaData.images) {
        metaData["images"] = {};
      }
      if (logo) {
        metaData["images"]["logo"] = await uploadFile(logo);
      }
      if (banner) {
        metaData["images"]["banner"] = await uploadFile(banner);
      }
      let screenshotsUrl: string[] = [];
      for (const screenshot of screenshots) {
        const url = await uploadFile(screenshot);
        screenshotsUrl.push(url);
      }
      ``;
      metaData["images"]["screenshots"] = screenshotsUrl;
      console.log(" updated metadata : ", metaData);
      try {
        await savingMetaDataOnChain(metaData, sdk);
        resolve("done");
      } catch (e: any) {
        console.log(e.message);
        reject(e.message);
      }
      setIsSaving(false);
    };
    toast.promise(
      new Promise((resolve, reject) => updatingMetaData(resolve, reject)),
      {
        success: `Successfully saved data`,
        error: (data) => {
          return `${data}`;
        },
        loading: `updating....`,
      }
    );
  };

  const uploadFile = async (file: File | any) => {
    const uploadUrl = await upload({
      data: [file],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: false },
    });
    return uploadUrl[0];
  };

  const savingMetaDataOnChain = async (metaData: any, sdk: ThirdwebSDK) => {
    const uri = await uploadFile(metaData);
    const appContract = await sdk.getContract(
      env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS
    );
    const tokenId = await appContract.call("tokenIdForAppName", [appName]);
    if (!tokenId) {
      throw new Error("Invalid app name");
    }
    await appContract.call("updateTokenURI", [tokenId, uri]);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
      <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
        <div className="flex flex-col gap-y-2">
          <h3 className="text-[#101828] text-2xl font-semibold">Images</h3>
          <p className="text-[#475467] text-sm">
            Upload Banners, Icon and Screenshots here
          </p>
        </div>
        <AppImagesRow label="Upload App Logo">
          <UploadImage
            id="dropzone-file-logo"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
        </AppImagesRow>

        <AppImagesRow label="Upload Banner">
          <UploadImage
            id="dropzone-file-banner"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
        </AppImagesRow>

        <AppImagesRow label="Upload upto 5 screenshots">
          <UploadImage
            id="dropzone-file-screenshot1"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
          <UploadImage
            id="dropzone-file-screenshot2"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
          <UploadImage
            id="dropzone-file-screenshot3"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
          <UploadImage
            id="dropzone-file-screenshot4"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
          <UploadImage
            id="dropzone-file-screenshot5"
            resetField={resetField}
            register={register}
            getValues={getValues}
            watch={watch}
          />
        </AppImagesRow>

        <div className="w-full flex flex-row justify-end gap-x-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={onSave} disabled={isSaving}>
            Save on Chain
          </Button>
        </div>
      </div>
    </div>
  );
}
