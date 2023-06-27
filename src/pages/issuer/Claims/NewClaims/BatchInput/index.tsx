import {
  Box,
  Button,
  Dialog,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { newClaimProps } from "../ManualInput";
import * as XLSX from "xlsx";
import { useSnackbar } from "notistack";
import { convertDataForServerType } from "src/utils/claim";
import axios from "axios";
import { useIssuerContext } from "src/context/issuerContext";

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

const BatchInput = ({
  setSchemaData,
  schemaData,
  setIsDone,
  allSchema,
}: newClaimProps) => {
  const [type, setType] = useState<any>("");
  const [displaySchema, setDisplaySchema] = useState<any>();
  const [showInputDialog, setShowInputDialog] = useState(false);
  const uploadInput = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { endpointUrl } = useIssuerContext();
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const schemaDetail: any = event.target.value;
    setType(schemaDetail);
    const res = (
      await axios.get(`${endpointUrl}/schemas/${schemaDetail?.hash}`)
    ).data;

    setDisplaySchema(getPropertyData(res));
  };
  const handleFile = async (file: any) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = async (e: any) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // console.log(rABS, wb);
      /* Convert array of arrays */
      const data: Array<any> = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const readedHeader = data[0];
      var isValidFile = true;
      let allClaimData = [];
      for (const row of data.splice(1)) {
        let claimData: any = {};
        claimData["holderId"] = row[0];
        for (const [index, value] of Object.entries(displaySchema)) {
          const dataIndex = readedHeader.indexOf(index);
          if (dataIndex === -1) {
            isValidFile = false;
            break;
          } else {
            claimData[index] = row[dataIndex];
          }
        }
        allClaimData.push({
          createDate: Date.now(),
          data: claimData,
          registryId: type?.registryId,
          schemaHash: type?.hash,
        });
      }
      console.log(
        "🚀 ~ file: index.tsx:82 ~ reader.onload= ~ allClaimData:",
        allClaimData
      );
      if (!isValidFile) {
        console.log("Invalid file data");
        return;
      } else {
      }
      /* Update state */
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };
  const handleUploadFileInput = (e: any) => {
    const uploadFile = e.target.files[0];
    setSchemaData([]);
    handleFile(uploadFile);
    e.target.value = null;
  };
  const handleCloseDialog = () => {
    setShowInputDialog(false);
  };
  const handleUpload = () => {
    if (!type) {
      enqueueSnackbar("Please select type of schema!", {
        variant: "warning",
      });
      return;
    }
    if (uploadInput?.current) {
      uploadInput?.current.click();
    }
    //setIsDone(true);
  };
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        minHeight: "100%",
      }}
    >
      <Dialog
        PaperProps={{
          style: {
            borderRadius: "10px",
          },
        }}
        open={showInputDialog}
        onClose={handleCloseDialog}
      >
        <Box
          sx={{
            p: 3,
            minWidth: "350px",
          }}
        >
          <Typography mb={2} variant="h3">
            Usage
          </Typography>
          <Typography mb={4} variant="body2" color="text.secondary">
            Fill your data with this template to quickly import multiple claims
          </Typography>
          {/* <TextField
            fullWidth
            sx={{
              mb: 4,
            }}
            label="Enter google sheet link"
          /> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseDialog}
              sx={{
                ml: 2,
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Dialog>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          pr: 1,
          mt: 2,
          mb: 4,
        }}
      >
        <TextField
          select
          label="Schema"
          value={type}
          onChange={handleChange}
          required
          sx={{
            backgroundColor: "#EDF3FC",
            borderRadius: 3,
            minWidth: "350px",
          }}
        >
          {allSchema.map(
            (
              option: {
                label: string;
                value: any;
              },
              index: number
            ) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            )
          )}
        </TextField>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          You can upload file from your computer
        </Typography>
        <Box
          sx={{
            display: "flex",
            my: 4,
            justifyContent: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" justifyContent={"center"}>
              <input
                accept=".xlsx"
                ref={uploadInput}
                id="issuer-upload-claim-input"
                type="file"
                style={{
                  display: "none",
                }}
                onChange={handleUploadFileInput}
              />
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  width: "320px",
                  height: "70px",
                }}
                onClick={handleUpload}
              >
                Upload File
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} display="flex" justifyContent={"center"}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  width: "320px",
                  height: "70px",
                }}
                onClick={() => {
                  setShowInputDialog(true);
                }}
              >
                Get template
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};
export default BatchInput;
