import { useEffect, useState } from "react";
import { Container, Typography, Box, Button, IconButton } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Header from "../../components/Header";
import { getCart } from "../../utils/api_cart";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    // Fetch cart items when component mounts
    const cart = getCart();
    setCartItems(cart.map((item) => ({ ...item }))); // Ensure quantity is initialized to 1
  }, []);
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const handleRemoveItem = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };
  return (
    <Container>
      <Header />
      {cartItems.length === 0 ? (
        <Box textAlign="center" mt={3}>
          <Typography variant="h5">Cart is empty</Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="center">${item.price}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.price * item.quantity}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleRemoveItem(index)}
                        sx={{ backgroundColor: "red", color: "white" }}
                      >
                        Remove
                      </Button>{" "}
                      {/* Remove button */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={3} textAlign="right">
            <Typography variant="h6">Total: ${calculateTotal()}</Typography>
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
