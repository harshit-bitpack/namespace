import { useStorageUpload } from "@thirdweb-dev/react";
import { File, Trash, PlusCircle } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Button,
  Checkbox,
} from "ui";

type checkboxState = {
  android: boolean;
  web: boolean;
  ios: boolean;
};

type AndroidState = {
  minVersion: string | undefined;
  architecture: string | undefined;
  screenDpi: string | undefined;
  apk: File | undefined;
  id: string;
};

type IosState = {
  minVersion: string | undefined;
  architecture: string | undefined;
  screenDpi: string | undefined;
  ipa: File | undefined;
  id: string;
};

const AppBuildRow = ({
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
      <div
        className={`w-[60%] flex flex-col ${
          label === "Web App" ? "gap-y-4" : "gap-y-3"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const AppUploadContainer = ({
  platformState,
  handlePlatformStateChange,
  app,
}: {
  platformState: any;
  handlePlatformStateChange: (
    app: "android" | "ios",
    id: string,
    newState: AndroidState | IosState
  ) => void;
  app: string;
}) => (
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
            } else {
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
    {platformState?.apk && (
      <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-x-2 w-[80%]">
            <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
              <File className="w-4 h-4 text-[#2678FD]" />
            </div>

            <div className="flex flex-col gap-y-1 w-[70%]">
              <p className="font-medium text-sm truncate">
                {platformState.apk.name}
              </p>
              <p className="text-sm text-[#475467]">
                {(platformState.apk.size / 1024 / 1024).toFixed(2)}
                MB
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const newState = {
                ...platformState,
                apk: undefined,
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
    {platformState?.ipa && (
      <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-x-2 w-[80%]">
            <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
              <File className="w-4 h-4 text-[#2678FD]" />
            </div>

            <div className="flex flex-col gap-y-1 w-[70%]">
              <p className="font-medium text-sm truncate">
                {platformState.ipa.name}
              </p>
              <p className="text-sm text-[#475467]">
                {(platformState.ipa.size / 1024 / 1024).toFixed(2)}
                MB
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const newState = {
                ...platformState,
                ipa: undefined,
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
          onValueChange={(v) => {
            const newState = {
              ...platformState,
              screenDpi: v as any,
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

    <div className="flex flex-col gap-y-2">
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
  </>
);

export default function AppBuild({
  appName,
  metadata,
  isMetaLoading,
}: {
  appName: string;
  metadata: any;
  isMetaLoading: boolean;
}) {
  const [appType, setAppType] = useState<checkboxState>({
    android: true,
    web: false,
    ios: false,
  });

  const handleCheckboxChange = (type: keyof checkboxState) => {
    setAppType({
      ...appType,
      [type]: !appType[type],
    });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [android, setAndroid] = useState<AndroidState[]>([
    {
      minVersion: "",
      architecture: "",
      screenDpi: "",
      apk: undefined,
      id: uuidv4(),
    },
  ]);
  const [ios, setIos] = useState<IosState[]>([
    {
      minVersion: "",
      architecture: "",
      screenDpi: "",
      ipa: undefined,
      id: uuidv4(),
    },
  ]);

  const { mutateAsync: upload } = useStorageUpload();
  const isAndroid = appType["android"];
  const isWeb = appType["web"];
  const isIOS = appType["ios"];

  console.log("andy", android);
  console.log("ios", ios);

  const uploadToIpfs = async () => {
    const androidFiles = android.filter((item) => item.apk && item.minVersion);
    const iosFiles = ios.filter((item) => item.ipa && item.minVersion);

    if (
      (appType["android"] && androidFiles.length === 0) ||
      (appType["ios"] && iosFiles.length === 0)
    ) {
      toast.message("Upload the file and provide minimum version");
      return;
    }

    const uploadFiles = async (
      resolve: (value: any) => void,
      reject: (value: any) => void
    ) => {
      try {
        setIsSaving(true);

        const androidUploadPromises = androidFiles.map(async (item) => {
          return await upload({
            data: [item.apk],
            options: {
              uploadWithGatewayUrl: true,
              uploadWithoutDirectory: false,
            },
          });
        });

        const iosUploadPromises = iosFiles.map(async (item) => {
          return await upload({
            data: [item.ipa],
            options: {
              uploadWithGatewayUrl: true,
              uploadWithoutDirectory: false,
            },
          });
        });

        const apkUploadUrls = await Promise.all(androidUploadPromises);
        const ipaUploadUrls = await Promise.all(iosUploadPromises);

        console.log("ipaurl", ipaUploadUrls);
        console.log("apkurl", apkUploadUrls);

        clearValues();

        apkUploadUrls.forEach((apkUploadUrl, index) => {
          const newItem = {
            url: apkUploadUrl[0],
            platform: "android",
            minVersion: androidFiles[index].minVersion,
            architecture: androidFiles[index].architecture,
            screenDPI: androidFiles[index].screenDpi,
          };
          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
          console.log("apkMetadata", metadata);
        });

        ipaUploadUrls.forEach((ipaUploadUrl, index) => {
          const newItem = {
            url: ipaUploadUrl[0],
            platform: "ios",
            minVersion: iosFiles[index].minVersion,
            architecture: iosFiles[index].architecture,
            screenDPI: iosFiles[index].screenDpi,
          };
          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
          console.log("iosMetadata", metadata);
        });

        setIsSaving(false);
        return resolve("done");
      } catch (e: any) {
        return reject(e.message);
      }
    };

    toast.promise(
      new Promise((resolve, reject) => uploadFiles(resolve, reject)),
      {
        success: `Successfully saved data`,
        error: (data) => {
          return `${data}`;
        },
        loading: `Saving the Data...`,
      }
    );
  };

  const clearValues = () => {
    if (appType["android"]) {
      setAndroid([
        {
          minVersion: "",
          architecture: "",
          screenDpi: "",
          apk: undefined,
          id: uuidv4(),
        },
      ]);
    }
    if (appType["ios"]) {
      setIos([
        {
          minVersion: "",
          architecture: "",
          screenDpi: "",
          ipa: undefined,
          id: uuidv4(),
        },
      ]);
    }
  };

  const handleAddNewFile = (platform: "android" | "ios") => {
    if (platform === "android") {
      setAndroid([
        ...android,
        {
          minVersion: "",
          architecture: "",
          screenDpi: "",
          apk: undefined,
          id: uuidv4(),
        },
      ]);
    } else {
      setIos([
        ...ios,
        {
          minVersion: "",
          architecture: "",
          screenDpi: "",
          ipa: undefined,
          id: uuidv4(),
        },
      ]);
    }
  };

  const handlePlatformStateChange = (
    app: "android" | "ios",
    id: string,
    newState: AndroidState | IosState
  ) => {
    if (app === "android") {
      setAndroid((prevAndroid) => {
        return prevAndroid.map((item) =>
          item.id === id ? (newState as AndroidState) : item
        );
      });
    } else {
      setIos((prevIos) => {
        return prevIos.map((item) =>
          item.id === id ? (newState as IosState) : item
        );
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
      {/* <div className="flex flex-col w-full"> */}
      <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
        <div className="flex flex-col gap-y-2">
          <h3 className="text-[#101828] text-2xl font-semibold">Build</h3>
          <p className="text-[#475467] text-sm">Edit your app build details.</p>
        </div>

        <AppBuildRow label="App Type" isRequired>
          <div className="flex items-center space-x-2">
            <Checkbox
              onClick={(e) => {
                handleCheckboxChange("android");
              }}
              checked={appType["android"]}
              id="android"
            />
            <Label htmlFor="android">Android</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              onClick={(e) => {
                handleCheckboxChange("web");
              }}
              checked={appType["web"]}
              id="web"
              disabled
            />
            <Label htmlFor="web">Web</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              onClick={(e) => {
                handleCheckboxChange("ios");
              }}
              checked={appType["ios"]}
              id="ios"
            />
            <Label htmlFor="ios">iOS</Label>
          </div>
        </AppBuildRow>

        <hr />

        {isAndroid && (
          <AppBuildRow label="Android">
            {android.map((androidState, index) => (
              <AppUploadContainer
                key={`android-${index}`}
                platformState={androidState}
                handlePlatformStateChange={handlePlatformStateChange}
                app="android"
              />
            ))}
            <div
              className="mt-4 underline cursor-pointer"
              onClick={() => handleAddNewFile("android")}
            >
              Add new file
            </div>
          </AppBuildRow>
        )}

        {/* {isWeb && (
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
          )} */}

        {isIOS && (
          <AppBuildRow label="iOS">
            {ios.map((iosState, index) => (
              <AppUploadContainer
                key={`ios-${index}`}
                platformState={iosState}
                handlePlatformStateChange={handlePlatformStateChange}
                app="ios"
              />
            ))}
            <div
              className="mt-4 underline cursor-pointer"
              onClick={() => handleAddNewFile("ios")}
            >
              Add new file
            </div>
          </AppBuildRow>
        )}

        <div className="w-full flex flex-row justify-end gap-x-4">
          <Button
            onClick={uploadToIpfs}
            disabled={
              isSaving ||
              Object.keys(appType).every(
                (app) => !appType[app as keyof checkboxState]
              )
            }
          >
            Save
          </Button>
          <Button variant="outline" onClick={clearValues}>
            Cancel
          </Button>
        </div>
      </div>
      {/* <div className="flex flex-row justify-end gap-x-4">
          <Button>Save</Button>
          <Button variant={"outline"}>Cancel</Button>
        </div>   */}
      {/* </div> */}
    </div>
  );
}
