import {
  Button,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { zidenIssuerNew, zidenKYC } from "src/client/api";
import { EmptyIcon } from "src/constants/icon";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import ClaimDetail, { detailDataType } from "../ClaimDetail";

const getStatusColor = (status: string) => {
  try {
    switch (status?.toLowerCase()) {
      case "reviewing":
        return "#F69176";
      case "rejected":
        return "#646A71";
      case "pending":
        return "#0BBF81";
      case "revoked":
        return "#646A71";
      default:
        return "#F69176";
    }
  } catch (err) {}
};

const TableData = ({
  headers,
  data,
  type,
  update,
}: {
  headers: Array<{
    id: string;
    label: string;
  }>;
  data: Array<any>;
  type?: string;
  update: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [rowsPerpage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(0);
  const [dialogData, setDialogData] = useState<detailDataType>(
    {} as detailDataType
  );
  const [order, setOrder] = useState<"asc" | "desc" | undefined>("desc");
  const [sortBy, setSortBy] = useState("create_date");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId } = useIdWalletContext();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (newRowsPerPage <= data?.length) {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSort = (typeID: string) => {
    setPage(0);
    if (sortBy !== typeID) {
      setSortBy(typeID);
    } else {
      setOrder((prev) => {
        if (prev === "asc") {
          return "desc";
        } else {
          return "asc";
        }
      });
    }
  };
  const compare = (a: any, b: any) => {
    if (a === b) return 0;
    if (a < b) {
      return order === "asc" ? -1 : 1;
    } else {
      return order === "asc" ? 1 : -1;
    }
  };
  const handleShowDetail = async (item: any) => {
    setIsLoading(true);
    setOpen(true);
    if (item["status"]?.toLowerCase() === "reviewing") {
      const jwz = localStorage.getItem("ziden-db/issuer-jwz");
      const res = (
        await zidenKYC.get(`profile/${userId}?claimId=${item.id}`, {
          headers: {
            Authorization: `${jwz}`,
          },
        })
      ).data?.claims[0];
      if (res) {
        const { image, claimId, id, issuerId, ...kycData } = res;
        setDialogData({
          ...item,
          kycData: kycData,
          userImage: res.image,
        });
      } else {
        setDialogData({
          ...item,
          kycData: {} as detailDataType,
          userImage: "",
        });
      }
    } else {
      setDialogData({
        ...item,
        kycData: {} as detailDataType,
        userImage: "",
      });
    }
    setIsLoading(false);
  };
  const accept = async (claimId: string) => {
    const jwz = localStorage.getItem("ziden-db/issuer-jwz");
    try {
      await zidenIssuerNew.put(
        `/claims/${userId}/${claimId}/status/PENDING`,
        {},
        {
          headers: {
            Authorization: `${jwz}`,
          },
        }
      );
      update();
      handleClose();
    } catch (err) {}
  };
  const reject = async (claimId: string) => {
    const jwz = localStorage.getItem("ziden-db/issuer-jwz");
    try {
      await zidenIssuerNew.put(
        `/claims/${userId}/${claimId}/status/REJECT`,
        {},
        {
          headers: {
            Authorization: `${jwz}`,
          },
        }
      );
      update();
      handleClose();
    } catch (err) {}
  };
  useEffect(() => {
    setPage(0);
  }, [data]);
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Dialog
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            borderRadius: 3,
          },
        }}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h3">Details</Typography>
            <Button
              sx={{
                minWidth: "0px",
                backgroundColor: "transparent",
              }}
              onClick={handleClose}
            >
              <CloseIcon
                sx={{
                  color: "#646A71",
                  fontSize: "1.4rem",
                }}
              />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {!isLoading && (
            <ClaimDetail
              displayData={dialogData}
              accept={accept}
              reject={reject}
            />
          )}
          {isLoading && (
            <Box
              sx={{
                minWidth: "350px",
                display: "flex",
                justifyContent: "center",
                minHeight: "350px",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
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
            textAlign: "left",
            display: "flex",
            // justifyContent: "flex-end",
          },
          // "& .MuiTableCell-root:nth-child": {},
        }}
      >
        <Table style={{ minWidth: "600px" }}>
          <TableHead>
            <TableRow>
              {headers.map((item, index: number) => {
                return (
                  <TableCell key={index + item.id} sortDirection="asc">
                    <TableSortLabel
                      active={sortBy === item.id}
                      direction={order}
                      onClick={(e) => handleSort(item.id)}
                    >
                      {item.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.sort((a, b) => {
                return compare(a[sortBy], b[sortBy]);
              })
              ?.slice(page * rowsPerpage, (page + 1) * rowsPerpage)
              ?.map((item, index: number) => {
                return (
                  <TableRow
                    key={item.id + index}
                    hover
                    onClick={() => {
                      handleShowDetail(item);
                    }}
                  >
                    {headers?.map((cellData: any, index: number) => {
                      return (
                        <TableCell key={index}>
                          <Typography
                            noWrap
                            sx={{
                              maxWidth: {
                                xs: "100px",
                                xsm: "150px",
                                md: "150px",
                                lg: "200px",
                                xl: "auto",
                              },
                            }}
                            variant="body2"
                            color={
                              type === "status" && cellData.id === "status"
                                ? getStatusColor(item["status"])
                                : "text.secondary"
                            }
                          >
                            {cellData.id === "create_date"
                              ? new Date(item[cellData.id]).toDateString()
                              : item[cellData.id]}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {data?.length === 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
          }}
        >
          <EmptyIcon />
          <Typography variant="h4" fontWeight={700}>
            Empty
          </Typography>
        </Box>
      )}
      <Box sx={{ borderBottom: "1px solid #D1D3D5" }} />
      <Box
        sx={{
          height: "50px",
          position: "absolute",
          right: "10px",
          bottom: "-70px",
        }}
      >
        <TablePagination
          component="div"
          count={data?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerpage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 6, 8, 10, 15, 20, 30, 50]}
          sx={{
            width: "400px",
          }}
        />
      </Box>
    </Box>
  );
};
export default TableData;
