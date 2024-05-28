import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Typography, Button, Card, CardContent, Box } from "@mui/material";
import { deleteProduct } from "../../utils/api_products";
import { addToCart } from "../../utils/api_cart";
import { useCookies } from "react-cookie";

export default function ProductCard(props) {
  const { product } = props;
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Product has been added to cart successfully.", {
        variant: "success",
      });
      // reset the cart data
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Product is deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleProductDelete = (event) => {
    event.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirm) {
      deleteProductMutation.mutate(product._id);
    }
  };

  return (
    <Card>
      <CardContent>
        <img
          src={
            "http://localhost:5000/" +
            (product.image && product.image !== ""
              ? product.image
              : "uploads/default image.jpg")
          }
          width="100%"
        />

        <Typography fontWeight={"bold"}>{product.name}</Typography>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <Typography
            variant="p"
            style={{ backgroundColor: "#EBFBEE", color: "#6ACF7E" }}
          >
            {product.price}
          </Typography>
          <Typography
            variant="p"
            style={{ backgroundColor: "#FFF4E6", color: "#FD882B" }}
          >
           {product.category && product.category.name
              ? product.category.name
              : ""}
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => {
            if (currentUser && currentUser.email) {
              addToCartMutation.mutate(product);
            } else {
              enqueueSnackbar("Please login first");
            }
          }}
        >
          Add To Cart
        </Button>
        {role && role === "admin" ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px 0",
            }}
          >
            <Button
              variant="contained"
              style={{ borderRadius: "17px" }}
              color="primary"
              onClick={() => {
                navigate("/products/" + product._id);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              style={{ borderRadius: "17px" }}
              color="error"
              onClick={handleProductDelete}
            >
              Delete
            </Button>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
