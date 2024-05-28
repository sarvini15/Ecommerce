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
  TextField,
  Grid,
  Box,
  Container,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import {
  getCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
} from "../../utils/api_categories";

export default function CategoriesPage() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [category, setCategory] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryID, setEditCategoryID] = useState("");

  // load the categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const addNewCategoryMutation = useMutation({
    mutationFn: addNewCategory,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Category has been added successfully.", {
        variant: "success",
      });
      // reset the categories data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      // reset the category name field
      setCategory("");
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Category has been updayed successfully.", {
        variant: "success",
      });
      // reset the categories data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      // close modal
      setOpenEditModal(false);
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Category has been deleted successfully.", {
        variant: "success",
      });
      // reset the categories data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
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
          Categories
        </Typography>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        <TextField
          label="Category Name"
          variant="outlined"
          sx={{ width: "100%" }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            addNewCategoryMutation.mutate({
              name: category,
              token: token,
            });
          }}
        >
          Add
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={"70%"}>Name</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((item) => {
              return (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          // open the edit modal
                          setOpenEditModal(true);
                          // set the edit category field to its name as value
                          setEditCategoryName(item.name);
                          // set the edit category id so that we know which category to update
                          setEditCategoryID(item._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          deleteCategoryMutation.mutate({
                            _id: item._id,
                            token: token,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ width: "100%", marginTop: "15px" }}
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              updateCategoryMutation.mutate({
                _id: editCategoryID,
                name: editCategoryName,
                token: token,
              });
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
