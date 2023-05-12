import * as dappSchema from "@merokudao/dapp-store-registry/dist/main/schemas/merokuDappStore.dAppSchema.json";
import addFormats from "ajv-formats";
import Ajv2019 from "ajv/dist/2019";

/**
 * A Class that performs data validation on the dapp data
 */
export class AppDataValidator {
  // The schema for the data
  private readonly schema: any = AppDataValidator.schemaFromRegistryPackage();
  // The name of the schema
  private readonly schema_name = "dAppSchema";

  public static schemaFromRegistryPackage(): any {
    if (dappSchema) {
      return dappSchema;
    }
  }

  public validate(data: any): [boolean, string] {
    const ajv = new Ajv2019({
      strict: false,
    });
    addFormats(ajv);
    ajv.addSchema(this.schema, this.schema_name);
    ajv.addFormat("url", /^https?:\/\/.+/);
    const validate = ajv.compile(this.schema);
    const valid = validate(data);
    return [valid, JSON.stringify(validate.errors)];
  }
}
