import React, { useState } from "react";
import { Box, Grid, TextField, MenuItem, Button, Tooltip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { zidenBackend } from "src/client/api";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

const SchemaDetail = ({
  setActiveStep,
  setNewSchemaData,
  newSchemaData,
}: {
  setActiveStep: any;
  setNewSchemaData: any;
  newSchemaData: any;
}) => {
  const [schema, setSchema] = useState<Array<any>>([]);
  const [selectedSchemaHash, setSelectedSchemahash] = useState<string>("");
  const [allSchemaData, setAllSchemaData] = useState<Array<any>>([]);
  const [dataTypes, setDataTypes] = useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);
  const [schemaName, setSchemaName] = useState<string>("");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const handleAddProperties = () => {
    setSchema((prev: Array<any>) => {
      return [
        ...prev,
        {
          name: "",
          title: "",
          type: "text",
          subProperties: [],
        },
      ];
    });
  };
  const handleAddSubProperties = (id: number) => {
    setSchema((prev: Array<any>) => {
      return prev.map((item: any, index: number) => {
        if (index === id) {
          return {
            ...item,
            subProperties: [
              ...item.subProperties,
              {
                name: "",
                type: "text",
                title: "",
              },
            ],
          };
        } else {
          return item;
        }
      });
    });
  };
  const handleRemoveProperties = (index: number) => {
    setSchema((prev: Array<any>) => {
      return prev.filter((item: any, id: number) => {
        return id !== index;
      });
    });
  };
  /**
   * input:
   *  - key of property (name / type),
   *  - value of corresponding key
   * id: index of property in schema state
   * set name / type of property of index id
   */
  const handleSetProperty = (key: string, value: any, id: number) => {
    setSchema((prev: Array<any>) => {
      return prev.map((item: any, index: number) => {
        if (id === index) {
          if (value !== "object" && key !== "name") {
            return {
              ...item,
              [key]: value,
              subProperties: [],
            };
          } else {
            return {
              ...item,
              [key]: value,
            };
          }
        } else {
          return item;
        }
      });
    });
  };
  /**
   *
   * @param key
   * @param value
   * @param id
   * @param subId
   * set name/ type of subProperty with index: subID, with corresponding parent of index: id
   */
  const handleSetSubProperties = (
    key: string,
    value: any,
    id: number,
    subId: number
  ) => {
    setSchema((prev: Array<any>) => {
      return prev.map((item: any, index: number) => {
        if (id === index) {
          return {
            ...item,
            subProperties: item.subProperties.map(
              (subItem: any, subIndex: number) => {
                if (subIndex === subId) {
                  return {
                    ...subItem,
                    [key]: value,
                  };
                } else {
                  return subItem;
                }
              }
            ),
          };
        } else {
          return item;
        }
      });
    });
  };
  const fetchAllSchemaTypes = async () => {
    const schemasResult = await zidenBackend.get(`/schemas`);
    setAllSchemaData(schemasResult.data?.schemas || []);
  };
  const handleTemplateChange = (e: any) => {
    setSelectedSchemahash(e.target.value);
    const selected: any = allSchemaData.filter((schema) => {
      return schema.schemaHash === e.target.value;
    })[0];
    setSchemaName(selected.title);
    const setData = Object.keys(selected.properties).map(
      (data: any, index: number) => {
        return {
          name: data,
          title: selected.properties[data]?.title,
          type: selected.properties[data]?.type,
          subProperties: selected.properties[data]?.subProperties || [],
        };
      }
    );
    setSchema(setData);
  };
  React.useEffect(() => {
    fetchAllSchemaTypes();
  }, []);
  React.useEffect(() => {
    const fetchTypes = async () => {
      const allTypes = await zidenBackend.get("/schemas/dataTypes");
      const types = [
        ...allTypes?.data?.dataTypes.map((item: string) => {
          return {
            label: item,
            value: item,
          };
        }),
        {
          label: "object",
          value: "object",
        },
      ];
      setDataTypes(types);
    };
    fetchTypes();
  }, []);
  const handleConfirm = async () => {
    let properties: any = {};
    for (let i of schema) {
      properties[i.name] = i;
    }
    const dataToUpload = {
      title: schemaName,
      properties: properties,
      index: ["documentId", "documentType"],
      value: Object.keys(properties).filter((field) => {
        return field !== "documentId" && field !== "documentType";
      }),
      required: ["documentId", "documentType"],
    };
    setNewSchemaData((prev: any) => {
      return {
        ...prev,
        schema: dataToUpload,
      };
    });

    try {
      await zidenBackend.post("/registries/schemas", {
        ...newSchemaData,
        schema: dataToUpload,
      });

      enqueueSnackbar("Success!", {
        autoHideDuration: 2000,
        variant: "success",
      });
      history.push("/issuer/schemas");
    } catch (err) {
      enqueueSnackbar("Failed!", {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            fullWidth
            label="Schema Name"
            value={schemaName || ""}
            onChange={(e) => {
              setSchemaName(e.target.value);
            }}
            disabled
          />
        </Grid>
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            fullWidth
            label="Select template"
            select
            onChange={handleTemplateChange}
            value={selectedSchemaHash || ""}
          >
            {allSchemaData.map((schema: any, index: number) => {
              return (
                <MenuItem key={schema.title + index} value={schema.schemaHash}>
                  {schema.title}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
        {schema.map((property: any, index: number) => {
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
                <Grid item xs={12} xsm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label={`Property ${index + 1}`}
                    value={schema[index]["name"] || ""}
                    onChange={(e: any) => {
                      handleSetProperty("name", e.target.value, index);
                    }}
                    disabled
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
                      fullWidth
                      select
                      label={`Type`}
                      value={schema[index]["type"] || "string"}
                      onChange={(e: any) => {
                        handleSetProperty("type", e.target.value, index);
                      }}
                      disabled
                    >
                      {dataTypes &&
                        dataTypes.map((type) => {
                          return (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                    <Box
                      sx={{
                        alignItems: "center",
                        justifyContent: "flex-end",
                        my: 1,
                        ml: 1.5,
                        minWidth: "92px",
                        display: "none",
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
                              property.type === "object" ? "auto" : "none",
                          }}
                          onClick={() => {
                            handleAddSubProperties(index);
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
                          onClick={(e) => {
                            handleRemoveProperties(index);
                          }}
                        >
                          <RemoveOutlinedIcon />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box
                sx={{
                  backgroundColor: "#EFEFEF",
                  boxShadow: "inset 0px -1px 6px #00000029",
                  mt: property.subProperties.length > 0 ? 2 : 0,
                  p:
                    property.subProperties.length > 0
                      ? {
                          xs: 2,
                          xsm: 2,
                          md: 3,
                          lg: 5,
                        }
                      : 0,
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
              >
                <Grid container spacing={2}>
                  {property.subProperties.length > 0 &&
                    property.subProperties.map(
                      (subProterty: any, subIndex: number) => {
                        return (
                          <React.Fragment key={subIndex}>
                            <Grid item xs={12} xsm={12} md={6} lg={6}>
                              <TextField
                                fullWidth
                                label={`Property ${index + 1}.${subIndex + 1}`}
                                value={subProterty.name || ""}
                                onChange={(e) => {
                                  handleSetSubProperties(
                                    "name",
                                    e.target.value,
                                    index,
                                    subIndex
                                  );
                                }}
                                disabled
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
                                  select
                                  onChange={(e) => {
                                    handleSetSubProperties(
                                      "type",
                                      e.target.value,
                                      index,
                                      subIndex
                                    );
                                  }}
                                  value={subProterty.type}
                                  fullWidth
                                  disabled
                                >
                                  {dataTypes &&
                                    dataTypes.map((type) => {
                                      return (
                                        <MenuItem
                                          key={type.value}
                                          value={type.value}
                                        >
                                          {type.label}
                                        </MenuItem>
                                      );
                                    })}
                                </TextField>
                                {/* <Tooltip title="Remove current sub property">
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
                                      handleRemoveSubProperties(
                                        index,
                                        subIndex
                                      );
                                    }}
                                  >
                                    <RemoveOutlinedIcon />
                                  </Button>
                                </Tooltip> */}
                              </Box>
                            </Grid>
                          </React.Fragment>
                        );
                      }
                    )}
                </Grid>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{ py: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddProperties}
          sx={{
            width: {
              xs: "100%",
              xsm: "auto",
            },
            display: "none",
          }}
        >
          Add Property
        </Button>
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
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </Box>
  );
};
export default SchemaDetail;
