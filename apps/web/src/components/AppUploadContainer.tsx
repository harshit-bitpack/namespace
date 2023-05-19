import { Trash, File } from "lucide-react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "ui";

type AndroidState = {
  minVersion: string | undefined;
  architecture: string | undefined;
  screenDPI: string | undefined;
  apk: File | undefined;
  url?: string | undefined;
  id: string;
  packageId: string | undefined;
  versionCode: string | undefined;
  version: string | undefined;
};

type IosState = {
  minVersion: string | undefined;
  architecture: string | undefined;
  screenDPI: string | undefined;
  ipa: File | undefined;
  url?: string | undefined;
  id: string;
  packageId: string | undefined;
  versionCode: string | undefined;
  version: string | undefined;
};

const AppUploadContainer = ({
  platformState,
  handlePlatformStateChange,
  app,
  handleDeleteFile,
}: {
  platformState: any;
  handlePlatformStateChange: (
    app: "android" | "ios",
    id: string,
    newState: AndroidState | IosState
  ) => void;
  app: string;
  handleDeleteFile: (app: "android" | "ios", id: string) => void;
}) => {
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={`dropzone-file-${platformState.id}`}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {app === "android" ? "APK" : "IPA"}
            </p>
          </div>
          <input
            id={`dropzone-file-${platformState.id}`}
            type="file"
            accept={app === "android" ? ".apk" : ".ipa"}
            className="hidden"
            onChange={(e) => {
              if (!e.target.files || !e.target.files[0]) return;
              if (app === "android") {
                const newState = {
                  ...platformState,
                  apk: e.target.files[0],
                };
                handlePlatformStateChange(
                  app as "android" | "ios",
                  platformState.id,
                  newState
                );
                e.target.value = "";
              } else if (app === "ios") {
                const newState = {
                  ...platformState,
                  ipa: e.target.files[0],
                };
                handlePlatformStateChange(
                  app as "android" | "ios",
                  platformState.id,
                  newState
                );
                e.target.value = "";
              }
            }}
          />
        </label>
      </div>
      {app == "android" && (platformState?.apk || platformState?.url) && (
        <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-x-2 w-[80%]">
              <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                <File className="w-4 h-4 text-[#2678FD]" />
              </div>

              <div className="flex flex-col gap-y-1 w-[70%]">
                <p className="font-medium text-sm truncate">
                  {platformState?.apk?.name ?? "uploaded apk file"}
                </p>
                <p className="text-sm text-[#475467]">
                  {platformState?.apk &&
                    `${(platformState.apk.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const newState = {
                  ...platformState,
                  apk: undefined,
                  url: "",
                };
                handlePlatformStateChange(
                  app as "android" | "ios",
                  platformState.id,
                  newState
                );
              }}
              className="ease-in-out transition-all active:scale-90"
            >
              <Trash className="h-4 w-4 text-[#667085]" />
            </button>
          </div>
        </div>
      )}
      {app == "ios" && (platformState?.ipa || platformState?.url) && (
        <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-x-2 w-[80%]">
              <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                <File className="w-4 h-4 text-[#2678FD]" />
              </div>

              <div className="flex flex-col gap-y-1 w-[70%]">
                <p className="font-medium text-sm truncate">
                  {platformState?.ipa?.name ?? "uploaded ipa file"}
                </p>
                <p className="text-sm text-[#475467]">
                  {platformState?.ipa &&
                    `${(platformState.ipa.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const newState = {
                  ...platformState,
                  ipa: undefined,
                  url: "",
                };
                handlePlatformStateChange(
                  app as "android" | "ios",
                  platformState.id,
                  newState
                );
              }}
              className="ease-in-out transition-all active:scale-90"
            >
              <Trash className="h-4 w-4 text-[#667085]" />
            </button>
          </div>
        </div>
      )}

      <br />

      <div className="flex flex-row gap-x-2 w-full">
        <div className="flex flex-col gap-y-2 w-[50%]">
          <Label>Architecture</Label>
          <Select
            value={platformState.architecture}
            onValueChange={(v) => {
              const newState = {
                ...platformState,
                architecture: v as any,
              };
              handlePlatformStateChange(
                app as "android" | "ios",
                platformState.id,
                newState
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select architecture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-y-2 w-[50%]">
          <Label>Screen DPI</Label>
          <Select
            value={platformState.screenDPI}
            onValueChange={(v) => {
              const newState = {
                ...platformState,
                screenDPI: v as any,
              };
              handlePlatformStateChange(
                app as "android" | "ios",
                platformState.id,
                newState
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select screen DPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-x-2 w-full">
        <div className="flex flex-col gap-y-2 w-[50%]">
          <Label>
            {`Minimum Version`}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="10.0.0"
            required
            value={platformState.minVersion}
            onChange={(e) => {
              const newState = {
                ...platformState,
                minVersion: e.target.value,
              };
              handlePlatformStateChange(
                app as "android" | "ios",
                platformState.id,
                newState
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-y-2 w-[50%]">
          <Label>
            {`Version`}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="10.0.0"
            required
            value={platformState.version}
            onChange={(e) => {
              const newState = {
                ...platformState,
                version: e.target.value,
              };
              handlePlatformStateChange(
                app as "android" | "ios",
                platformState.id,
                newState
              );
            }}
          />
        </div>
      </div>
      <div className="flex flex-row gap-x-2 w-full">
        <div className="flex flex-col gap-y-2 w-[50%]">
          <Label>
            {`Package ID`}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            //placeholder="10.0.0"
            required
            value={platformState.packageId}
            onChange={(e) => {
              const newState = {
                ...platformState,
                packageId: e.target.value,
              };
              handlePlatformStateChange(
                app as "android" | "ios",
                platformState.id,
                newState
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-y-2 w-[50%]">
          <Label>
            {`Version Code`}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            //placeholder="10.0.0"
            required
            value={platformState.versionCode}
            onChange={(e) => {
              const newState = {
                ...platformState,
                versionCode: e.target.value,
              };
              handlePlatformStateChange(
                app as "android" | "ios",
                platformState.id,
                newState
              );
            }}
          />
        </div>
      </div>
      <div className="w-full flex flex-row justify-end gap-x-4 mb-4">
        <Button
          onClick={() =>
            handleDeleteFile(app as "android" | "ios", platformState.id)
          }
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default AppUploadContainer;

{
  /* {isWeb && (
            <AppBuildRow label="Web App">
              <div className="flex flex-col gap-y-2">
                <Label>
                  URL
                  <span className="text-red-500">*</span>
                </Label>
                <Input placeholder="https://bitpack.me" />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label>Optimized for mobile?</Label>
                <Switch />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label>
                  Okay for meroku to make an installable of this web app?
                </Label>
                <Switch />
              </div>
            </AppBuildRow>
          )} */
}
