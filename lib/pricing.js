export function productPriceForUser(product, user) {
  return user?.resellerStatus === "approved" && product.resellerPrice ? product.resellerPrice : product.price;
}
