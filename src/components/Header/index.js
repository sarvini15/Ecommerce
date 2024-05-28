import { Typography, Divider, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { emptyCart } from "../../utils/api_cart";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const location = useLocation();
  const navigate = useNavigate();

  let pageTitle = "Welcome to My Store";

  if (location.pathname === "/cart") {
    pageTitle = "Cart";
  } else if (location.pathname === "/checkout") {
    pageTitle = "Checkout";
  } else if (location.pathname === "/orders") {
    pageTitle = "My Orders";
  } else if (location.pathname === "/login") {
    pageTitle = "Login";
  } else if (location.pathname === "/signup") {
    pageTitle = "Create A New Account";
  }

  const handleLogout = () => {
    // remove the currentUser cookie
    removeCookie("currentUser");
    // empty the cart
    emptyCart();
    // redirect back to login
    navigate("/login");
  };

  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "20px",
          marginBottm: "20px",
          fontWeight: "bold",
          fontSize: "40px",
        }}
      >
        {pageTitle}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Button>
          <Button
            style={{
              color: location.pathname === "/cart" ? "white" : "#0288d1",
              backgroundColor:
                location.pathname === "/cart" ? "#0288d1" : "white",
            }}
            onClick={() => {
              navigate("/cart");
            }}
          >
            Cart
          </Button>
          <Button
            style={{
              textTransform: "capitalize",
              color: location.pathname === "/orders" ? "white" : "#0288d1",
              backgroundColor:
                location.pathname === "/orders" ? "#0288d1" : "white",
            }}
            onClick={() => {
              navigate("/orders");
            }}
          >
            My Orders
          </Button>
          {currentUser && currentUser.role === "admin" ? (
            <Button
              style={{
                textTransform: "capitalize",
                color:
                  location.pathname === "/categories" ? "white" : "#0288d1",
                backgroundColor:
                  location.pathname === "/categories" ? "#0288d1" : "white",
              }}
              onClick={() => {
                navigate("/categories");
              }}
            >
              Categories
            </Button>
          ) : null}
        </Box>
        {currentUser ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Current User: {currentUser.name}</span>
            <Button
              style={{
                textTransform: "capitalize",
              }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex" }}>
            <Button
              style={{
                textTransform: "capitalize",
                color: location.pathname === "/login" ? "white" : "#0288d1",
                backgroundColor:
                  location.pathname === "/login" ? "#0288d1" : "white",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              style={{
                textTransform: "capitalize",
                color: location.pathname === "/signup" ? "white" : "#0288d1",
                backgroundColor:
                  location.pathname === "/signup" ? "#0288d1" : "white",
              }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
      <Divider />
    </>
  );
}
