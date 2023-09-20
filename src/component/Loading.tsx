/* eslint-disable react/react-in-jsx-scope */
import { Box, Typography } from "@mui/material";

function Loading() {
  return (
    <Box
    sx={{
      padding: "0",
      margin: "0",
      alignItems: "center",
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      backgroundColor: "#FEF8D9",
    }}>
      <Typography
      sx={{
        color: "#006064",
        fontSize: "1.8rem",
        fontWeight: "bold",
        textAlign: "center",
      }}>
        Carregando...
        </Typography>
    </Box>
  );
}

export default Loading;