/* eslint-disable no-empty-pattern */
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  MenuItem,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { userKYCDataType } from "src/context/context";
import { useKYCContext } from "src/context/kyc-context";
import { useParams } from "react-router-dom";
import { schema as zidenSchema } from "@zidendev/zidenjs";
import { zidenPortal } from "src/client/api";
import { dataTypeMaping, parseLabel } from "src/utils/claim";

const NationalIDForm = () => {
  const params: any = useParams();
  const { setActiveStep, userData, setUserData } = useKYCContext();
  const [form, setForm] = useState<any>({});
  const [fetching, setFetching] = useState<boolean>(false);
  const [required, setRequired] = useState<Array<any>>([]);
  const [formData, setFormData] = useState<userKYCDataType>({});
  const [helperText, setHelperText] = useState<any>({});
  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);
  const handleNext = () => {
    let isValid = true;
    setHelperText({});
    for (const require of required) {
      if (formData[require] !== 0 && !formData[require]) {
        setHelperText((prev: any) => {
          return { ...prev, [require]: `${parseLabel(require)} is Missing` };
        });
        isValid = false;
      }
    }
    if (!isValid) {
      return;
    }
    setUserData(formData);
    setActiveStep((prev: number) => prev + 1);
  };
  const handleBack = () => {
    setActiveStep((prev: number) => prev - 1);
  };

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
  useEffect(() => {
    async function fetchSchema() {
      setFetching(true);
      try {
        const registryMetaData = await zidenPortal.get(
          `/registries/${params.requestID}`
        );
        const schemaHash = registryMetaData?.data?.registry?.schema?.schemaHash;
        const schemaDetail = await zidenPortal.get(`/schemas/${schemaHash}`);
        let {
          "@name": {},
          "@id": {},
          "@hash": {},
          "@required": {},
          ...schemaToDisplay
        } = zidenSchema.getInputSchema(schemaDetail.data.schema?.jsonSchema);
        setForm(schemaToDisplay);
        setRequired(schemaDetail.data.schema?.jsonSchema["@required"]);
      } catch (err) {
        setFetching(false);
      }
      setFetching(false);
    }
    fetchSchema();
  }, [params.requestID]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <FormControl>
        <Grid container spacing={2}>
          {!fetching &&
            form &&
            Object.keys(form).map((item: any, index: number) => {
              const inputData = form[item];
              if (inputData["@type"] === "std:obj") {
                const {
                  "@type": {},
                  "@id": {},
                  ...subData
                } = inputData;
                return (
                  <Box
                    key={index}
                    sx={{
                      mt: 4,
                      p: {
                        xs: 2,
                        xsm: 2,
                        md: 3,
                        lg: 3,
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
                            sx={{
                              my: 2,
                            }}
                            label={parseLabel(subItem)}
                            fullWidth
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
                    <Typography variant="body2" sx={{ color: "#F7A993" }}>
                      {helperText[item]}
                    </Typography>
                  </Box>
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
                      <Grid key={index} item xs={12} sm={6}>
                        <Autocomplete
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
                      <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        key={index}
                        label={parseLabel(item)}
                        required={required?.includes(item)}
                        fullWidth
                        type={dataTypeMaping(form[item]["@type"])}
                        InputLabelProps={{
                          shrink:
                            form[item]["@type"] === "std:date"
                              ? true
                              : undefined,
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
      </FormControl>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="outlined"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="contained"
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default NationalIDForm;
