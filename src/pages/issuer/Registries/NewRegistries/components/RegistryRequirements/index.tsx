/* eslint-disable no-empty-pattern */
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { NavLink, useHistory } from "react-router-dom";
import { zidenIssuerNew, zidenPortal } from "src/client/api";
import { FormTypeMapping, parseLabel } from "src/utils/claim";
import ComparedValue from "./customComponents/ComparedValue";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { schema as zidenSchema } from "@zidendev/zidenjs";
import { useVerifierContext } from "src/context/verifierContext";

//type for requirements
export interface requireType {
  title?: string;
  property: {
    "@id"?: string;
    "@type"?: string;
    name?: string;
  };
  comparator: number;
  comparedValue: Array<any>;
  schema: any;
  allowedIssuer: Array<any>;
  attestation: string;
}
export interface newServiceType {
  serviceName: string;
  requirements: Array<requireType>;
}
export interface requirementsType {
  [index: string]: requireType;
}
//type for all options of each requirements's property
export interface optionType {
  label: string;
  value: string;
  [otherOptions: string]: any;
}
// type for prefetch all opion of each requirements's property
export interface requirementsOptionsType {
  schemaName: Array<optionType>;
  property: Array<optionType>;
  allowedIssuers: Array<optionType>;
  comparator: Array<optionType>;
  comparedValueType: string;
}
export interface requirementType {
  [index: string]: requirementsOptionsType;
}
//type for helper text
export interface helperTextType {
  schemaName: string;
  title: string;
  property: string;
  allowedIssuer: string;
  comparator: string;
  attestation: string;
  comparedValue: string;
}
export interface helperTextsType {
  [index: string]: helperTextType;
}
const RegistryRequirements = ({
  setNewSchemaData,
  newSchemaData,
}: {
  setNewSchemaData?: any;
  newSchemaData?: any;
}) => {
  const [allSchema, setAllSchema] = useState<Array<any>>([]);
  const [requirementOptions, setRequirementOptions] = useState<requirementType>(
    {}
  );
  //helperText for requirements
  const [helperTexts, setHelperTexts] = useState<helperTextsType>({});
  const [loading, setLoading] = useState(false);
  const network = 97;
  const [requirements, setRequirements] = React.useState<requirementsType>({});
  const { isUnlocked, getZidenUserID, keyContainer, userId } =
    useIdWalletContext();
  const { verifierId } = useVerifierContext();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  //fetch data

  const fetchAllSchema = React.useCallback(async () => {
    const res = (await zidenPortal.get("/schemas")).data;
    setAllSchema(
      res?.schemas?.map((schema: any, index: number) => {
        return {
          label: schema.name,
          value: schema,
        };
      })
    );
  }, []);
  //add/remove requirements
  const handleAddRequirements = () => {
    const id = Date.now().toString();
    setRequirements((prev: requirementsType) => {
      return {
        ...prev,
        [id]: {
          property: {},
          comparator: 0,
          comparedValue: [],
          schema: "",
          allowedIssuer: [],
          attestation: "",
        },
      };
    });
    setRequirementOptions((prev: requirementType) => {
      return {
        ...prev,
        [id]: {
          allowedIssuers: [],
          comparator: [],
          property: [],
          schemaName: [],
          comparedValueType: "text",
          title: "",
        },
      };
    });
    setHelperTexts((prev: helperTextsType) => {
      return {
        ...prev,
        [id]: {
          allowedIssuer: "",
          attestation: "",
          comparator: "",
          property: "",
          schemaName: "",
          title: "",
          comparedValue: "",
        },
      };
    });
  };
  const handleRemoveRequirement = (id: string) => {
    const {
      [id]: {},
      ...updatedRequirements
    } = requirements;
    setRequirements(updatedRequirements);
    const {
      [id]: {},
      ...updatedOptions
    } = requirementOptions;
    setRequirementOptions(updatedOptions);
    const {
      [id]: {},
      ...updatedHelperTexts
    } = helperTexts;
    setHelperTexts(updatedHelperTexts);
  };
  //update data in one requirement
  const handleUpdateService = (
    id: string,
    key: keyof requireType,
    value: any
  ) => {
    // console.log(id, "-", key, "-", value);
    setRequirements((prev: requirementsType) => {
      // console.log(prev);
      return {
        ...prev,
        [id]: {
          ...requirements[id],
          [key]: value,
        },
      };
    });
  };
  //update options in one requirement
  const handleUpdateOption = (
    id: string,
    key: keyof requirementsOptionsType,
    value: any
  ) => {
    setRequirementOptions((prev: requirementType) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [key]: value,
        },
      };
    });
  };
  //update Helper text
  const handleUpdateHelperText = (
    id: string,
    key: keyof helperTextType,
    value: any
  ) => {
    setHelperTexts((prev: helperTextsType) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [key]: value,
        },
      };
    });
  };
  //
  const getPropertyData = (object: { [index: string]: any }) => {
    // const propertiesToExclude = ["@name", "@type", "@id", "@context", "@hash"];
    if (object["@hash"]) {
      const {
        "@name": {},
        "@id": {},
        "@hash": {},
        "@required": {},
        ...properties
      } = object;
      return Object.keys(properties);
    } else {
      const {
        "@name": {},
        "@type": {},
        "@id": {},
        "@context": {},
        ...properties
      } = object;
      return Object.keys(properties);
    }
  };
  // fetch options for : property, comarator, allowedIssuer
  const fetchPropertyAndIssuers = async (schema: any, id: string) => {
    handleUpdateOption(id, "property", []);
    handleUpdateOption(id, "allowedIssuers", []);
    //fetch issuer
    const issuerResponse = await zidenPortal.get(
      `/issuers?schemaHashes=${schema.schemaHash}&networks=${network}`
    );
    const jsonSchema = zidenSchema.getInputSchema(
      (await zidenPortal.get(`schemas/${schema.hash}`)).data?.schema?.jsonSchema
    );
    handleUpdateOption(
      id,
      "property",
      getPropertyData(jsonSchema)
        .map((prop: any) => {
          return {
            label: parseLabel(prop),
            value: { ...jsonSchema[prop], name: prop },
          };
        })
        .filter((item) => {
          //filter out props with object type
          return item?.value["@type"] !== "std:obj";
        })
    );
    handleUpdateOption(
      id,
      "allowedIssuers",
      issuerResponse.data?.issuers?.map((issuer: any, index: number) => {
        return {
          label: issuer["name"] || issuer["endpointUrl"],
          value: issuer["issuerId"],
        };
      })
    );
  };
  const getComparatorAndValueType = (propertyType: string) => {
    let checkValue = propertyType;
    if (checkValue.startsWith("std:")) {
      checkValue = checkValue.split(":")[1];
    }
    switch (checkValue) {
      case "str":
        return {
          methods: [
            {
              label: "Existed",
              value: 0,
            },
            {
              label: "Matching",
              value: 1,
            },
            {
              label: "Membership",
              value: 4,
            },
            {
              label: "Non-Membership",
              value: 5,
            },
          ],
          valueType: FormTypeMapping(checkValue), // map server type to input element type
        };
      case "number":
      case "int32":
      case "int":
      case "date":
        return {
          methods: [
            {
              label: "Existed",
              value: 0,
            },
            {
              label: "Matching",
              value: 1,
            },
            {
              label: "Upper bound",
              value: 2,
            },
            {
              label: "Lower bound",
              value: 3,
            },
            {
              label: "Membership",
              value: 4,
            },
            {
              label: "Non-Membership",
              value: 5,
            },
            {
              label: "Range Check",
              value: 6,
            },
          ],
          valueType: FormTypeMapping(checkValue), // map server type to input element type
        };
      case "bool":
        return {
          methods: [
            {
              label: "Existed",
              value: 0,
            },
            {
              label: "Matching",
              value: 1,
            },
          ],
          valueType: FormTypeMapping(checkValue), // map server type to input element type
        };
      default:
        return {
          methods: [
            {
              label: "Existed",
              value: 0,
            },
          ],
          valueType: FormTypeMapping(checkValue), // map server type to input element type
        };
    }
  };
  //handle user actions
  const handleSelectedSchema = async (e: any, id: string) => {
    setRequirements((prev: requirementsType) => {
      return {
        ...prev,
        [id]: {
          property: {},
          comparator: 0,
          comparedValue: [],
          schema: e.target.value,
          allowedIssuer: [],
          attestation: "",
          title: "",
        },
      };
    });
    fetchPropertyAndIssuers(e.target.value, id);
  };
  const handleSelectedProperty = (e: any, requirementId: string) => {
    handleUpdateService(requirementId, "property", e.target.value);
    const { methods, valueType } = getComparatorAndValueType(
      e.target.value["@type"] || ""
    );
    handleUpdateOption(requirementId, "comparator", methods);
    handleUpdateOption(requirementId, "comparedValueType", valueType);
  };

  const handleConfirm = async () => {
    if (isUnlocked) {
      try {
        let req: Array<any> = [];
        for (const requirementId of Object.keys(requirements)) {
          if (!requirements[requirementId]["schema"].name) {
            handleUpdateHelperText(
              requirementId,
              "schemaName",
              "Schema name is empty!"
            );
            return;
          }
          handleUpdateHelperText(requirementId, "schemaName", "");
          if (!requirements[requirementId]["title"]) {
            handleUpdateHelperText(requirementId, "title", "Title is empty!");
            return;
          }
          handleUpdateHelperText(requirementId, "title", "");
          if (requirements[requirementId]["allowedIssuer"].length === 0) {
            handleUpdateHelperText(
              requirementId,
              "allowedIssuer",
              "Allowed Issuers is empty!"
            );
            return;
          }
          handleUpdateHelperText(requirementId, "allowedIssuer", "");
          if (!requirements[requirementId]["property"]) {
            handleUpdateHelperText(
              requirementId,
              "property",
              "Property is empty!"
            );
            return;
          }
          handleUpdateHelperText(requirementId, "property", "");
          if (
            !requirements[requirementId]["comparator"] &&
            requirements[requirementId]["comparator"] !== 0
          ) {
            handleUpdateHelperText(
              requirementId,
              "comparator",
              "Comparator is empty!"
            );
            return;
          }
          handleUpdateHelperText(requirementId, "comparator", "");
          if (
            requirements[requirementId]["comparedValue"].length === 0 &&
            requirements[requirementId]["comparator"] !== 0
          ) {
            handleUpdateHelperText(
              requirementId,
              "comparedValue",
              "Compared value is empty!"
            );
            return;
          }
          if (
            requirements[requirementId]["comparator"] === 6 &&
            requirements[requirementId]["comparedValue"][0] >
              requirements[requirementId]["comparedValue"][1]
          ) {
            handleUpdateHelperText(
              requirementId,
              "comparedValue",
              "Second value must be greater than first values!"
            );
            return;
          }
          handleUpdateHelperText(requirementId, "comparedValue", "");
          if (!requirements[requirementId]["attestation"]) {
            handleUpdateHelperText(
              requirementId,
              "attestation",
              "Attestation is empty!"
            );
            return;
          }
          handleUpdateHelperText(requirementId, "attestation", "");
        }
        const jwz = keyContainer.db.get("issuer-jwz");
        const issuerId = await getZidenUserID();
        if (Object.values(requirements).length > 0) {
          req = Object.values(requirements).map(
            (requirement: requireType, index: number) => {
              return {
                title: requirement.title,
                attestation: requirement.attestation || "",
                allowedIssuers:
                  requirement.allowedIssuer.map((issuer) => issuer.value) || [],
                schemaHash: requirement.schema.hash || "",
                circuitId: "credentialAtomicQueryMTP",
                query: {
                  propertyName: requirement.property.name || "",
                  operator: requirement.comparator,
                  value: requirement.comparedValue,
                },
              };
            }
          );
        }
        await zidenIssuerNew.post(
          "/registries",
          {
            schemaHash: newSchemaData["schemaHash"],
            issuerId: issuerId,
            description: newSchemaData.registry?.description,
            expiration: 0,
            updatetable: false,
            networkId: 97,
            endpointUrl: newSchemaData.registry?.endpointUrl,
            requirements: req,
          },
          {
            headers: {
              Authorization: jwz,
            },
          }
        );
        enqueueSnackbar("Add registry success", {
          variant: "success",
        });
        history.push("/issuer/registries");
      } catch (error) {
        enqueueSnackbar("Add registry failed", {
          variant: "error",
        });
      }
    }
  };
  //   const popupMissingInfo = (info: string) => {
  //     enqueueSnackbar(`${info} is missing!`, {
  //       autoHideDuration: 1000,
  //       variant: "warning",
  //     });
  //   };
  //verify wallet id and jwz
  React.useEffect(() => {
    if (!isUnlocked) {
      history.push("/verifier/profile/signin");
    }
  }, [isUnlocked, history]);
  //fetch data
  React.useEffect(() => {
    fetchAllSchema();
  }, [fetchAllSchema]);
  React.useEffect(() => {
    if (userId !== verifierId) {
      history.push("/verifier/services");
    }
  }, [history, userId, verifierId]);
  return (
    <Box>
      {/* <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="Service Name"
                required
                onChange={(e) => {
                  setServicename(e.target.value);
                }}
                value={serviceName || ""}
                helperText={helperText1}
              />
            </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TextField
              fullWidth
              label="Description"
              required
              sx={{ mt: 1 }}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description || ""}
              helperText={helperText3}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TextField
              select
              sx={{ mt: 1 }}
              fullWidth
              label="Network"
              required
              value={network || ""}
              onChange={(e) => {
                setNetwork(e.target.value);
              }}
              helperText={helperText2}
            >
              {allNetwork.map((item: any, index: number) => {
                return (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid> */}
      <Typography variant="h3" pb={2}>
        Requirements
      </Typography>
      {Object.keys(requirements).map((requirementId: string, index: number) => {
        return (
          <Box
            sx={{
              p: 3,
              pt: 6,
              borderRadius: 3,
              border: "1px solid #0000001F",
              position: "relative",
              mb: 3,
            }}
            key={requirementId}
          >
            <Box>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  p: 0.5,
                }}
                onClick={() => {
                  handleRemoveRequirement(requirementId);
                }}
              >
                <CloseIcon
                  sx={{
                    color: "#646A71",
                    fontSize: "1.4rem",
                  }}
                />
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  select
                  sx={{ my: 1 }}
                  fullWidth
                  label="Schema name"
                  required
                  onChange={(e) => {
                    handleSelectedSchema(e, requirementId);
                  }}
                  value={requirements[requirementId]?.schema || ""}
                  helperText={helperTexts[requirementId].schemaName}
                >
                  {allSchema.map((item: any, index: number) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
                {requirements[requirementId]?.schema && (
                  <TextField
                    select
                    sx={{ my: 1 }}
                    fullWidth
                    label="Property"
                    required
                    value={requirements[requirementId]?.property || ""}
                    onChange={(e) => {
                      handleSelectedProperty(e, requirementId);
                    }}
                    helperText={helperTexts[requirementId].property}
                  >
                    {requirementOptions[requirementId]?.property.map(
                      (item: any, index: number) => {
                        return (
                          <MenuItem key={index} value={item.value}>
                            {item.label}
                          </MenuItem>
                        );
                      }
                    )}
                    {requirementOptions[requirementId]?.property.length ===
                      0 && (
                      <Box>
                        <Typography pl={2}>Loading...</Typography>
                      </Box>
                    )}
                  </TextField>
                )}
                {requirements[requirementId]?.schema &&
                  requirements[requirementId]?.property?.name && (
                    <TextField
                      select
                      sx={{ my: 1 }}
                      fullWidth
                      label="Comparator"
                      required
                      value={requirements[requirementId]?.comparator}
                      onChange={(e) => {
                        handleUpdateService(
                          requirementId,
                          "comparator",
                          e.target.value
                        );
                      }}
                      helperText={helperTexts[requirementId].comparator}
                    >
                      {requirementOptions[requirementId].comparator?.map(
                        (item: any, index: number) => {
                          return (
                            <MenuItem key={index} value={item.value}>
                              {item.label}
                            </MenuItem>
                          );
                        }
                      )}
                    </TextField>
                  )}
                {requirements[requirementId]?.schema &&
                  requirements[requirementId]?.property &&
                  requirements[requirementId]?.comparator !== 0 && (
                    <ComparedValue
                      key={
                        requirements[requirementId]?.comparator +
                        (requirements[requirementId]?.property["@id"] || "")
                      }
                      comparator={requirements[requirementId]?.comparator}
                      type={requirementOptions[requirementId].comparedValueType}
                      handleSetValue={(value: any) => {
                        handleUpdateService(
                          requirementId,
                          "comparedValue",
                          value
                        );
                      }}
                      helperText={helperTexts[requirementId].comparedValue}
                    />
                  )}
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  sx={{ my: 1 }}
                  fullWidth
                  label="Title"
                  value={requirements[requirementId]?.title || ""}
                  onChange={(e) => {
                    handleUpdateService(requirementId, "title", e.target.value);
                  }}
                  helperText={helperTexts[requirementId].title}
                />
                {requirements[requirementId]?.schema && (
                  <Autocomplete
                    key={requirements[requirementId]?.schema._id}
                    multiple
                    sx={{ my: 1 }}
                    limitTags={3}
                    options={requirementOptions[requirementId]?.allowedIssuers}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(a, b) => {
                      return a.value === b.value;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={helperTexts[requirementId].allowedIssuer}
                        label="Allowed issuers"
                      />
                    )}
                    onChange={(e, newValue) => {
                      handleUpdateService(
                        requirementId,
                        "allowedIssuer",
                        newValue
                      );
                    }}
                    loading={
                      requirementOptions[requirementId]?.allowedIssuers
                        .length === 0
                    }
                  />
                )}
                <TextField
                  sx={{ my: 1 }}
                  fullWidth
                  label="Attestation"
                  multiline
                  rows={4}
                  value={requirements[requirementId]?.attestation || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    handleUpdateService(
                      requirementId,
                      "attestation",
                      e.target.value
                    );
                  }}
                  helperText={helperTexts[requirementId].attestation}
                />
              </Grid>
            </Grid>
          </Box>
        );
      })}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Button
          onClick={handleAddRequirements}
          variant="contained"
          color="secondary"
        >
          Add requirement
        </Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <NavLink
          to="/verifier/services"
          style={{
            textDecoration: "none",
          }}
        >
          <Button variant="outlined">Cancel</Button>
        </NavLink>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={() => {
            handleConfirm();
          }}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};
export default RegistryRequirements;
