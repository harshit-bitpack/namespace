import { useSDK, useStorage } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "ui";
import ReactSelect from "react-select";
import { toast } from "sonner";
import { countries } from "countries-list";
import iso6391 from "iso-639-1";
import Spinner from "../Spinner";
import { categories, subCategories } from "../../lib/utils";

const AppDetailsRow = ({
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

export default function AppDetails({
  appName,
  metadata,
  isMetaLoading,
}: {
  appName: string;
  metadata: any;
  isMetaLoading: boolean;
}) {
  console.log("MetaData : ", metadata);
  const sdk = useSDK();
  const storage = useStorage();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [appUrl, setAppUrl] = useState<string>();
  const [repoUrl, setRepoUrl] = useState<string>();
  const [dappId, setDappId] = useState(appName);
  const [chainIdArr, setChainIdArr] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [subCategory, setSubCategory] = useState<string>();

  const addChainId = (newChainId: string) => {
    setChainIdArr((prev) => {
      return [...prev, newChainId];
    });
  };
  const [contractCounter, setContractCounter] = useState(1);
  useEffect(() => {
    if (metadata.chainId) {
      setChainIdArr(metadata.chainId);
    }
  }, [metadata]);

  const [contractArr, setContractArr] = useState<
    { chain: string; contract: string }[]
  >([]);
  const [contractAddress, setContractAddress] = useState("");

  const addContractAddress = (chainId: string, contract: string) => {
    if (contractCounter === contractArr.length) {
      setContractCounter((prevCounter) => {
        return prevCounter + 1;
      });
      return;
    }
    if (chainId === undefined || contract.length === 0) {
      toast.message("Please select an option and enter a value!");
      return;
    }
    const newItem = {
      chain: chainId,
      contract: contract,
    };
    setContractArr((prev) => {
      return [...prev, newItem];
    });
    setChainId((prev) => {
      return undefined;
    });
    setContractAddress((prev) => {
      return "";
    });
    setContractCounter((prevCounter) => {
      return prevCounter + 1;
    });
  };

  const removeContractAddress = () => {
    if (contractCounter === contractArr.length) {
      setContractArr((prev) => {
        prev.pop();
        return [...prev];
      });
    }
    setContractCounter((prevCounter) => {
      return prevCounter - 1;
    });
  };

  const [allowedCountries, setAllowedCountries] = useState<string[]>([]);
  const [deniedCountries, setDeniedCountries] = useState<string[]>([]);

  useEffect(() => {
    if (metadata.allowedCountries) {
      setAllowedCountries(metadata.allowedCountries);
    }

    if (metadata.deniedCountries) {
      setDeniedCountries(metadata.deniedCountries);
    }
  }, [metadata]);

  const [language, setLanguage] = useState<string[]>([]);
  const [minimumAge, setMinimumAge] = useState<number>(0);

  useEffect(() => {
    if (metadata.category) {
      setCategory(metadata.category);
    }

    if (metadata.subCategory) {
      setSubCategory(metadata.subCategory);
    }

    if (metadata.language) {
      setLanguage(metadata.language);
    }

    if (metadata.minimumAge) {
      setMinimumAge(metadata.minimumAge);
    }
  }, [metadata]);

  const [version, setVersion] = useState<string>();

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (metadata.tags) {
      setTags(metadata.tags);
    }
  }, [metadata]);

  const countriesOptions = [
    ...Object.entries(countries).map(([code, name]) => ({
      label: name.name,
      value: code,
    })),
  ];

  const languagesOptions = iso6391.getAllNames().map((name) => ({
    value: iso6391.getCode(name),
    label: name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  let subCategoryOptions: { value: string; label: string }[] = [];
  if (category && category in subCategories) {
    subCategoryOptions = subCategories[category].map((sc: string) => ({
      label: sc,
      value: sc,
    }));
  }

  return (
    <div className="flex flex-col items-center justify-start w-full rounded-lg bg-white shadow-[0_20_20_60_#0000000D] overflow-hidden">
      {isMetaLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isMetaLoading && (
        <div className="p-4 md:p-8 w-full gap-y-6 flex flex-col">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-[#101828] text-2xl font-semibold">
              App Details
            </h3>
            <p className="text-[#475467] text-sm">Edit your app details.</p>
          </div>

          <AppDetailsRow label="Name" isRequired>
            <Input
              placeholder={"Enter a name"}
              value={metadata.name ?? name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </AppDetailsRow>
          <AppDetailsRow
            label="Description"
            description="Write a description of the app"
            isRequired
          >
            <Textarea
              placeholder={"Enter a description"}
              value={metadata.description ?? description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </AppDetailsRow>

          <hr />

          <AppDetailsRow label="URL information">
            <div className="flex flex-col gap-y-2">
              <Label>
                URL
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={"https://bitpack.me"}
                value={metadata.appUrl ?? appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Repo URL</Label>
              <Input
                placeholder={"https://github.com/bitpack.me"}
                value={metadata.repoUrl ?? repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
          </AppDetailsRow>

          <hr />

          <AppDetailsRow label="Contracts">
            {Array.from(Array(contractCounter)).map((counter, i) => {
              return (
                <div key={counter} className="flex flex-col gap-y-3">
                  <div className="flex flex-col gap-y-2">
                    <Label>Chain ID</Label>
                    <Select
                      onValueChange={(v) => {
                        setChainId(v as any);
                      }}
                      value={contractArr[i] ? contractArr[i].chain : chainId}
                      disabled={contractArr[i] ? true : false}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chain ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ethereum</SelectItem>
                        <SelectItem value="137">Polygon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label>Contract</Label>
                    <Input
                      placeholder={metadata.contractAddress ?? "000x"}
                      onChange={(e) => setContractAddress(e.target.value)}
                      disabled={contractArr[i] ? true : false}
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex flex-row gap-x-3">
              <Button
                onClick={() =>
                  addContractAddress(chainId as string, contractAddress)
                }
              >
                Add
              </Button>
              <Button
                onClick={() => removeContractAddress()}
                variant={"outline"}
                disabled={contractCounter === 0}
              >
                {contractCounter === 1 ? "Clear" : "Cancel"}
              </Button>
            </div>
            <div></div>
          </AppDetailsRow>

          <hr />

          <AppDetailsRow label="Geo Restrictions">
            <div className="flex flex-col gap-y-2">
              <Label>Denied in Countries</Label>
              <ReactSelect
                options={countriesOptions}
                isMulti
                isDisabled={allowedCountries.length > 0}
                onChange={(selectedOptions) => {
                  setDeniedCountries(
                    selectedOptions
                      ? selectedOptions.map((option) => {
                          if (option) {
                            return option.value;
                          }
                          return "";
                        })
                      : []
                  );
                }}
                value={deniedCountries.map((country) =>
                  countriesOptions.find((option) => option.value === country)
                )}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Allowed in Countries</Label>
              <ReactSelect
                options={countriesOptions}
                isMulti
                isDisabled={deniedCountries.length > 0}
                onChange={(selectedOptions) => {
                  setAllowedCountries(
                    selectedOptions
                      ? selectedOptions.map((option) => {
                          if (option) {
                            return option.value;
                          }
                          return "";
                        })
                      : []
                  );
                }}
                value={allowedCountries.map((country) =>
                  countriesOptions.find((option) => option.value === country)
                )}
              />
            </div>
          </AppDetailsRow>

          <hr />

          <AppDetailsRow label="Other Information">
            <div className="flex flex-col gap-y-2">
              <Label>
                Category
                <span className="text-red-500">*</span>
              </Label>
              <ReactSelect
                options={categoryOptions}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setSubCategory(undefined);
                    setCategory(selectedOption.value);
                  }
                }}
                value={categoryOptions.find((c) => c.value === category)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Sub-Category</Label>
              <ReactSelect
                options={subCategoryOptions}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setSubCategory(selectedOption.value);
                  } else {
                    setSubCategory(undefined);
                  }
                }}
                isClearable={true}
                placeholder={"Select..."}
                value={
                  subCategory
                    ? { label: subCategory, value: subCategory }
                    : null
                }
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>
                Language
                <span className="text-red-500">*</span>
              </Label>
              <ReactSelect
                options={languagesOptions}
                isMulti
                onChange={(selectedLang) => {
                  setLanguage(
                    selectedLang
                      ? selectedLang.map((option) => {
                          if (option) {
                            return option.value;
                          }
                          return "";
                        })
                      : []
                  );
                }}
                value={language.map((lang) =>
                  languagesOptions.find((option) => option.value === lang)
                )}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>
                Minimum Age
                <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(v) => {
                  setMinimumAge(parseInt(v));
                }}
                value={`${minimumAge}`}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select minimum age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Allow all age groups</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="13">13</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="21">21</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>
                Version
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={"version"}
                value={metadata.version ?? version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Tags</Label>
              <Textarea placeholder="" />
            </div>
          </AppDetailsRow>

          <div className="w-full flex flex-row justify-end gap-x-4">
            <Button variant="outline">Cancel</Button>
            <Button
              // disabled={isMetaLoading || saving}
              onClick={async () => {
                if (!storage || !sdk) return;

                setSaving(true);

                if (!name && !metadata.name) {
                  toast.message("Name is required");
                  return;
                }
                metadata.name = name;

                if (!description && !metadata.description) {
                  toast.message("Description is required");
                  return;
                }
                metadata.description = description;

                if (!appUrl && !metadata.appUrl) {
                  toast.message("URL is required");
                  return;
                }
                metadata.appUrl = appUrl;

                if (repoUrl) {
                  metadata.repoUrl = repoUrl;
                }

                if (dappId) {
                  metadata.dappId = dappId;
                }

                // if (chainId) {
                //   newMetadata.chainId = chainId;
                // }

                if (contractArr) {
                  metadata.contractAddress = contractArr;
                }

                metadata.allowedCountries = allowedCountries;
                metadata.deniedCountries = deniedCountries;
                if (!category && !metadata.category) {
                  toast.message("Category is required");
                  return;
                }
                metadata.category = category;

                if (subCategory) {
                  metadata.subCategory = subCategory;
                }

                if (!language && !metadata.language) {
                  toast.message("Language is required");
                  return;
                }
                metadata.language = language;
                metadata.minimumAge = minimumAge;

                if (!version && !metadata.version) {
                  toast.message("Version is required");
                  return;
                }
                metadata.version = version;
                if (tags) {
                  metadata.tags = tags;
                }
                setSaving(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
