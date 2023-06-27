import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import CircleIcon from "@mui/icons-material/Circle";
import { schema as zidenSchema } from "@zidendev/zidenjs";
import React, { useState } from "react";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { dataTypeMaping, parseLabel } from "src/utils/claim";
import { DotIcon } from "src/constants/icon";
export interface schemaDetailProps {
  open: any;
  handleClose: any;
  data?: any;
  generalData: any;
}

const SchemaDetail = ({
  generalData,
  open,
  handleClose,
  data,
}: schemaDetailProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: "10px", minWidth: "300px" },
      }}
      open={open}
      onClose={handleClose}
    >
      {Object.keys(generalData).length !== 0 && (
        <Box
          sx={{
            width: "100%",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              mb: 2,
            }}
          >
            <Typography variant="h3">Information</Typography>
          </Box>
          <Tabs
            variant="fullWidth"
            sx={(theme: any) => ({
              "& .MuiTabs-flexContainer": {
                height: "40px",
                minHeight: "40px",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#C0D5F4",
                height: "100%",
                opacity: 1,
                borderRadius: 1.5,
              },
              "& .MuiTab-root": {
                color: "#114898",
                zIndex: 2,
                fontSize: "1rem",
                fontWeight: 500,
                height: "40px",
                minHeight: "40px",
              },
              backgroundColor: "#F0F0F0",
              borderRadius: 1.5,
              boxShadow: "0px 2px 3px #0000001F",
              mt: 2,
              mb: 2,
              width: "100%",
              height: "40px",
              minHeight: "40px",
            })}
            value={currentTab}
            onChange={handleChange}
          >
            <Tab label="General information" />
            <Tab label="Schema details" />
          </Tabs>
          {currentTab === 0 && <GeneralInfo data={generalData.general} />}
          {currentTab === 1 && <SchemaDetails data={generalData.detail} />}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
      {Object.keys(generalData).length === 0 && (
        <Box
          sx={{
            width: "100%",
            p: 3,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
};
const GeneralInfo = ({ data }: { data: any }) => {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Grid container>
        {Object.keys(data).map((item: any, index: number) => {
          return (
            <React.Fragment key={item + index}>
              <Grid item xs={12} xsm={3}>
                <Typography
                  variant="body2"
                  fontSize={"1rem"}
                  color="secondary"
                  textAlign={"left"}
                  py={1}
                >
                  {data[item].title}
                </Typography>
              </Grid>
              <Grid item xs={12} xsm={9}>
                <Typography
                  variant="body2"
                  fontSize={"1rem"}
                  fontWeight={500}
                  color={"text.secondary"}
                  textAlign={"left"}
                  py={1}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {data[item].value}
                </Typography>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};
const SchemaDetails = ({ data }: { data: any }) => {
  const [displayData, setDisplayData] = useState<any>();
  const [name, setName] = useState<string>("");
  React.useEffect(() => {
    if (data) {
      const parsedData = zidenSchema.getInputSchema(data);
      const {
        "@hash": {},
        "@id": {},
        "@name": {},
        "@required": {},
        ...schemaForm
      } = parsedData;
      setDisplayData(schemaForm);
      setName(parsedData["@name"]);
    }
  }, [data]);

  return (
    <Box>
      {displayData && (
        <Grid container>
          <Grid item xs={6} xsm={5} sm={4}>
            <Typography
              variant="body2"
              fontSize={"1rem"}
              color="secondary"
              py={1}
              textAlign={"left"}
            >
              Schema Name
            </Typography>
          </Grid>
          <Grid item xs={6} xsm={7} sm={8}>
            <Typography
              variant="body2"
              fontWeight={500}
              color={"text.secondary"}
              textAlign={"left"}
              fontSize={"1rem"}
              py={1}
            >
              {name}
            </Typography>
          </Grid>
          {Object.entries(displayData).map((row: any, index: number) => {
            if (row[1]["@type"] !== "std:obj") {
              return (
                <React.Fragment key={index}>
                  <Grid item xs={6} xsm={5} sm={4}>
                    <Typography
                      variant="body2"
                      fontSize={"1rem"}
                      color="secondary"
                      py={1}
                      textAlign={"left"}
                    >
                      {parseLabel(row[0])}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} xsm={7} sm={8}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color={"text.secondary"}
                      textAlign={"left"}
                      fontSize={"1rem"}
                      py={1}
                    >
                      {" "}
                      {parseLabel(dataTypeMaping(row[1]["@type"]))}
                    </Typography>
                  </Grid>
                </React.Fragment>
              );
            } else {
              const {
                "@id": {},
                "@type": {},
                ...subData
              } = row[1];
              return (
                <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      fontSize={"1rem"}
                      color="secondary"
                      py={1}
                      textAlign={"left"}
                    >
                      {parseLabel(row[0])}
                    </Typography>
                  </Grid>
                  {Object.entries(subData).map(
                    (subItem: any, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          <Grid
                            item
                            xs={6}
                            xsm={5}
                            sm={4}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <DotIcon
                              sx={{
                                ml: 1,
                              }}
                            />
                            <Typography
                              variant="body2"
                              fontSize={"0.875rem"}
                              color="secondary"
                              py={1}
                              textAlign={"left"}
                            >
                              {parseLabel(subItem[0])}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} xsm={7} sm={8}>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              color={"text.secondary"}
                              textAlign={"left"}
                              fontSize={"0.875rem"}
                              py={1}
                              pl={1}
                            >
                              {" "}
                              {parseLabel(dataTypeMaping(subItem[1]["@type"]))}
                            </Typography>
                          </Grid>
                        </React.Fragment>
                      );
                    }
                  )}
                </React.Fragment>
              );
            }
          })}
        </Grid>
      )}
    </Box>
  );
};
export default SchemaDetail;
