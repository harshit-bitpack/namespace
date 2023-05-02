import { useStorageUpload } from "@thirdweb-dev/react";
import { File, Trash } from "lucide-react";
import { useState } from "react";
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
  RadioGroup,
  RadioGroupItem,
  Switch,
} from "ui";

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

export default function AppBuild({
  appName,
  metadata,
  isMetaLoading,
}: {
  appName: string;
  metadata: any;
  isMetaLoading: boolean;
}) {
  console.log("MetaData : ", metadata);
  const [appType, setAppType] = useState<"android" | "web" | "ios">("android");
  const [minVersion, setMinVersion] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const [architecture, setArchitecture] = useState<string>();
  const [screenDpi, setScreenDpi] = useState<string>();
  const { mutateAsync: upload } = useStorageUpload();
  const isAndroid = appType === "android";
  const isWeb = appType === "web";
  const isIOS = appType === "ios";

  const [apk, setApk] = useState<File>();
  const [ipa, setIpa] = useState<File>();

  const uploadToIpfs = async () => {
    if (appType === "android" && !apk) {
      toast.message("Upload the file");
      return;
    }

    if (appType === "ios" && !ipa) {
      toast.message("Upload the file");
      return;
    }

    if (!minVersion) {
      toast.message("Minimum version is required");
      return;
    }

    const uploadFile = async (
      resolve: (value: any) => void,
      reject: (value: any) => void
    ) => {
      try {
        setIsSaving(true);
        const uploadUrl = await upload({
          data: [appType === "android" ? apk : ipa],
          options: {
            uploadWithGatewayUrl: true,
            uploadWithoutDirectory: false,
          },
        });
        clearValues();
        const newItem = {
          url: uploadUrl[0],
          platform: appType,
          minVersion: minVersion,
          architecture: architecture,
          screenDPI: screenDpi,
        };
        if (!metadata.downloadBaseUrls) {
          metadata.downloadBaseUrls = [newItem];
          setIsSaving(false);
          return resolve("done");
        }
        metadata.downloadBaseUrls.push(newItem);
        setIsSaving(false);
        return resolve("done");
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
        loading: `Saving the Data...`,
      }
    );
  };

  const clearValues = () => {
    setMinVersion(() => "");
    appType === "android" ? setApk(() => undefined) : setIpa(() => undefined);
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
          <RadioGroup defaultValue={appType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={(e) => {
                  setAppType("android");
                }}
                value="android"
                id="android"
              />
              <Label htmlFor="android">Android</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={(e) => {
                  setAppType("web");
                }}
                value="web"
                id="web"
                disabled
              />
              <Label htmlFor="web">Web</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={(e) => {
                  setAppType("ios");
                }}
                value="ios"
                id="ios"
              />
              <Label htmlFor="ios">iOS</Label>
            </div>
          </RadioGroup>
        </AppBuildRow>

        <hr />

        {isAndroid && (
          <AppBuildRow label="Android">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    APK
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".apk"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return;
                    setApk(e.target.files[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {apk && (
              <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-x-2 w-[80%]">
                    <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                      <File className="w-4 h-4 text-[#2678FD]" />
                    </div>

                    <div className="flex flex-col gap-y-1 w-[70%]">
                      <p className="font-medium text-sm truncate">{apk.name}</p>
                      <p className="text-sm text-[#475467]">
                        {(apk.size / 1024 / 1024).toFixed(2)}
                        MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setApk(undefined);
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
                    setArchitecture(v as any);
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
                    setScreenDpi(v as any);
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
                value={minVersion}
                onChange={(e) => setMinVersion(e.target.value)}
              />
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
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    APK
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".ipa"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return;
                    setIpa(e.target.files[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {ipa && (
              <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-x-2 w-[80%]">
                    <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                      <File className="w-4 h-4 text-[#2678FD]" />
                    </div>

                    <div className="flex flex-col gap-y-1 w-[70%]">
                      <p className="font-medium text-sm truncate">{ipa.name}</p>
                      <p className="text-sm text-[#475467]">
                        {(ipa.size / 1024 / 1024).toFixed(2)}
                        MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIpa(undefined);
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
                    setArchitecture(v as any);
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
                    setScreenDpi(v as any);
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
                value={minVersion}
                onChange={(e) => setMinVersion(e.target.value)}
              />
            </div>
          </AppBuildRow>
        )}

        <div className="w-full flex flex-row justify-end gap-x-4">
          <Button onClick={uploadToIpfs} disabled={isSaving}>
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
