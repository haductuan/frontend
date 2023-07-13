/* eslint-disable no-empty-pattern */
import {
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";

//icon
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { parseLabel } from "src/utils/claim";
import { useIssuerContext } from "src/context/issuerContext";
import { LoadingButton } from "@mui/lab";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useIdWalletContext } from "src/context/identity-wallet-context";
//const
const baseTypes = [
  {
    label: "standard:str",
    value: "std:str",
  },
  {
    label: "standard:int64",
    value: "std:int64",
  },
  {
    label: "standard:double",
    value: "std:double",
  },
  {
    label: "standard:object",
    value: "std:obj",
  },
  {
    label: "standard:bool",
    value: "std:bool",
  },
  {
    label: "standard:date",
    value: "std:date",
  },
];
const slotIndex = [
  {
    label: "std-pos:idx-1",
    value: "std-pos:idx-1",
  },
  {
    label: "std-pos:idx-2",
    value: "std-pos:idx-2",
  },
  {
    label: "std-pos:val-1",
    value: "std-pos:val-1",
  },
  {
    label: "std-pos:val-2",
    value: "std-pos:val-2",
  },
];
const namingConvert = (code: string) => {
  switch (code) {
    case "std":
      return "standard";
    case "cc3166":
      return "country-code-iso-3166";
    case "usid":
      return "us-document-id";
    case "fips":
      return "us-fips-subdivision-code";
    case "zc":
      return "ziden-general-context";
    default:
      return "standard";
  }
};
const convertContextName = (name: string) => {
  return namingConvert(name.split(":")[0]) + ":" + [name.split(":")[1]];
};
const allContext = [
  {
    label: "country-code-iso-3166",
    value:
      "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/contexts/country-code-iso-3166.json",
  },
  {
    label: "us-document-id",
    value:
      "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/contexts/us-document-id.json",
  },
  {
    label: "us-fips-subdivision-code",
    value:
      "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/contexts/us-fips-subdivision-code.json",
  },
  {
    label: "ziden-general-context",
    value:
      "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/contexts/ziden-general-context.json",
  },
];

