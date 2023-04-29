import { useState } from "react";
import { toast } from "sonner";
import { Button } from "ui";
import { File, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
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

interface Screenshot {
  id: string;
  file: File;
  url: string;
}

interface AppImages {
  logo: string;
  banner: string;
  screenshots: string[];
}

interface UploadedFile {
  file: File;
  url: string;
}

export default function AppImages({
  appName,
  metadata,
  isMetaLoading,
}: {
  appName: string;
  metadata: any;
  isMetaLoading: boolean;
}) {
  const [appType, setAppType] = useState<"android" | "web" | "ios">("android");

  const [logo, setLogo] = useState<UploadedFile>();
  const [banner, setBanner] = useState<UploadedFile>();
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [newImagesMetaData, setNewImageMetaData] = useState<AppImages>();
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: upload } = useStorageUpload();
  const sdk = useSDK();

  const handleUpload = (file: File) => {
    const uploadFile = async (
      resolve: (value: any) => void,
      reject: (value: any) => void
    ) => {
      try {
        if (file.type.startsWith("image/")) {
          if (file.name.startsWith("logo")) {
            if (logo) {
              reject("Only 1 logo allowed");
              return;
            }
            const url = await uploadIPFS(file);
            setLogo({ file: file, url: url });
            resolve("done");
          } else if (file.name.startsWith("banner")) {
            if (banner) {
              reject("Only 1 banner allowed");
              return;
            }
            const url = await uploadIPFS(file);
            setBanner({ file: file, url: url });
            resolve("done");
          } else if (file.name.startsWith("screenshot")) {
            if (screenshots.length === 4) {
              reject("Only 4 screenshots allowed");
              return;
            }
            const url = await uploadIPFS(file);
            const newScreenShot = {
              id: uuidv4(),
              file: file,
              url: url,
            };
            setScreenshots([...screenshots, newScreenShot]);
            resolve("done");
          } else {
            reject("Invalid File");
          }
        }
      } catch (e: any) {
        return reject(e.message);
      }
    };
    toast.promise(
      new Promise((resolve, reject) => uploadFile(resolve, reject)),
      {
        success: `Successfully saved data`,
        error: (data) => {
          return `${data}`;
        },
        loading: `uploading....`,
      }
    );
  };

  const onSave = async () => {
    const updatingMetaData = async (
      resolve: (value: any) => void,
      reject: (value: any) => void
    ) => {
      if (!sdk) return;
      setIsSaving(true);
      if (!metadata.images) {
        metadata["images"] = {};
      }
      if (logo) {
        metadata["images"]["logo"] = logo.url;
      }
      if (banner) {
        metadata["images"]["banner"] = banner.url;
      }
      if (screenshots) {
        const urls = screenshots.map((x) => x.url);
        metadata["images"]["screenshots"] = urls;
      }
      const uri = await uploadIPFS(metadata);
      const appContract = await sdk.getContract(
        env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS
      );

      try {
        const tokenId = await appContract.call("tokenIdForAppName", [appName]);

        if (!tokenId) {
          throw new Error("Invalid app name");
        }

        await appContract.call("updateTokenURI", [tokenId, uri]);

        resolve("App updated successfully");
      } catch (e: any) {
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

  const uploadIPFS = async (file: File | any) => {
    const uploadUrl = await upload({
      data: [file],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: false },
    });
    return uploadUrl[0];
  };

  return (
    <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
      <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
        <div className="flex flex-col gap-y-2">
          <h3 className="text-[#101828] text-2xl font-semibold">Images</h3>
          <p className="text-[#475467] text-sm">
            Upload Banners, Icon and Screenshots here
            <br />
            <span>
              Note: Name of your file should starts with logo, banner and the
              screenshot{" "}
            </span>
          </p>
        </div>

        <AppImagesRow label="Image Files">
          {/* App logo  */}
          {/* <div className="flex flex-col gap-y-4 justify-between">
            <span className="text-sm font-medium">Upload App Logo</span> */}
          <div className="flex flex-col md:flex-row gap-y-4 items-start gap-x-4 justify-between w-full">
            {/* {logo ? (
                <Image
                  src={URL.createObjectURL(logo)}
                  alt="App logo"
                  width={150}
                  height={150}
                  className=" hover:opacity-30 ease-in-out transition-all active:scale-90 cursor-pointer"
                  onClick={() => {
                    setLogo(undefined);
                  }}
                />
              ) : (
                // TODO
                <></>
              )} */}

            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG (MAX. 512x512px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;
                  handleUpload(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {/* </div> */}
          {logo && (
            <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-x-2 w-[80%]">
                  <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                    <File className="w-4 h-4 text-[#2678FD]" />
                  </div>

                  <div className="flex flex-col gap-y-1 w-[70%]">
                    <p className="font-medium text-sm truncate">
                      {logo.file.name}
                    </p>
                    <p className="text-sm text-[#475467]">
                      {(logo.file.size / 1024 / 1024).toFixed(2)}
                      MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLogo(undefined);
                  }}
                  className="ease-in-out transition-all active:scale-90"
                >
                  <Trash className="h-4 w-4 text-[#667085]" />
                </button>
              </div>
            </div>
          )}
          {banner && (
            <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-x-2 w-[80%]">
                  <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                    <File className="w-4 h-4 text-[#2678FD]" />
                  </div>

                  <div className="flex flex-col gap-y-1 w-[70%]">
                    <p className="font-medium text-sm truncate">
                      {banner.file.name}
                    </p>
                    <p className="text-sm text-[#475467]">
                      {(banner.file.size / 1024 / 1024).toFixed(2)}
                      MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBanner(undefined);
                  }}
                  className="ease-in-out transition-all active:scale-90"
                >
                  <Trash className="h-4 w-4 text-[#667085]" />
                </button>
              </div>
            </div>
          )}
          {screenshots.map((screenshot, index) => {
            return (
              <div
                key={`${screenshot.id} + ${index}`}
                className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3"
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-x-2 w-[80%]">
                    <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                      <File className="w-4 h-4 text-[#2678FD]" />
                    </div>

                    <div className="flex flex-col gap-y-1 w-[70%]">
                      <p className="font-medium text-sm truncate">
                        {screenshot.file.name}
                      </p>
                      <p className="text-sm text-[#475467]">
                        {(screenshot.file.size / 1024 / 1024).toFixed(2)}
                        MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setScreenshots(
                        screenshots.filter((s) => s.id !== screenshot.id)
                      );
                    }}
                    className="ease-in-out transition-all active:scale-90"
                  >
                    <Trash className="h-4 w-4 text-[#667085]" />
                  </button>
                </div>
              </div>
            );
          })}
        </AppImagesRow>

        <div className="w-full flex flex-row justify-end gap-x-4">
          {/* <Button variant="outline">Cancel</Button> */}
          <Button onClick={onSave} disabled={isSaving}>
            Update App Details
          </Button>
        </div>
      </div>
    </div>
  );
}
