import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getProduct, updateProduct } from "../../utils/api_products";
import { uploadImage } from "../../utils/api_images";
import { useCookies } from "react-cookie";

import { getCategories } from "../../utils/api_categories";

export default function ProductsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  // get data from product api: /products/:id
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });

  // load the categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // when data is fetched from API, set the states for all the fields with its current value
  useEffect(() => {
    // if product is not undefined
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setImage(product.image ? product.image : "");
    }
  }, [product]);

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Product is updated", {
        variant: "success",
      });
      // redirect back to home page
      navigate("/");
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // trigger the mutation to call the API
    updateProductMutation.mutate({
      id: id,
      name: name,
      description: description,
      price: price,
      category: category,
      image: image,
      token: token,
    });
  };

  // upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image_url);
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleImageUpload = (event) => {
    uploadImageMutation.mutate(event.target.files[0]);
  };

  // if API data is still loading
  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  // if there is an error in API call
  if (error) {
    return <Container>{error.response.data.message}</Container>;
  }

  return (
    <Container>
      <Header />
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              margin: "20px 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Edit Product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ marginTop: "10px", width: "200px", marginLeft: "10px" }}
              >
                <InputLabel id="product-select-label">Category</InputLabel>
                <Select
                  labelId="product-select-label"
                  id="product-select"
                  label="Category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                  }}
                >
                  {categories.map((category) => {
                    return (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {image !== "" ? (
                <>
                  <div>
                    <img
                      src={
                        "https://psychic-fiesta-9qr479q7xq3646-5000.app.github.dev/" +
                        image
                      }
                      width="300px"
                      height="300px"
                    />
                  </div>
                  <Button onClick={() => setImage("")}>Remove Image</Button>
                </>
              ) : (
                <input
                  type="file"
                  multiple={false}
                  onChange={handleImageUpload}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleFormSubmit}>
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
