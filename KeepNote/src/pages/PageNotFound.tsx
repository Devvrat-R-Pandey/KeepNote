import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      textAlign="center"
      gap={2}
    >
      <Typography variant="h3" fontWeight={600} color="error">
        404
      </Typography>

      <Typography variant="h5" fontWeight={500}>
        Page not found
      </Typography>

      <Typography variant="body1" color="text.secondary">
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/home")}
        sx={{ mt: 2 }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default PageNotFound;