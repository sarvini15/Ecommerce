import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";

import { signUpUser } from "../../utils/api_user";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const { enqueueSnackbar } = useSnackbar();
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      // save current logged-in user data into cookies
      setCookie("currentUser", data, {
        maxAge: 60 * 60 * 24 * 30, // 3600 * 24 = 24 hours * 30 = 1 month
      });
      enqueueSnackbar("Successfully created account", { variant: "success" });
      // redirect to home page
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "danger" });
    },
  });

  const handleSignUp = () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      enqueueSnackbar("All fields are required", { variant: "danger" });
    } else if (password !== confirmPassword) {
      enqueueSnackbar("Password must be match.", { variant: "danger" });
    } else {
      signUpMutation.mutate({
        name,
        email,
        password,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Header />
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <Typography>Name</Typography>
              <TextField
                required
                fullWidth
                variant="outlined"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Email</Typography>
              <TextField
                required
                fullWidth
                variant="outlined"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Password</Typography>
              <TextField
                required
                fullWidth
                variant="outlined"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Confirm Password</Typography>
              <TextField
                required
                fullWidth
                variant="outlined"
                type="password"
                placeholder="Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                style={{
                  textTransform: "capitalize",
                }}
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
