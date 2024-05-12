export function addToCart(item, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex(
    (product) => product._id === item._id
  );
  if (existingProductIndex !== -1) {
    // If the product already exists in the cart, update its quantity
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Otherwise, add the product to the cart with the specified quantity
    cart.push({ ...item, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
export function removeProductFromCart(id) {
  let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  existingCart = existingCart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(existingCart));
}

export function emptyCart() {
  localStorage.removeItem("cart");
}
