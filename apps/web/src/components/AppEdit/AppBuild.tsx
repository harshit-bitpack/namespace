import { useStorageUpload } from "@thirdweb-dev/react";
import { File, Trash, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
  DatePicker,
} from "ui";
import Spinner from "../Spinner";
import AppUploadContainer from "../AppUploadContainer";

type checkboxState = {
  android: boolean;
  web: boolean;
  ios: boolean;
};

type toggleDateAndWalletFileds = {
  hasWalletConnect: boolean;
  isListedInRegistry: boolean;
};

type AndroidState = {
  minVersion: string | undefined;
  architecture: string | undefined;
  screenDPI: string | undefined;
  apk: File | undefined;
  url?: string | undefined;
  id: string;
  walletConnectVersion: string | undefined;
  packageId: string | undefined;
  versionCode: string | undefined;
  dateListedInRegistry: Date | undefined;
};

type IosState = {
  minVersion: string | undefined;
  architecture: string | undefined;
  screenDPI: string | undefined;
  ipa: File | undefined;
  url?: string | undefined;
  id: string;
  walletConnectVersion: string | undefined;
  packageId: string | undefined;
  versionCode: string | undefined;
  dateListedInRegistry: Date | undefined;
};

type webState = {
  url: string | undefined;
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

const WebContainer = ({
  webState,
  handleWebState,
}: {
  webState: any;
  handleWebState: (
    app: "android" | "ios" | "web",
    id: string,
    newState: AndroidState | IosState | webState
  ) => void;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <Label>
        URL
        <span className="text-red-500">*</span>
      </Label>
      <Input
        placeholder="https://bitpack.me"
        required
        value={webState.url}
        onChange={(e) => {
          const newState = {
            ...webState,
            url: e.target.value,
          };
          handleWebState("web", webState.id, newState);
        }}
      />
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
      screenDPI: "",
      apk: undefined,
      id: uuidv4(),
      walletConnectVersion: "",
      packageId: "",
      versionCode: "",
      dateListedInRegistry: undefined,
    },
  ]);
  const [ios, setIos] = useState<IosState[]>([
    {
      minVersion: "",
      architecture: "",
      screenDPI: "",
      ipa: undefined,
      id: uuidv4(),
      walletConnectVersion: "",
      packageId: "",
      versionCode: "",
      dateListedInRegistry: undefined,
    },
  ]);

  const [web, setWeb] = useState<webState[]>([
    {
      url: "",
      id: uuidv4(),
    },
  ]);

  const { mutateAsync: upload } = useStorageUpload();
  const isAndroid = appType["android"];
  const isWeb = appType["web"];
  const isIOS = appType["ios"];

  console.log("metadata build", metadata);

  useEffect(() => {
    if (metadata.downloadBaseUrls?.length > 0) {
      const androidFiles = metadata.downloadBaseUrls?.filter(
        (item: any) => item.platform === "android"
      );
      const iosFiles = metadata.downloadBaseUrls?.filter(
        (item: any) => item.platform === "ios"
      );

      const webUrls = metadata.downloadBaseUrls?.filter(
        (item: any) => item.platform === "web"
      );
      if (androidFiles.length > 0) {
        setAndroid(
          androidFiles.map((item: any) => ({
            ...item,
            id: uuidv4(),
            apk: undefined,
          }))
        );
      }
      if (iosFiles.length > 0) {
        setIos(
          iosFiles.map((item: any) => ({
            ...item,
            id: uuidv4(),
            ipa: undefined,
          }))
        );
      }
      if (webUrls.length > 0) {
        setWeb(webUrls.map((item: any) => ({ ...item, id: uuidv4() })));
      }
    }
  }, [metadata]);

  const uploadToIpfs = async () => {
    const isAndroidValid = android.every(
      (item) =>
        (item.url || item.apk) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode
    );
    const isIosValid = ios.every(
      (item) =>
        (item.url || item.ipa) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode
    );

    const isWebValid = web.every((item) => item.url);

    if (
      (appType["android"] && !isAndroidValid) ||
      (appType["ios"] && !isIosValid) ||
      (appType["web"] && !isWebValid)
    ) {
      toast.message("Please fill in the required fields");
      return;
    }

    const androidFiles = android.filter(
      (item) =>
        (item.url || item.apk) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode
    );
    const iosFiles = ios.filter(
      (item) =>
        (item.url || item.ipa) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode
    );

    const webUrls = web.filter((item) => item.url);

    const uploadFiles = async (
      resolve: (value: any) => void,
      reject: (value: any) => void
    ) => {
      try {
        setIsSaving(true);

        const androidUploadPromises = androidFiles.map(async (item) => {
          if (item.url) {
            return [item.url];
          }

          return await upload({
            data: [item.apk],
            options: {
              uploadWithGatewayUrl: true,
              uploadWithoutDirectory: false,
            },
          });
        });

        const iosUploadPromises = iosFiles.map(async (item) => {
          if (item.url) {
            return [item.url];
          }

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
        console.log("weburl", webUrls);

        let availableOnPlatform: ("android" | "ios" | "web")[] = [];

        if (androidFiles.length > 0) {
          availableOnPlatform.push("android");
        }
        if (iosFiles.length > 0) {
          availableOnPlatform.push("ios");
        }
        if (webUrls.length > 0) {
          availableOnPlatform.push("web");
        }

        metadata.availableOnPlatform = availableOnPlatform;
        clearValues();

        if (metadata.downloadBaseUrls) {
          metadata.downloadBaseUrls = [];
        }

        apkUploadUrls.forEach((apkUploadUrl, index) => {
          const newItem = {
            url: apkUploadUrl[0],
            platform: "android",
            minVersion: androidFiles[index].minVersion,
            architecture: androidFiles[index].architecture,
            screenDPI: androidFiles[index].screenDPI,
            walletConnectVersion: androidFiles[index].walletConnectVersion,
            packageId: androidFiles[index].packageId,
            versionCode: androidFiles[index].versionCode,
            dateListedInRegistry:
              androidFiles[index].dateListedInRegistry?.toString(),
          };

          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
        });

        ipaUploadUrls.forEach((ipaUploadUrl, index) => {
          const newItem = {
            url: ipaUploadUrl[0],
            platform: "ios",
            minVersion: iosFiles[index].minVersion,
            architecture: iosFiles[index].architecture,
            screenDPI: iosFiles[index].screenDPI,
            walletConnectVersion: iosFiles[index].walletConnectVersion,
            packageId: iosFiles[index].packageId,
            versionCode: iosFiles[index].versionCode,
            dateListedInRegistry:
              iosFiles[index].dateListedInRegistry?.toString(),
          };

          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
        });

        webUrls.forEach((webUrl, index) => {
          const newItem = {
            url: webUrl.url,
            platform: "web",
          };

          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
        });

        console.log("updatedMetadata", metadata);
        setIsSaving(false);
        return resolve("done");
      } catch (e: any) {
        console.log("catch-error", e);
        return reject(e.message);
      }
    };

    toast.promise(
      new Promise((resolve, reject) => uploadFiles(resolve, reject)),
      {
        success: `Successfully saved data`,
        error: (data) => {
          console.log("toast-error", data);
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
          screenDPI: "",
          apk: undefined,
          id: uuidv4(),
          walletConnectVersion: "",
          packageId: "",
          versionCode: "",
          dateListedInRegistry: undefined,
        },
      ]);
    }
    if (appType["ios"]) {
      setIos([
        {
          minVersion: "",
          architecture: "",
          screenDPI: "",
          ipa: undefined,
          id: uuidv4(),
          walletConnectVersion: "",
          packageId: "",
          versionCode: "",
          dateListedInRegistry: undefined,
        },
      ]);
    }
    if (appType["web"]) {
      setWeb([
        {
          url: "",
          id: uuidv4(),
        },
      ]);
    }
  };

  const handleAddNewFile = (platform: "android" | "ios" | "web") => {
    if (platform === "android") {
      setAndroid([
        ...android,
        {
          minVersion: "",
          architecture: "",
          screenDPI: "",
          apk: undefined,
          url: "",
          id: uuidv4(),
          walletConnectVersion: "",
          packageId: "",
          versionCode: "",
          dateListedInRegistry: undefined,
        },
      ]);
    } else if (platform === "ios") {
      setIos([
        ...ios,
        {
          minVersion: "",
          architecture: "",
          screenDPI: "",
          ipa: undefined,
          url: "",
          id: uuidv4(),
          walletConnectVersion: "",
          packageId: "",
          versionCode: "",
          dateListedInRegistry: undefined,
        },
      ]);
    } else if (platform === "web") {
      setWeb((prevState) => [...prevState, { id: uuidv4(), url: "" }]);
    }
  };

  const handlePlatformStateChange = (
    app: "android" | "ios" | "web",
    id: string,
    newState: AndroidState | IosState | webState
  ) => {
    if (app === "android") {
      setAndroid((prevAndroid) => {
        return prevAndroid.map((item) =>
          item.id === id ? (newState as AndroidState) : item
        );
      });
    } else if (app === "ios") {
      setIos((prevIos) => {
        return prevIos.map((item) =>
          item.id === id ? (newState as IosState) : item
        );
      });
    } else if (app === "web") {
      setWeb((prevWeb) => {
        return prevWeb.map((item) =>
          item.id === id ? (newState as webState) : item
        );
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
      {/* <div className="flex flex-col w-full"> */}
      {isMetaLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isMetaLoading && (
        <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-[#101828] text-2xl font-semibold">Build</h3>
            <p className="text-[#475467] text-sm">
              Edit your app build details.
            </p>
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

          {isWeb && (
            <AppBuildRow label="Web App">
              {web.map((webState, index) => (
                <WebContainer
                  webState={webState}
                  key={index}
                  handleWebState={handlePlatformStateChange}
                />
              ))}
              <div
                className="mt-4 underline cursor-pointer"
                onClick={() => handleAddNewFile("web")}
              >
                Add new url
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
      )}
    </div>
  );
}
