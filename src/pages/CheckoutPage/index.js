import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
} from "@mui/material";
import Header from "../../components/Header";
import { getCart , emptyCart  } from "../../utils/api_cart";
import { addNewOrder } from "../../utils/api_order";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addNewOrderMutation = useMutation({
    mutationFn: addNewOrder,
    onSuccess: (responseData) => {
      // remove all the items from the cart
      emptyCart();
      // get the billplz url (responseData.billplz_url)
      const billplz_url = responseData.billplz_url;
      // redirect user to billplz payment page
      window.location.href = billplz_url;
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });;

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total = total + item.quantity * item.price;
    });
    return total.toFixed(2);
  };

  const handleCheckout = () => {
    // when user click the "Pay button", check if they have filled up the required fields and also if cart is not empty
    if (name === "" || email === "") {
      enqueueSnackbar("Please fill up all the fields", {
        variant: "error",
      });
    } else if (!(cart && cart.length > 0)) {
      enqueueSnackbar("Your cart is empty", {
        variant: "error",
      });
    } else {
      // perform the checkout process
      addNewOrderMutation.mutate({
        customerName: name,
        customerEmail: email,
        products: cart,
        totalPrice: calculateTotal(),
        token: token
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Header />
      <Grid
        container
        spacing={2}
        sx={{
          paddingTop: "60px",
          flexDirection: {
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
          },
        }}
      >
        <Grid item xs={12} md={7}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            Contact Information
          </Typography>

          <Typography>Name</Typography>
          <TextField
            required
            placeholder="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Typography>Email</Typography>
          <TextField
            required
            placeholder="email address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={handleCheckout}
          >
            Pay ${calculateTotal()}
            now
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            Your order summary
          </Typography>
          {/* .map here */}
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="body1">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${calculateTotal()}</Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