const SchemaDetailV2 = ({
  setActiveStep,
  setNewSchemaData,
  newSchemaData,
}: {
  setActiveStep?: any;
  setNewSchemaData?: any;
  newSchemaData?: any;
}) => {
  const [schemaOptions, setSchemaOptions] = React.useState([
    {
      label: "KYC registration",
      value:
        "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/schemas/kyc-registry.json",
    },
    {
      label: "Basic course certificate",
      value:
        "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/schemas/basic-course-certificate.json",
    },
    {
      label: "Basic membership",
      value:
        "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/schemas/basic-membership.json",
    },
    {
      label: "KYC Form",
      value:
        "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/schemas/kyc-registry.json",
    },
    {
      label: "US Identity Docment",
      value:
        "https://raw.githubusercontent.com/ziden-dev/schema-models/main/json/schemas/us-identity-document.json",
    },
  ]);
  const [selectedSchema, setSelectedSchema] = useState<string>();
  // const [schema, setSchema] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [schemaMetaData, setSchemaMetaData] = useState<any>();
  const [properties, setProperties] = useState<Array<any>>([]);
  const [contexts, setContexts] = React.useState<Array<any>>([]);
  const [dataTypes, setDataTypes] = React.useState<Array<any>>(baseTypes);
  const { endpointUrl } = useIssuerContext();
  const { keyContainer } = useIdWalletContext();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  //get props of context/schema
  const getPropertyData = (object: { [index: string]: any }) => {
    // const propertiesToExclude = ["@name", "@type", "@id", "@context", "@hash"];
    if (object["@hash"]) {
      const {
        "@name": {},
        "@type": {},
        "@id": {},
        "@context": {},
        "@hash": {},
        "@required": {},
        ...properties
      } = object;
      return properties;
    } else {
      const {
        "@name": {},
        "@type": {},
        "@id": {},
        "@context": {},
        ...properties
      } = object;
      return properties;
    }
  };
  //get sub props of schema
  const getSubPropertyData = (object: { [index: string]: any }) => {
    if (object["@id"] !== undefined) {
      const {
        "@type": {},
        "@id": {},
        ...properties
      } = object;
      return properties;
    } else {
      const {
        "@type": {},
        ...properties
      } = object;
      return properties;
    }
  };
  const fetchDataContent = React.useCallback(async (url: string) => {
    const res = await axios.get(url);
    return {
      id: res.data["@id"],
      name: res.data["@name"],
      uri: url,
      subContext: res.data["@context"],
      type: res.data["@type"],
      properties: getPropertyData(res.data),
    };
  }, []);
  const fetchContextOption = React.useCallback(
    async (contextUri: string) => {
      const contextData = await fetchDataContent(contextUri);
      const contextId = contextData.id;
      return Object.keys(contextData.properties).map((key: any) => {
        return {
          label: convertContextName(`${contextId}:${key}`),
          value: `${contextId}:${key}`,
        };
      });
    },
    [fetchDataContent]
  );

  const handleSelectedSchema = async (schemaData: any) => {
    // const schemaData = await axios.get(schemaData);
    setProperties(
      Object.keys(getPropertyData(schemaData)).map((item: any) => {
        return {
          name: item,
          value: schemaData[item],
          subProps: [], // need check
        };
      })
    );
    setContexts(
      allContext.filter((context) => {
        return schemaData["@context"].includes(context.value);
      })
    );
    // setSchemaMetaData(schemaData.data);
    setSchemaMetaData({
      "@context": schemaData["@context"],
      "@id": schemaData["@id"],
      "@name": schemaData["@name"],
      "@type": schemaData["@type"],
      "@hash": schemaData["@hash"],
    });
  };
  //update prop and type
  const handleAddProperty = () => {
    setProperties((prev: Array<any>) => {
      return [
        ...prev,
        {
          name: "",
          value: {
            "@id": "",
            "@type": "std:str",
          },
          subProps: [],
        },
      ];
    });
  };
  const handleAddIndexProperty = () => {
    setProperties((prev: Array<any>) => {
      return [
        ...prev,
        {
          name: "",
          value: {
            "@id": "std-pos:idx-1",
            "@type": "std:str",
          },
          subProps: [],
        },
      ];
    });
  };
  const handleAddValueProperty = () => {
    setProperties((prev: Array<any>) => {
      return [
        ...prev,
        {
          name: "",
          value: {
            "@id": "std-pos:val-1",
            "@type": "std:str",
          },
          subProps: [],
        },
      ];
    });
  };
  const handleRemoveProperty = (removeIndex: number) => {
    setProperties((prev: Array<any>) => {
      return prev.filter((item: any, index: number) => {
        return index !== removeIndex;
      });
    });
  };
  const handleChangePropType = (index: number, newValue: string) => {
    setProperties((prev: Array<any>) => {
      // const name = prev[index].name;
      const id = newValue === "std:obj" ? "none" : prev[index].value["@id"];
      let temp = prev.slice();
      temp[index].value = {
        "@id": id,
        "@type": newValue,
      };
      if (newValue !== "std:obj") {
        temp[index].subProps = [];
      }
      return temp;
    });
  };
  const handleChangeIndexPropType = (index: number, newValue: string) => {
    setProperties((prev: Array<any>) => {
      // const name = prev[index].name;
      const id =
        newValue === "std:obj" ? "std-pos:idx" : prev[index].value["@id"];
      let temp = prev.slice();
      temp[index].value = {
        "@id": id,
        "@type": newValue,
      };
      if (newValue !== "std:obj") {
        temp[index].subProps = [];
      }
      return temp;
    });
  };
  const handleChangeValuePropType = (index: number, newValue: string) => {
    setProperties((prev: Array<any>) => {
      // const name = prev[index].name;
      const id =
        newValue === "std:obj" ? "std-pos:val" : prev[index].value["@id"];
      let temp = prev.slice();
      temp[index].value = {
        "@id": id,
        "@type": newValue,
      };
      if (newValue !== "std:obj") {
        temp[index].subProps = [];
      }
      return temp;
    });
  };
  const handleChangePropName = (index: number, newName: string) => {
    setProperties((prev: Array<any>) => {
      let temp = prev.slice();
      temp[index].name = newName;
      return temp;
    });
  };
  const handleChangeSlotIndex = (index: number, newSlotId: string) => {
    setProperties((prev: Array<any>) => {
      const name = prev[index].name;
      let temp = prev.slice();
      temp[index] = {
        name: name,
        value: {
          ...temp[index].value,
          "@id": newSlotId,
        },
      };
      return temp;
    });
  };
  //update subprop and type
  const handleAddSubProp = (index: number) => {
    setProperties((prev: Array<any>) => {
      // const value = prev[index].value;
      // const name = prev[index].name;
      let temp = prev.slice();
      const count = temp[index].subProps?.length;
      temp[index].subProps?.push({
        name: `subProperty${count + 1}`,
        id: "",
        type: "",
      });
      return temp;
    });
  };

  const handleRemoveSubProp = (index: number, subIndex: number) => {
    setProperties((prev: Array<any>) => {
      let temp = prev.slice();
      temp[index].subProps = temp[index].subProps.filter(
        (item: any, subItemIndex: number) => {
          return subItemIndex !== subIndex;
        }
      );
      return temp;
    });
  };
  const handleUpdateSubPropsType = (
    index: number,
    subIndex: number,
    value: any
  ) => {
    setProperties((prev: Array<any>) => {
      let temp = prev.slice();
      temp[index].subProps[subIndex]["type"] = value;
      return temp;
    });
  };
  const handleChangeSubPropsName = (
    index: number,
    subIndex: number,
    value: any
  ) => {
    setProperties((prev: Array<any>) => {
      let temp = prev.slice();
      temp[index].subProps[subIndex]["name"] = value;
      return temp;
    });
  };
  const handleChangeSubPropsIndex = (
    index: number,
    subIndex: number,
    value: any
  ) => {
    setProperties((prev: Array<any>) => {
      let temp = prev.slice();
      temp[index].subProps[subIndex]["id"] = value;
      return temp;
    });
  };
  const handleConfirm = async () => {
    let jsonData = {
      ...schemaMetaData,
      "@context": contexts,
    };
    for (const i of properties) {
      if (i["subProps"]?.length === 0) {
        jsonData[i["name"]] = i["value"];
      } else {
        jsonData[i["name"]] = i["value"];
        for (const j of i["subProps"]) {
          jsonData[i["name"]][j["name"]] = {
            "@type": j["type"],
            "@id": j["id"],
          };
        }
      }
    }
    console.log("Generated json: ", jsonData);
  };
  const handleSubmit = async () => {
    const jwz = keyContainer.db.get("issuer-jwz");
    setLoading(true);
    try {
      await axios.post(
        `${endpointUrl}/registries`,
        {
          schemaHash: schemaMetaData["@hash"],
          issuerId: newSchemaData?.registry?.issuerId,
          description: newSchemaData?.registry?.description,
          expiration: parseInt(newSchemaData?.registry?.expiration),
          updatetable: newSchemaData?.registry?.updatable,
          networkId: newSchemaData?.registry?.network,
          endpointUrl: newSchemaData?.registry?.endpointUrl,
        },
        {
          headers: {
            Authorization: `${jwz}`,
          },
        }
      );
      enqueueSnackbar("Success!", {
        autoHideDuration: 1500,
        variant: "success",
      });
      history.push("/issuer/schemas");
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    const fetchAllTemplate = async () => {
      const allTemplate = (await axios.get(`${endpointUrl}/schemas`)).data;
      setSchemaOptions(
        allTemplate?.map((template: any, index: number) => {
          return {
            label: template["@name"] || "",
            value: template,
          };
        })
      );
    };
    fetchAllTemplate();
  }, [endpointUrl]);

  React.useEffect(() => {
    const fetchAllType = async () => {
      if (contexts.length > 0) {
        const allContextRes = contexts
          .map((item) => item.value)
          .map((context: any, index: number) => {
            return fetchContextOption(context);
          });
        Promise.allSettled(allContextRes).then((res) => {
          const allOptions = res
            .map((item: any) => item.value)
            .reduce((a, b) => {
              return a.concat(b);
            });
          setDataTypes([...baseTypes, ...allOptions]);
        });
      } else {
        setDataTypes(baseTypes);
      }
    };
    fetchAllType();
  }, [contexts, fetchContextOption]);
  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
        }}
      >
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            fullWidth
            label="Select schema"
            select
            value={selectedSchema || ""}
            onChange={(e) => {
              setSelectedSchema(e.target.value);
              handleSelectedSchema(e.target.value);
            }}
          >
            {schemaOptions &&
              schemaOptions.map((schema: any, index: number) => {
                return (
                  <MenuItem key={index} value={schema.value}>
                    {schema.label}
                  </MenuItem>
                );
              })}
          </TextField>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
        }}
      >
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            disabled
            fullWidth
            label="Schema Name"
            value={(schemaMetaData && schemaMetaData["@name"]) || ""}
            onChange={(e) => {
              setSchemaMetaData((prev: any) => {
                return {
                  ...prev,
                  "@name": e.target.value,
                };
              });
            }}
          />
        </Grid>
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <Autocomplete
            disabled
            key={selectedSchema}
            multiple
            limitTags={3}
            options={allContext}
            value={contexts}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(a, b) => {
              return a.value === b.value;
            }}
            renderInput={(params) => <TextField {...params} label="Contexts" />}
            onChange={(e, newValue) => {
              setContexts(newValue);
            }}
          />
        </Grid>
      </Grid>
      <Box
      // sx={{
      //   mt: 5,
      // }}
      >
        {properties?.map((property: any, index: number) => {
          if (property?.value["@id"].startsWith("std-pos:idx")) {
            return (
              <Grid
                item
                xs={12}
                key={index}
                sx={{
                  mb: 2,
                }}
              >
                <Grid container spacing={2}>
                  {/* <Grid item xs={2} xsm={2} md={1} lg={1}>
                    <TextField
                      select
                      value={property?.value["@id"] || "none"}
                      fullWidth
                      label={`ID`}
                      onChange={(e) => {
                        handleChangeSlotIndex(index, e.target.value);
                      }}
                      disabled={property.value["@type"] === "std:obj"}
                    >
                      {slotIndex.map((item: any, index: number) => {
                        return (
                          <MenuItem key={index} value={item.value}>
                            {item.label}
                          </MenuItem>
                        );
                      })}
                      <MenuItem value={"none"} sx={{ display: "none" }}>
                        None
                      </MenuItem>
                    </TextField>
                  </Grid> */}
                  <Grid item xs={12} xsm={12} md={6} lg={6}>
                    <TextField
                      disabled
                      value={parseLabel(property.name)}
                      fullWidth
                      label={`Property name`}
                      onChange={(e) => {
                        handleChangePropName(index, e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} xsm={12} md={6} lg={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          md: "row",
                        },
                        alignItems: {
                          xs: "flex-end",
                          md: "center",
                        },
                      }}
                    >
                      {" "}
                      <TextField
                        disabled
                        fullWidth
                        select
                        label={`Type`}
                        value={property?.value["@type"] || ""}
                        onChange={(e) => {
                          handleChangeIndexPropType(index, e.target.value);
                        }}
                      >
                        {dataTypes.map((type: any, index: number) => {
                          return (
                            <MenuItem key={index} value={type.value}>
                              {type.label}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          ml: 1.5,
                          py: 1,
                          minWidth: "92px",
                        }}
                      >
                        <Tooltip title="Add sub property">
                          <Button
                            sx={{
                              minWidth: "0px",
                              width: "34px",
                              minHeight: "0px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor: "#FEF7F2",
                              color: "#F7A088",
                              ml: 1.5,
                              display:
                                property.value["@type"] === "std:obj"
                                  ? "auto"
                                  : "none",
                            }}
                            onClick={() => {
                              handleAddSubProp(index);
                            }}
                          >
                            <AddOutlinedIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Remove current property">
                          <Button
                            sx={{
                              minWidth: "0px",
                              width: "34px",
                              minHeight: "0px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor: "#FEF7F2",
                              color: "#F7A088",
                              ml: 1.5,
                            }}
                            onClick={() => {
                              handleRemoveProperty(index);
                            }}
                          >
                            <RemoveOutlinedIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                {property?.subProps?.length > 0 && (
                  <Box
                    sx={{
                      backgroundColor: "#EFEFEF",
                      boxShadow: "inset 0px -1px 6px #00000029",
                      mt: 2,
                      p: {
                        xs: 2,
                        xsm: 2,
                        md: 3,
                        lg: 5,
                      },
                      borderBottomLeftRadius: "16px",
                      borderBottomRightRadius: "16px",
                    }}
                  >
                    <Grid container spacing={2}>
                      {property?.subProps?.map(
                        (subProp: any, subIndex: number) => {
                          return (
                            <React.Fragment key={subIndex}>
                              <Grid item xs={2} xsm={2} md={1} lg={1}>
                                <TextField
                                  disabled
                                  select
                                  fullWidth
                                  label={`Sub ID`}
                                  onChange={(e) => {
                                    handleChangeSubPropsIndex(
                                      index,
                                      subIndex,
                                      e.target.value
                                    );
                                  }}
                                  value={subProp.id}
                                  // disabled={property.value["@type"] === "std:obj"}
                                >
                                  {slotIndex.map((item: any, index: number) => {
                                    return (
                                      <MenuItem key={index} value={item.value}>
                                        {item.label}
                                      </MenuItem>
                                    );
                                  })}
                                  <MenuItem
                                    value={"none"}
                                    sx={{ display: "none" }}
                                  >
                                    None
                                  </MenuItem>
                                </TextField>
                              </Grid>
                              <Grid item xs={10} xsm={10} md={5} lg={5}>
                                <TextField
                                  disabled
                                  fullWidth
                                  label={`Property ${index + 1}.${
                                    subIndex + 1
                                  }`}
                                  onChange={(e) => {
                                    handleChangeSubPropsName(
                                      index,
                                      subIndex,
                                      e.target.value
                                    );
                                  }}
                                  value={subProp.name || ""}
                                />
                              </Grid>
                              <Grid item xs={12} xsm={12} md={6} lg={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: {
                                      xs: "column",
                                      md: "row",
                                    },
                                    alignItems: {
                                      xs: "flex-end",
                                      md: "center",
                                    },
                                  }}
                                >
                                  <TextField
                                    disabled
                                    select
                                    fullWidth
                                    label="Type"
                                    onChange={(e) => {
                                      handleUpdateSubPropsType(
                                        index,
                                        subIndex,
                                        e.target.value
                                      );
                                    }}
                                    value={subProp["type"] || ""}
                                  >
                                    {dataTypes
                                      .filter((item) => {
                                        // remove object type on sub properties
                                        return item.value !== "std:obj";
                                      })
                                      .map((type: any, index: number) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={type.value}
                                          >
                                            {type.label}
                                          </MenuItem>
                                        );
                                      })}
                                  </TextField>
                                  <Tooltip title="Remove current sub property">
                                    <Button
                                      sx={{
                                        minWidth: "0px",
                                        width: "34px",
                                        minHeight: "0px",
                                        height: "34px",
                                        borderRadius: "50%",
                                        backgroundColor: "#FEF7F2",
                                        color: "#F7A088",
                                        mr: {
                                          xs: 0,
                                          xsm: 0,
                                          md: 3,
                                          lg: 1,
                                        },
                                        ml: 3,
                                        mt: 1,
                                        mb: {
                                          xs: 0,
                                          xsm: 1,
                                        },
                                      }}
                                      onClick={() => {
                                        handleRemoveSubProp(index, subIndex);
                                      }}
                                    >
                                      <RemoveOutlinedIcon />
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </Grid>
                            </React.Fragment>
                          );
                        }
                      )}
                    </Grid>
                  </Box>
                )}
              </Grid>
            );
          }
        })}
        {/* {properties?.length > 0 && (
          <Box sx={{ py: 1 }}>
            <Button
               
              variant="contained"
              color="secondary"
              onClick={handleAddIndexProperty}
              sx={{
                width: {
                  xs: "100%",
                  xsm: "auto",
                },
              }}
            >
              Add index property
            </Button>
          </Box>
        )} */}
      </Box>
      <Box
      // sx={{
      //   mt: 5,
      // }}
      >
        {properties?.map((property: any, index: number) => {
          if (property?.value["@id"].startsWith("std-pos:val")) {
            return (
              <Grid
                item
                xs={12}
                key={index}
                sx={{
                  mb: 2,
                }}
              >
                <Grid container spacing={2}>
                  {/* <Grid item xs={2} xsm={2} md={1} lg={1}>
                    <TextField
                      select
                      value={property?.value["@id"] || "none"}
                      fullWidth
                      label={`ID`}
                      onChange={(e) => {
                        handleChangeSlotIndex(index, e.target.value);
                      }}
                      disabled={property.value["@type"] === "std:obj"}
                    >
                      {slotIndex.map((item: any, index: number) => {
                        return (
                          <MenuItem key={index} value={item.value}>
                            {item.label}
                          </MenuItem>
                        );
                      })}
                      <MenuItem value={"none"} sx={{ display: "none" }}>
                        None
                      </MenuItem>
                    </TextField>
                  </Grid> */}
                  <Grid item xs={12} xsm={12} md={6} lg={6}>
                    <TextField
                      disabled
                      value={parseLabel(property.name)}
                      fullWidth
                      label={`Property name`}
                      onChange={(e) => {
                        handleChangePropName(index, e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} xsm={12} md={6} lg={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          md: "row",
                        },
                        alignItems: {
                          xs: "flex-end",
                          md: "center",
                        },
                      }}
                    >
                      {" "}
                      <TextField
                        disabled
                        fullWidth
                        select
                        label={`Type`}
                        value={property?.value["@type"] || ""}
                        onChange={(e) => {
                          handleChangeValuePropType(index, e.target.value);
                        }}
                      >
                        {dataTypes.map((type: any, index: number) => {
                          return (
                            <MenuItem key={index} value={type.value}>
                              {type.label}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          ml: 1.5,
                          py: 1,
                          minWidth: "92px",
                        }}
                      >
                        <Tooltip title="Add sub property">
                          <Button
                            sx={{
                              minWidth: "0px",
                              width: "34px",
                              minHeight: "0px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor: "#FEF7F2",
                              color: "#F7A088",
                              ml: 1.5,
                              display:
                                property.value["@type"] === "std:obj"
                                  ? "auto"
                                  : "none",
                            }}
                            onClick={() => {
                              handleAddSubProp(index);
                            }}
                          >
                            <AddOutlinedIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Remove current property">
                          <Button
                            sx={{
                              minWidth: "0px",
                              width: "34px",
                              minHeight: "0px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor: "#FEF7F2",
                              color: "#F7A088",
                              ml: 1.5,
                            }}
                            onClick={() => {
                              handleRemoveProperty(index);
                            }}
                          >
                            <RemoveOutlinedIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                {property?.subProps?.length > 0 && (
                  <Box
                    sx={{
                      backgroundColor: "#EFEFEF",
                      boxShadow: "inset 0px -1px 6px #00000029",
                      mt: 2,
                      p: {
                        xs: 2,
                        xsm: 2,
                        md: 3,
                        lg: 5,
                      },
                      borderBottomLeftRadius: "16px",
                      borderBottomRightRadius: "16px",
                    }}
                  >
                    <Grid container spacing={2}>
                      {property?.subProps?.map(
                        (subProp: any, subIndex: number) => {
                          return (
                            <React.Fragment key={subIndex}>
                              <Grid item xs={2} xsm={2} md={1} lg={1}>
                                <TextField
                                  disabled
                                  select
                                  fullWidth
                                  label={`Sub ID`}
                                  onChange={(e) => {
                                    handleChangeSubPropsIndex(
                                      index,
                                      subIndex,
                                      e.target.value
                                    );
                                  }}
                                  value={subProp.id}
                                  // disabled={property.value["@type"] === "std:obj"}
                                >
                                  {slotIndex.map((item: any, index: number) => {
                                    return (
                                      <MenuItem key={index} value={item.value}>
                                        {item.label}
                                      </MenuItem>
                                    );
                                  })}
                                  <MenuItem
                                    value={"none"}
                                    sx={{ display: "none" }}
                                  >
                                    None
                                  </MenuItem>
                                </TextField>
                              </Grid>
                              <Grid item xs={10} xsm={10} md={5} lg={5}>
                                <TextField
                                  disabled
                                  fullWidth
                                  label={`Property ${index + 1}.${
                                    subIndex + 1
                                  }`}
                                  onChange={(e) => {
                                    handleChangeSubPropsName(
                                      index,
                                      subIndex,
                                      e.target.value
                                    );
                                  }}
                                  value={subProp.name || ""}
                                />
                              </Grid>
                              <Grid item xs={12} xsm={12} md={6} lg={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: {
                                      xs: "column",
                                      md: "row",
                                    },
                                    alignItems: {
                                      xs: "flex-end",
                                      md: "center",
                                    },
                                  }}
                                >
                                  <TextField
                                    disabled
                                    select
                                    fullWidth
                                    label="Type"
                                    onChange={(e) => {
                                      handleUpdateSubPropsType(
                                        index,
                                        subIndex,
                                        e.target.value
                                      );
                                    }}
                                    value={subProp["type"] || ""}
                                  >
                                    {dataTypes
                                      .filter((item) => {
                                        // remove object type on sub properties
                                        return item.value !== "std:obj";
                                      })
                                      .map((type: any, index: number) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={type.label}
                                          >
                                            {type.value}
                                          </MenuItem>
                                        );
                                      })}
                                  </TextField>
                                  <Tooltip title="Remove current sub property">
                                    <Button
                                      sx={{
                                        minWidth: "0px",
                                        width: "34px",
                                        minHeight: "0px",
                                        height: "34px",
                                        borderRadius: "50%",
                                        backgroundColor: "#FEF7F2",
                                        color: "#F7A088",
                                        mr: {
                                          xs: 0,
                                          xsm: 0,
                                          md: 3,
                                          lg: 1,
                                        },
                                        ml: 3,
                                        mt: 1,
                                        mb: {
                                          xs: 0,
                                          xsm: 1,
                                        },
                                      }}
                                      onClick={() => {
                                        handleRemoveSubProp(index, subIndex);
                                      }}
                                    >
                                      <RemoveOutlinedIcon />
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </Grid>
                            </React.Fragment>
                          );
                        }
                      )}
                    </Grid>
                  </Box>
                )}
              </Grid>
            );
          }
        })}
        {/* {properties?.length > 0 && (
          <Box sx={{ py: 1 }}>
            <Button
               
              variant="contained"
              color="secondary"
              onClick={handleAddValueProperty}
              sx={{
                width: {
                  xs: "100%",
                  xsm: "auto",
                },
              }}
            >
              Add value property
            </Button>
          </Box>
        )} */}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setActiveStep((prev: number) => {
              return prev - 1;
            });
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          // onClick={handleConfirm}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Next
        </LoadingButton>
      </Box>
    </Box>
  );
};
export default SchemaDetailV2;
