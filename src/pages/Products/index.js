import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Container,
} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../utils/api_categories";
import { getProducts } from "../../utils/api_products";
import { useCookies } from "react-cookie";

export default function Products() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  // load the categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // load the products
  const { data: products = [] } = useQuery({
    queryKey: ["products", category, perPage, page],
    queryFn: () => getProducts(category, perPage, page),
  });

  return (
    <Container>
      <Header />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            marginLeft: "10px",
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Products
        </Typography>
        {role && role === "admin" ? (
          <Button
            variant="contained"
            sx={{
              marginLeft: "auto",
              marginRight: "10px",
              marginTop: "10px",
              backgroundColor: "#1BA930",
            }}
            onClick={() => {
              navigate("/add");
            }}
          >
            Add New
          </Button>
        ) : null}
      </div>
      <FormControl
        sx={{ marginTop: "10px", width: "200px", marginLeft: "10px" }}
      >
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          label="Product"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            // reset the page to 1
            setPage(1);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((category) => {
            // [ "cat1", "cat2", "cat3" ]
            /*
            [ 
              {
                id: '12313'
                name: "cat1'
              } 
            ]
            */
            return (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {products
          ? products.map((product) => (
              <Grid key={product._id} item xs={12} md={6} lg={4}>
                <ProductCard product={product} />
              </Grid>
            ))
          : null}
        {products && products.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" sx={{ padding: "10px 0" }}>
              No items found.
            </Typography>
          </Grid>
        ) : null}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
          padding: "20px 0",
        }}
      >
        <Button
          disabled={page === 1 ? true : false}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>Page: {page}</span>
        <Button
          disabled={products.length === 0 ? true : false}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}
