import { useSDK, useStorage } from "@thirdweb-dev/react";
import { useState } from "react";
import { Input, Label, Button } from "ui";

import { env } from "@/env/schema.mjs";
import useAppMetadata from "@/lib/hooks/useFetchMetadata";
import { toast } from "sonner";
import { File, Trash } from "lucide-react";

const PublisherDetailsRow = ({
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

export default function PublisherDetails({ devName }: { devName: string }) {
  const { metadata, isMetaLoading, error } = useAppMetadata(devName);
  const sdk = useSDK();
  const storage = useStorage();

  const [logo, setLogo] = useState<{
    name: string;
    size: number;
    url: string;
  }>();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState<string>("");
  const [website, setWebsite] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [githubId, setGithubId] = useState("");

  // useEffect(() => {
  //     if (metadata.chainId) {
  //         setChainId(metadata.chainId);
  //     }
  // }, [metadata]);

  // const [contractAddress, setContractAddress] = useState("");

  // const [allowedCountries, setAllowedCountries] = useState([]);
  // const [deniedCountries, setDeniedCountries] = useState([]);

  // useEffect(() => {
  //     if (metadata.allowedCountries) {
  //         setAllowedCountries(metadata.allowedCountries);
  //     }

  //     if (metadata.deniedCountries) {
  //         setDeniedCountries(metadata.deniedCountries);
  //     }
  // }, [metadata]);

  // const [language, setLanguage] = useState("english");
  // const [minimumAge, setMinimumAge] = useState(0);

  // useEffect(() => {
  //     if (metadata.language) {
  //         setLanguage(metadata.language);
  //     }

  //     if (metadata.minimumAge) {
  //         setMinimumAge(metadata.minimumAge);
  //     }
  // }, [metadata]);

  // const [version, setVersion] = useState("");

  // const [tags, setTags] = useState<string[]>([]);

  // useEffect(() => {
  //     if (metadata.tags) {
  //         setTags(metadata.tags);
  //     }
  // }, [metadata]);

  return (
    <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
      <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
        <div className="flex flex-col gap-y-2">
          <h3 className="text-[#101828] text-2xl font-semibold">
            Publisher Details
          </h3>
          <p className="text-[#475467] text-sm">
            Edit your .app billing details and addresss.
          </p>
        </div>

        <PublisherDetailsRow label="Publisher Details">
          <div className="flex flex-col gap-y-2">
            <Label>Name</Label>
            <Input
              placeholder={metadata.name ?? "Enter a name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Logo</Label>
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
                    SVG, PNG, JPG or GIF (max. 5mb)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".svg, .jpg, .png, .gif"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return;
                    const selectedFile = e.target.files[0];
                    if (selectedFile && selectedFile.size <= 5242880) {
                      setLogo({
                        name: e.target.files[0].name,
                        size: e.target.files[0].size,
                        url: URL.createObjectURL(e.target.files[0]),
                      });
                    } else {
                      toast.error("Please select a valid file within 5MB."); // Show an alert message
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {logo && (
              <div className="w-full h-full justify-center border border-[#2678FD] rounded-lg p-4 flex flex-col gap-y-3">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-x-2 w-[80%]">
                    <div className="w-8 h-8 bg-[#EDF4FF] rounded-full flex items-center justify-center">
                      <File className="w-4 h-4 text-[#2678FD]" />
                    </div>

                    <div className="flex flex-col gap-y-1 w-[70%]">
                      <p className="font-medium text-sm truncate">
                        {logo.name}
                      </p>
                      <p className="text-sm text-[#475467]">
                        {(logo.size / 1024 / 1024).toFixed(2)}
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
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Website</Label>
            <Input
              placeholder={metadata.repoUrl ?? "https://yourWebsite.com"}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Privacy Policy URL</Label>
            <Input
              placeholder={metadata.dappId ?? "https://yourPrivacyUrl.com"}
              value={privacyPolicyUrl}
              onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>GithubID</Label>
            <Input
              placeholder={metadata.dappId ?? "rhffhsvr67334te"}
              value={githubId}
              onChange={(e) => setGithubId(e.target.value)}
            />
          </div>
        </PublisherDetailsRow>

        <hr />

        <PublisherDetailsRow label="Support">
          <div className="flex flex-col gap-y-2">
            <Label>Support Url</Label>
            <Input
              placeholder={metadata.name ?? "https://yourSupportUrl.com"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Support Email</Label>
            <Input
              placeholder={metadata.name ?? "Enter Your Email"}
              type="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </PublisherDetailsRow>

        <div className="w-full flex flex-row justify-end gap-x-4">
          <Button variant="outline">Cancel</Button>
          <Button
            disabled={isMetaLoading || saving}
            onClick={async () => {
              if (!storage || !sdk) return;

              setSaving(true);

              const newMetadata = {
                ...metadata,
              };

              if (name) {
                newMetadata.name = name;
              }

              if (website) {
                newMetadata.website = website;
              }

              if (privacyPolicyUrl) {
                newMetadata.privacyPolicyUrl = privacyPolicyUrl;
              }

              if (githubId) {
                newMetadata.githubId = githubId;
              }

              const uri = await storage.upload(newMetadata);

              const appContract = await sdk.getContract(
                env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS
              );

              try {
                const tokenId = await appContract.call("tokenIdForDevName", [
                  devName,
                ]);

                if (!tokenId) {
                  throw new Error("Invalid dev name");
                }

                await appContract.call("updateTokenURI", [tokenId, uri]);

                toast.success("Dev updated successfully");
              } catch (e) {
                const err = `${e}`;
                toast.error(err);
              }

              setSaving(false);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
