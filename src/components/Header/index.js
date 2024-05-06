import { Typography, Divider, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: "40px",
        }}
      >
        Welcome to My Store
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          margins: "10px",
        }}
      >
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </Button>
        <Button
          onClick={() => {
            navigate("/cart");
          }}
        >
          Cart
        </Button>
      </Box>
    </>
  );
}
