/* eslint-disable no-empty-pattern */
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Header from "src/components/Header";
//icon
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { zidenIssuerNew } from "src/client/api";
import { AxiosError } from "axios";
//const
const baseTypes = [
  {
    label: "std:str",
    value: "std:str",
  },
  {
    label: "std:int",
    value: "std:int",
  },
  {
    label: "std:double",
    value: "std:double",
  },
  {
    label: "std:bool",
    value: "std:bool",
  },
  {
    label: "std:date",
    value: "std:date",
  },
];

const getIdValue = (number: number) => {
  if (number > 8) {
    return;
  }
  const prefix = ["std-pos:idx-", "std-pos:val-"];
  return (
    prefix[Math.floor(number / 4)] +
    (2 - ((Math.floor(number / 2) + 1) % 2)).toString()
  );
};

const NewSchema = () => {
  const [schemaMetaData, setSchemaMetaData] = useState<any>({});
  const [properties, setProperties] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  //update prop and type
  const handleAddProperty = () => {
    if (properties.length === 8) {
      enqueueSnackbar("Maximum number of props allowed (8 props)", {
        variant: "info",
      });
      return;
    }
    setProperties((prev: Array<any>) => {
      return [
        ...prev,
        {
          name: `property-${prev.length + 1}`,
          value: {
            // "@id": "",
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
      let temp = prev.slice();
      temp[index].value = {
        "@type": newValue,
      };
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

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (!schemaMetaData["@name"]) {
        enqueueSnackbar("Schema name is empty", {
          variant: "warning",
        });
        return;
      }
      let jsonData = {
        ...schemaMetaData,
        "@context": [],
        "@type": "schema",
        "@required": properties.map((props) =>
          props["name"].replaceAll(" ", "-")
        ),
      };
      properties.map((props, index) => {
        jsonData[props["name"].replaceAll(" ", "-")] = {
          "@type": props["value"]["@type"],
          "@id": getIdValue(index),
        };
        return null;
      });
      await zidenIssuerNew.post("/schemas", jsonData);
      enqueueSnackbar("Add schema success", {
        variant: "success",
      });
    } catch (error: any) {
      let message = "Unknow Error";
      if (error instanceof AxiosError) {
        message = error.response?.data.error;
      } else {
        if (error instanceof Error) {
          message = error.message;
        }
      }
      enqueueSnackbar(message, { variant: "error" });
    }
    setLoading(false);
  };
  return (
    <Box>
      <Header title1="New schema" description={["Create your custom schema"]} />
      <Box
        sx={{
          p: 3,
          px: 8,
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
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
          </Grid>
          {properties &&
            properties.map((property: any, index: number) => {
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
                        value={property.name}
                        fullWidth
                        label={`Property ${index + 1}`}
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
                          fullWidth
                          select
                          label={`Type`}
                          value={property?.value["@type"] || ""}
                          onChange={(e) => {
                            handleChangePropType(index, e.target.value);
                          }}
                        >
                          {baseTypes.map((type: any, index: number) => {
                            return (
                              <MenuItem key={index} value={type.label}>
                                {type.value}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                        <Box
                          sx={{
                            alignItems: "center",
                            justifyContent: "flex-end",
                            ml: 1.5,
                            minWidth: "92px",
                          }}
                        >
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
                </Grid>
              );
            })}
          <Box sx={{ pb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddProperty}
              sx={{
                width: {
                  xs: "100%",
                  xsm: "auto",
                },
              }}
            >
              Add Property
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button variant="outlined" color="primary">
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            >
              Confirm
            </LoadingButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
export default NewSchema;
