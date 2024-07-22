import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
export const Search = ({ setSearchQuery }) => {
  return (
    <Card
      sx={{
        boxShadow: 3,
        mt: 3,
        mx: 5,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{}}>
        Search:
        <TextField
          id="search-bar"
          className="text"
          onInput={(e) => {
            setSearchQuery(e.target.value);
          }}
          label="Search"
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{ ml: 2 }}
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <p style={{ whiteSpace: "nowrap" }}>Sort by : </p>
        <FormControl sx={{ width: "100px" }}>
          <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
            Recent
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            // onChange={handleChange}
          >
            <MenuItem value={1}>Recent</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Card>
  );
};
