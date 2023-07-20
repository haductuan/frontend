import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const ComparedValue = ({
  comparator,
  type,
  handleSetValue,
  helperText,
}: {
  comparator: number;
  type: string;
  handleSetValue: (value: any) => void;
  helperText?: string;
}) => {
  const group1 = [0, 1, 2, 3];
  const group2 = [4, 5];
  const group3 = [6];
  const [item, setItem] = useState<Array<any>>([]);
  const [value, setValue] = useState<Array<any>>([0, 0]);
  const [tempValue, setTempValue] = useState<any>();
  const handleAddItem = () => {
    if (tempValue) {
      handleSetValue([...item, tempValue]);
      setItem((prev: Array<any>) => {
        return [...prev, tempValue];
      });
    }
  };
  return (
    <Box>
      {group1.includes(comparator) && (
        <Box>
          <TextField
            sx={{ my: 1 }}
            fullWidth
            label="Compared value"
            required
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              let valueToCheck: any = e.target.value;
              if (type === "date" || type === "datetime-local") {
                valueToCheck = valueToCheck.replaceAll("-", "");
                valueToCheck = Number(valueToCheck);
              }
              setValue([valueToCheck]);
              handleSetValue([valueToCheck]);
            }}
            type={type}
            helperText={helperText}
          />
        </Box>
      )}
      {group2.includes(comparator) && (
        <Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              sx={{ my: 1, mr: 2 }}
              fullWidth
              label="Compared values"
              required
              InputLabelProps={{
                shrink: true,
              }}
              type={type}
              onChange={(e) => {
                let valueToCheck: any = e.target.value;
                if (type === "date" || type === "datetime-local") {
                  valueToCheck = valueToCheck.replaceAll("-", "");
                  valueToCheck = Number(valueToCheck);
                }
                setTempValue(valueToCheck);
              }}
              helperText={helperText}
            />
            <Button
              sx={{
                my: 2,
                borderRadius: 0.5,
              }}
              variant="outlined"
              onClick={handleAddItem}
            >
              Add
            </Button>
          </Box>
          {item.map((value: any, index: number) => {
            return (
              <MenuItem key={index}>
                {type === "date" || type === "datetime-local"
                  ? `${value?.toString().slice(4, 6)}/${value
                      ?.toString()
                      .slice(6, 8)}/${value?.toString().slice(0, 4)}`
                  : value}
              </MenuItem>
            );
          })}
        </Box>
      )}
      {group3.includes(comparator) && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ my: 1 }}
              fullWidth
              label="Start value"
              required
              InputLabelProps={{
                shrink: true,
              }}
              type={type}
              onChange={(e) => {
                let valueToCheck: any = e.target.value;
                if (type === "date" || type === "datetime-local") {
                  valueToCheck = valueToCheck.replaceAll("-", "");
                  valueToCheck = Number(valueToCheck);
                }
                handleSetValue([valueToCheck, value[1] || 0]);
                setValue((prev: Array<any>) => {
                  return [valueToCheck, prev[1] || 0];
                });
              }}
            />
            <Box>
              <Typography px={2}>{" - "}</Typography>
            </Box>
            <TextField
              sx={{ my: 1 }}
              fullWidth
              label="End value"
              required
              InputLabelProps={{
                shrink: true,
              }}
              type={type}
              onChange={(e) => {
                let valueToCheck: any = e.target.value;
                if (type === "date" || type === "datetime-local") {
                  valueToCheck = valueToCheck.replaceAll("-", "");
                  valueToCheck = Number(valueToCheck);
                }
                handleSetValue([value[0], valueToCheck]);
                setValue((prev: Array<any>) => {
                  return [prev[0] || 0, valueToCheck];
                });
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              pl: 2,
            }}
            color="text.secondary"
          >
            {helperText}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ComparedValue;
