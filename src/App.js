import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { CookiesProvider } from "react-cookie";

import Products from "./pages/Products";
import ProductsAddNew from "./pages/ProductsAddNew";
import ProductsEdit from "./pages/ProductsEdit";

import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import Order from "./pages/OrdersPage";
import PaymentVerify from "./pages/PaymentVerify";
import CategoriesPage from "./pages/CategoriesPage";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={1500}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/add" element={<ProductsAddNew />} />
                <Route path="/products/:id" element={<ProductsEdit />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/verify-payment" element={<PaymentVerify />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
