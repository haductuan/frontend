import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  NativeSelect,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
// import axios from "axios";
import { schema as zidenSchema } from "@zidendev/zidenjs";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIssuerContext } from "src/context/issuerContext";
import { parseLabel } from "src/utils/claim";
import { PulseLoadingIcon } from "src/constants/icon";

const dataTypeMaping = (type: string) => {
  switch (type) {
    case "std:str":
      return "text";
    case "std:int32":
      return "number";
    case "std:double":
      return "number";
    case "std:bool":
      return "checkbox";
    case "std:date":
      return "date";
    default:
      return "text";
  }
};

export interface newClaimProps {
  setSchemaData: any;
  schemaData: any;
  setIsDone: any;
  allSchema?: any;
}

const ManualInput = ({
  setSchemaData,
  schemaData,
  setIsDone,
  allSchema,
}: newClaimProps) => {
  // const { endpointUrl } = useIssuerContext();
  const { enqueueSnackbar } = useSnackbar();
  const { endpointUrl } = useIssuerContext();
  const [dataJson, setDataJson] = useState<any>({});
  const [form, setForm] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [required, setRequired] = useState<Array<any>>([]);
  const [schema, setSchema] = useState<{
    hash: string;
    registryId: string;
  }>(undefined as any);
  const [helperText, setHelperText] = useState<any>({});
  const [holderId, setHolderId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //input: datatype, context data, replace all none std type with context data , if type="std:obj" replace all sub props with contextData
  const handleChangeFormData = (field: string, value: any, type: string) => {
    let processedValue = value;
    if (type === "std:date") {
      let temp = value.replaceAll("-", "");
      processedValue = Number(temp);
    }
    setFormData((prev: any) => {
      return {
        ...prev,
        [field]: processedValue,
      };
    });
  };
  const handleChangeFormSubData = (
    field: string,
    subField: string,
    value: any,
    type: string
  ) => {
    let processedValue = value;
    if (type === "std:date") {
      let temp = value.replaceAll("-", "");
      processedValue = Number(temp);
    }
    setFormData((prev: any) => {
      const subFieldData = prev[field] || {};
      return {
        ...prev,
        [field]: {
          ...subFieldData,
          [subField]: processedValue,
        },
      };
    });
  };
  const handleChange = async (event: any) => {
    try {
      setLoading(true);
      setSchema(event.target.value);
      const schemaForm = (
        await axios.get(endpointUrl + `/schemas/${event.target.value.hash}`)
      ).data;
      setDataJson(schemaForm);
      let {
        "@name": {},
        "@id": {},
        "@hash": {},
        "@required": {},
        ...schemaToDisplay
      } = zidenSchema.getInputSchema(schemaForm);
      setForm(schemaToDisplay);
      setRequired(schemaForm["@required"]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!schema?.hash) {
      enqueueSnackbar("Please select registed schema form!", {
        variant: "info",
      });
      return;
    }
    let isValid = true;
    setHelperText({});
    if (!holderId) {
      setHelperText((prev: any) => {
        return { ...prev, holderId: `Holder ID is Missing` };
      });
    }
    for (const require of required) {
      if (formData[require] !== 0 && !formData[require]) {
        setHelperText((prev: any) => {
          return { ...prev, [require]: `${parseLabel(require)} is Missing` };
        });
        // console.log(require, "-", formData[require]);
        isValid = false;
      }
    }
    if (!isValid) {
      return;
    }
    setSchemaData((prev: Array<any>) => {
      return [
        ...prev,
        {
          data: formData,
          schemaHash: dataJson["@hash"],
          registryId: schema.registryId,
          holderId: holderId,
          createDate: Date.now(),
          id: schema.registryId,
        },
      ];
    });
    setIsDone(true);
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        minHeight: "100%",
        "& .MuiFormHelperText-root": {
          color: "#F7A993",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          select
          label="Schema"
          value={schema || ""}
          onChange={handleChange}
          required
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#EDF3FC",
            },
            borderRadius: 3,
            mr: 1,
          }}
          helperText=" "
        >
          {allSchema.map((option: { label: string; value: any }) => (
            <MenuItem key={option.value.registryId} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Grid container spacing={2}>
        {form && !loading && Object.keys(form).length > 0 && (
          <Grid item xs={12} xsm={6}>
            <TextField
              label={"Holder id"}
              fullWidth
              onChange={(e) => {
                setHolderId(e.target.value);
              }}
              type="text"
              helperText={helperText["holderId"] || " "}
            />
          </Grid>
        )}
        {form &&
          !loading &&
          Object.keys(form).map((item: any, index: number) => {
            const inputData = form[item];
            if (inputData["@type"] === "std:obj") {
              const {
                "@type": {},
                "@id": {},
                ...subData
              } = inputData;
              return (
                <Grid item xs={12} key={index}>
                  <Box
                    key={index}
                    sx={{
                      mt: 2,
                      py: {
                        xs: 2,
                        xsm: 2,
                        md: 3,
                        lg: 3,
                      },
                      px: {
                        xs: 3,
                        xsm: 3,
                        md: 4,
                        lg: 4,
                      },
                      borderRadius: 2,
                      // border: "1px solid rgba(0, 0, 0, 0.23)",
                      position: "relative",
                      boxShadow: "inset 0px -1px 6px #00000029",
                      background: "#EFEFEF 0% 0% no-repeat padding-box",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        px: "5px",
                        color: "#000d1c",
                        position: "absolute",
                        top: "-32px",
                        left: "0px",
                      }}
                    >
                      {parseLabel(item)}
                      {required?.includes(item) && "*"}
                    </Typography>
                    {Object.keys(subData).map((subItem: any, index: number) => {
                      const values = subData[subItem]["@values"];
                      const display = subData[subItem]["@display"];
                      if (values?.length > 0) {
                        if (display?.length > 0) {
                          const options = values.map(
                            (value: any, index: number) => {
                              return {
                                label: display[index],
                                value: value,
                              };
                            }
                          );
                          return (
                            <Autocomplete
                              key={index}
                              options={options}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{
                                    my: 2,
                                  }}
                                  label={parseLabel(subItem)}
                                />
                              )}
                              onChange={(e, newValue: any) => {
                                handleChangeFormSubData(
                                  item,
                                  subItem,
                                  newValue.value,
                                  subData[subItem]["@type"]
                                );
                              }}
                            />
                          );
                        } else {
                          return (
                            <Box
                              key={index}
                              sx={{
                                position: "relative",
                              }}
                            >
                              <Typography
                                sx={{
                                  position: "absolute",
                                  top: "-9px",
                                  left: "0px",
                                  fontSize: "1rem",
                                  transform: "scale(0.75)",
                                  backgroundColor: "#FFFFFC",
                                  px: "5px",
                                  color: "#000d1c",
                                  zIndex: 2,
                                }}
                              >
                                {parseLabel(subItem)}
                              </Typography>
                              <NativeSelect
                                key={index}
                                disableUnderline
                                sx={{
                                  my: 2,
                                  height: "56px",
                                  border: "1px solid rgba(0, 0, 0, 0.23)",
                                  borderRadius: "10px",
                                  pl: "10px",
                                  "& .MuiSvgIcon-root": {
                                    mr: 1,
                                  },
                                  "& ul": {
                                    py: 1,
                                  },
                                }}
                                // label={parseLabel(subItem)}
                                inputProps={{
                                  name: parseLabel(subItem),
                                  id: "uncontrolled-native",
                                }}
                                onChange={(e) => {
                                  handleChangeFormSubData(
                                    item,
                                    subItem,
                                    e.target.value,
                                    subData[subItem]["@type"]
                                  );
                                }}
                                fullWidth
                              >
                                {values?.map(
                                  (valueItem: any, index: number) => {
                                    return (
                                      <option
                                        key={index}
                                        style={{
                                          fontSize: "1rem",
                                        }}
                                        value={valueItem}
                                      >
                                        {valueItem}
                                      </option>
                                    );
                                  }
                                )}
                              </NativeSelect>
                            </Box>
                          );
                        }
                      } else {
                        return (
                          <TextField
                            key={index}
                            label={parseLabel(subItem)}
                            fullWidth
                            sx={{
                              my: 2,
                            }}
                            type={dataTypeMaping(form[item]["@type"])}
                            InputLabelProps={{
                              shrink:
                                form[item]["@type"] === "std:date"
                                  ? true
                                  : undefined,
                            }}
                            onChange={(e) => {
                              handleChangeFormSubData(
                                item,
                                subItem,
                                e.target.value,
                                subData[subItem]["@type"]
                              );
                            }}
                          />
                        );
                      }
                    })}
                    <Typography
                      variant="body2"
                      sx={{ color: "#F7A993", fontSize: "0.75rem" }}
                    >
                      {helperText[item]}
                    </Typography>
                  </Box>
                </Grid>
              );
            } else {
              const values = inputData["@values"];
              const display = inputData["@display"];
              if (values?.length > 0) {
                if (display?.length > 0) {
                  const options = values.map((value: any, index: number) => {
                    return {
                      label: display[index],
                      value: value,
                    };
                  });
                  return (
                    <Grid item xs={12} xsm={6} key={index}>
                      <Autocomplete
                        key={index}
                        options={options}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required={required?.includes(item)}
                            label={parseLabel(item)}
                            helperText={helperText[item] || " "}
                          />
                        )}
                        onChange={(e, newValue: any) => {
                          handleChangeFormData(
                            item,
                            newValue.value,
                            form[item]["@type"]
                          );
                        }}
                      />
                    </Grid>
                  );
                } else {
                  return (
                    <Grid item xs={12} xsm={6} key={index}>
                      <TextField
                        key={index}
                        select
                        label={parseLabel(item)}
                        required={required?.includes(item)}
                        fullWidth
                        onChange={(e) => {
                          handleChangeFormData(
                            item,
                            e.target.value,
                            form[item]["@type"]
                          );
                        }}
                        helperText={helperText[item] || " "}
                      >
                        {values?.map((valueItem: any, index: number) => {
                          return (
                            <MenuItem key={index} value={valueItem}>
                              {valueItem}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                  );
                }
              } else {
                return (
                  <Grid item xs={12} xsm={6} key={index}>
                    <TextField
                      key={index}
                      label={parseLabel(item)}
                      required={required?.includes(item)}
                      fullWidth
                      type={dataTypeMaping(form[item]["@type"])}
                      InputLabelProps={{
                        shrink:
                          form[item]["@type"] === "std:date" ? true : undefined,
                      }}
                      onChange={(e) => {
                        handleChangeFormData(
                          item,
                          e.target.value,
                          form[item]["@type"]
                        );
                      }}
                      helperText={helperText[item] || " "}
                    />
                  </Grid>
                );
              }
            }
          })}
      </Grid>
      {loading && (
        <Box
          sx={{
            width: "100%",
          }}
        >
          <PulseLoadingIcon />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        <Button
          sx={{
            width: {
              xs: "100%",
              md: "150px",
            },
            mr: 1,
          }}
          variant="outlined"
          color="primary"
        >
          <NavLink
            to="/issuer/claims"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Cancel
          </NavLink>
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // console.log(tempData);
            // console.log(schemaType);
            handleSubmit();
          }}
          sx={{
            width: {
              xs: "100%",
              md: "150px",
            },
            ml: 1,
          }}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};
export default ManualInput;
