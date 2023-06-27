import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// import TableData from "src/components/TableData";
import { newClaimProps } from "../ManualInput";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import axios from "axios";
import { useIssuerContext } from "src/context/issuerContext";
import { useSnackbar } from "notistack";
import { truncateString } from "src/utils/wallet/walletUtils";
import { useHistory } from "react-router-dom";
import { TrashCan } from "src/constants/icon";
import { LoadingButton } from "@mui/lab";
import { parseLabel } from "src/utils/claim";

const Summary = ({ setSchemaData, schemaData, setIsDone }: newClaimProps) => {
  const history = useHistory();

  const [dialogData, setDialogData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { endpointUrl } = useIssuerContext();
  const handleSubmitData = async () => {
    if (schemaData.length === 0) {
      enqueueSnackbar("Nothing to Submit!", {
        autoHideDuration: 2000,
        variant: "warning",
      });
      return;
    }
    setLoading(true);
    const jwz = localStorage.getItem("ziden-db/issuer-jwz");
    const userId = localStorage.getItem("ziden-db/issuer-id");
    const resultSubmit = await axios.post(
      `${endpointUrl}/claims/issue/${userId}`,
      schemaData.map((item: any) => {
        return {
          holderId: item.holderId || "",
          registryId: item.registryId || "",
          data: item.data,
        };
      }),
      {
        headers: {
          Authorization: `${jwz}`,
        },
      }
    );
    setLoading(false);
    if (resultSubmit.data?.length > 0) {
      enqueueSnackbar("Add claims success!", {
        autoHideDuration: 2000,
        variant: "success",
      });
      history.push("/issuer/claims");
    } else {
      enqueueSnackbar(`Failed to add claims!`, {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
  };

  const handleChange = (item: string) => {
    setSchemaData((prev: any) => {
      return prev.filter((itemData: any) => {
        return itemData.id !== item;
      });
    });
  };
  const handleCheckBoxClick = (e: any, claimID: string) => {
    handleChange(claimID);
    e.stopPropagation();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const headers = ["No", "Schema hash", "Create date", "Holder ID", " "];

  return (
    <Paper
      sx={{
        borderRadius: 3,
      }}
    >
      <Dialog
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            borderRadius: 3,
          },
        }}
        PaperProps={{}}
        open={open}
        onClose={handleClose}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Typography mb={2} variant="h3">
            Details
          </Typography>
          {Object.entries(dialogData).map((item: any, index: number) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "40px",
                }}
                key={index}
              >
                <Typography
                  variant="body2"
                  sx={{
                    width: "150px",
                    minWidth: "150px",
                  }}
                  color="secondary"
                >
                  {parseLabel(item[0])}
                </Typography>
                <Typography noWrap variant="body2" color="text.secondary">
                  {item[0] === "Create Date"
                    ? new Date(parseInt(item[1])).toDateString()
                    : item[1]}
                </Typography>
              </Box>
            );
          })}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
          </Box>
        </Paper>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          pl: 4,
          py: 3,
        }}
      >
        <Typography variant="body1" color="secondary">
          Schema
        </Typography>
        {/* <Typography ml={2}>{schemaType}</Typography> */}
      </Box>
      <TableContainer
        sx={{
          "& .MuiTableRow-head": {
            backgroundColor: "#EDF3FC",
          },
          "& .MuiTableCell-root": {
            borderBottom: "none",
          },
          "& .MuiTableCell-root:first-of-type": {
            pl: 4,
            textAlign: "left",
          },
          "& .MuiTableCell-root:last-of-type": {
            pr: 4,
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
          },
          // "& .MuiTableCell-root:nth-child": {},
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((item, index: number) => {
                return <TableCell key={index + item}>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {schemaData.map((row: any, index: number) => {
              return (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => {
                    setDialogData({
                      ...row.data,
                      "Schema Hash": row.schemaHash,
                      "Registry Id": row.registryId,
                      "Holder ID": row.holderId,
                      "Create Date": row.createDate,
                    });
                    setOpen(true);
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color={"text.secondary"}>
                      {index}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={"text.secondary"}>
                      {truncateString(row.schemaHash, 30)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={"text.secondary"}>
                      {truncateString(row.createDate, 30)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={"text.secondary"}>
                      {truncateString(row.holderId, 30)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Button
                      sx={{
                        minWidth: "0px",
                        width: "20px",
                        backgroundColor: "transparent",
                        height: "25px",
                        minHeight: "0px",
                        transform: "translate(8px)",
                      }}
                      onClick={(e: any) => handleCheckBoxClick(e, row.id)}
                    >
                      <TrashCan />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 3,
        }}
      >
        <Button
          sx={{
            mr: 2,
          }}
          variant="outlined"
          color="primary"
          onClick={() => {
            setIsDone(false);
          }}
        >
          Back
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmitData();
          }}
        >
          Finish
        </LoadingButton>
      </Box>
    </Paper>
  );
};
export default Summary;
