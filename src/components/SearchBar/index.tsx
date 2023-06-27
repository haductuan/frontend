import { TextField, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
// import TableData from "src/components/TableData";
interface searchBarProps {
  searchCateGories: Array<{
    id: string;
    label: string;
  }>;
  allData: Array<any>;
  setTableData: React.Dispatch<React.SetStateAction<Array<any>>>;
  hidden?: Array<any>;
  defaultType?: string;
}
const SearchBar = ({
  searchCateGories,
  allData,
  setTableData,
  hidden,
  defaultType,
}: searchBarProps) => {
  const [searchType, setSearchType] = useState<string>(
    defaultType || "claim_id"
  );
  const [searchText, setSearchText] = useState<string>("");
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value);
  };
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (!searchType) {
      return;
    } else {
      setTableData(
        allData?.filter((itemRow: any) => {
          return itemRow[searchType]
            ?.toLowerCase()
            .includes(searchText.trim().toLowerCase());
        })
      );
    }
  }, [searchText, searchType, allData, setTableData]);
  const SearchTypeSelect = (
    <Box
      sx={{
        py: 1,
        mr: 1,
      }}
    >
      <TextField
        select
        sx={{
          minWidth: "150px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderTop: "none",
            borderLeft: "none",
            borderBottom: "none",
            borderRight: "1.5px solid rgb(17,72,152,0.3)",
            borderRadius: "0px",
          },
          "& .MuiInputBase-root": {
            height: "40px",
          },
          "& .MuiSvgIcon-root": {
            width: "24px",
          },
        }}
        onChange={handleSearchTypeChange}
        value={searchType}
      >
        {searchCateGories.map((item: any, index: number) => {
          return (
            <MenuItem
              key={index}
              value={item.id}
              sx={{
                display: hidden?.includes(index) ? "none" : "block",
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </TextField>
    </Box>
  );
  return (
    <TextField
      placeholder="Search"
      fullWidth
      sx={{
        backgroundColor: "#EDF3FC",
        "& .MuiOutlinedInput-notchedOutline": {},
        borderRadius: 3,
        "& .MuiInputBase-inputAdornedStart": {
          ml: 2,
        },
      }}
      InputProps={{
        startAdornment: SearchTypeSelect,
      }}
      onChange={handleSearchTextChange}
    />
  );
};
export default SearchBar;
