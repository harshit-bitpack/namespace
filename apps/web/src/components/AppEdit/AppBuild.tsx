import { useStorageUpload } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Input,
  Label,
  Button,
  Checkbox,
  Card,
  CardContent,
  CardDescription,
} from "ui";
import Spinner from "../Spinner";
import { PlusCircle } from "lucide-react";
import AppUploadContainer from "../AppUploadContainer";

type checkboxState = {
  android: boolean;
  web: boolean;
  ios: boolean;
};

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

type webState = {
  url: string | undefined;
  version: string | undefined;
};

const AppBuildRow = ({
  children,
  label,
  description,
  isRequired,
  helpTexts,
}: {
  children: React.ReactNode;
  label: string;
  description?: string;
  isRequired?: boolean;
  helpTexts?: { title: string; desc: string }[];
}) => {
  return (
    <div className="flex flex-row w-full">
      <div className="w-[40%] flex flex-col gap-y-1">
        <span className="text-sm font-medium">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </span>
        {description && <span className="text-sm">{description}</span>}
        {helpTexts &&
          helpTexts.map((helpText, idx) => {
            return (
              <Card
                className="mr-2 my-2 w-[80%] bg-neutral-100 shadow-md"
                key={idx}
              >
                <CardContent className="p-2">
                  <CardDescription className="text-xs font-bold mb-1">
                    {helpText.title}
                  </CardDescription>
                  <CardDescription className="text-xs">
                    {helpText.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
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
    app: "web",
    id: string | undefined,
    newState: webState
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
          handleWebState("web", "", newState);
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
      version: "",
      architecture: "",
      screenDPI: "",
      apk: undefined,
      id: uuidv4(),
      packageId: "",
      versionCode: "",
    },
  ]);
  const [ios, setIos] = useState<IosState[]>([
    {
      minVersion: "",
      version: "",
      architecture: "",
      screenDPI: "",
      ipa: undefined,
      id: uuidv4(),
      packageId: "",
      versionCode: "",
    },
  ]);

  const [web, setWeb] = useState<webState>({
    url: "",
    version: "",
  });

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
        setAppType((prevState) => ({
          ...prevState,
          android: true,
        }));
      }
      if (iosFiles.length > 0) {
        setIos(
          iosFiles.map((item: any) => ({
            ...item,
            id: uuidv4(),
            ipa: undefined,
          }))
        );
        setAppType((prevState) => ({
          ...prevState,
          ios: true,
        }));
      }

      if (webUrls.length > 0) {
        setWeb(webUrls[0]);
        setAppType((prevState) => ({
          ...prevState,
          web: true,
        }));
      }
    }
  }, [metadata]);

  const uploadToIpfs = async () => {
    const isAndroidValid = android.every(
      (item) =>
        (item.url || item.apk) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode &&
        item.version
    );
    const isIosValid = ios.every(
      (item) =>
        (item.url || item.ipa) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode &&
        item.version
    );

    const isWebValid = Boolean(web.url);

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
        item.versionCode &&
        item.version
    );
    const iosFiles = ios.filter(
      (item) =>
        (item.url || item.ipa) &&
        item.minVersion &&
        item.packageId &&
        item.versionCode &&
        item.version
    );

    const webUrl = web.url;

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

        let availableOnPlatform: ("android" | "ios" | "web")[] = [];

        if (androidFiles.length > 0) {
          availableOnPlatform.push("android");
        }
        if (iosFiles.length > 0) {
          availableOnPlatform.push("ios");
        }
        if (isWebValid) {
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
            packageId: androidFiles[index].packageId,
            versionCode: androidFiles[index].versionCode,
            version: androidFiles[index].version,
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
            packageId: iosFiles[index].packageId,
            versionCode: iosFiles[index].versionCode,
            version: iosFiles[index].version,
          };

          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
        });

        if (isWebValid) {
          const newItem = {
            url: webUrl,
            platform: "web",
          };

          if (!metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls = [newItem];
          } else if (metadata.downloadBaseUrls) {
            metadata.downloadBaseUrls.push(newItem);
          }
        }

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
          version: "",
          architecture: "",
          screenDPI: "",
          apk: undefined,
          id: uuidv4(),
          packageId: "",
          versionCode: "",
        },
      ]);
    }
    if (appType["ios"]) {
      setIos([
        {
          minVersion: "",
          version: "",
          architecture: "",
          screenDPI: "",
          ipa: undefined,
          id: uuidv4(),
          packageId: "",
          versionCode: "",
        },
      ]);
    }
    if (appType["web"]) {
      setWeb({
        url: "",
        version: "",
      });
    }
  };

  const handleAddNewFile = (platform: "android" | "ios" | "web") => {
    if (platform === "android") {
      setAndroid([
        ...android,
        {
          minVersion: "",
          version: "",
          architecture: "",
          screenDPI: "",
          apk: undefined,
          url: "",
          id: uuidv4(),
          packageId: "",
          versionCode: "",
        },
      ]);
    } else if (platform === "ios") {
      setIos([
        ...ios,
        {
          minVersion: "",
          version: "",
          architecture: "",
          screenDPI: "",
          ipa: undefined,
          url: "",
          id: uuidv4(),
          packageId: "",
          versionCode: "",
        },
      ]);
    }
  };

  const handleDeleteFile = (app: "android" | "ios", id: string) => {
    if (app === "android") {
      setAndroid((prevAndroid) => {
        return prevAndroid.filter((item) => item.id !== id);
      });
    } else if (app === "ios") {
      setIos((prevIos) => {
        return prevIos.filter((item) => item.id !== id);
      });
    }
  };

  const handlePlatformStateChange = (
    app: "android" | "ios" | "web",
    id: string | undefined,
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
      setWeb(newState as webState);
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
            <AppBuildRow
              label="Android"
              helpTexts={[
                {
                  title: "Version",
                  desc: "The version of the dApp that is available on the dApp store",
                },
                {
                  title: "Version Code",
                  desc: "The version code of the dApp that is available on the dApp store",
                },
                {
                  title: "Min version",
                  desc: "The minimum version of the dApp that is required to run this dApp",
                },
              ]}
            >
              {android.map((androidState, index) => (
                <AppUploadContainer
                  key={`android-${index}`}
                  platformState={androidState}
                  handlePlatformStateChange={handlePlatformStateChange}
                  handleDeleteFile={handleDeleteFile}
                  app="android"
                />
              ))}
              <div
                className="mt-4 cursor-pointer flex gap-2 items-center shadow-md py-1 px-2 text-sm w-[fit-content] rounded-md hover:bg-[#F7F7F7]]"
                onClick={() => handleAddNewFile("android")}
              >
                <PlusCircle className="w-4 h-4 text-cyan-700" />
                <p>Add new file</p>
              </div>
            </AppBuildRow>
          )}

          {isIOS && (
            <AppBuildRow
              label="iOS"
              helpTexts={[
                {
                  title: "Version",
                  desc: "The version of the dApp that is available on the dApp store",
                },
                {
                  title: "Version Code",
                  desc: "The version code of the dApp that is available on the dApp store",
                },
                {
                  title: "Min version",
                  desc: "The minimum version of the dApp that is required to run this dApp",
                },
              ]}
            >
              {ios.map((iosState, index) => (
                <AppUploadContainer
                  key={`ios-${index}`}
                  platformState={iosState}
                  handlePlatformStateChange={handlePlatformStateChange}
                  handleDeleteFile={handleDeleteFile}
                  app="ios"
                />
              ))}
              <div
                className="mt-4 cursor-pointer flex gap-2 items-center shadow-md py-1 px-2 text-sm w-[fit-content] rounded-md hover:bg-[#F7F7F7]]"
                onClick={() => handleAddNewFile("ios")}
              >
                <PlusCircle className="w-4 h-4 text-cyan-700" />
                <p>Add new file</p>
              </div>
            </AppBuildRow>
          )}
          <hr />
          {isWeb && (
            <AppBuildRow label="Web App">
              <WebContainer
                webState={web}
                handleWebState={handlePlatformStateChange}
              />
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
