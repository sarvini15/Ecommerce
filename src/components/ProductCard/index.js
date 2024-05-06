import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../utils/api_products";
import { useSnackbar } from "notistack";
import { addToCart } from "../../utils/api_cart";
export default function ProductCard(props) {
  const { product } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      enqueueSnackbar("Product is Deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      enqueueSnackbar("Product succesfully added to Cart", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });
  const handleAddToCart = () => {
    addToCartMutation.mutate(product);
  };
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
    <>
      <Card>
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {product.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px",
            }}
          >
            <Typography
              variant="body1"
              style={{
                backgroundColor: "lightgreen",
                borderRadius: "10px",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {product.price}
            </Typography>
            <Typography
              variant="body1"
              style={{
                backgroundColor: "lightyellow",
                borderRadius: "20px",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {product.category}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: "20px" }}
              onClick={() => {
                navigate("/products/" + product._id);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ borderRadius: "20px" }}
              onClick={handleProductDelete}
            >
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
