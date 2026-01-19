interface NavLink {
  href: string;
  label: string;
}

export const links: NavLink[] = [
  { href: "/", label: "login" },
  { href: "/ecommerce/dashboard/overview", label: "overview" },
  { href: "/ecommerce/dashboard/analytics", label: "analytics" },
  { href: "/ecommerce/analytics/reports", label: "reports" },
  { href: "/ecommerce/analytics/metrics", label: "metrics" },
  { href: "/ecommerce/orders/all", label: "orders" },
  { href: "/ecommerce/orders/pending", label: "pending" },
  { href: "/ecommerce/orders/completed", label: "completed" },
  { href: "/ecommerce/products/all", label: "products" },
  { href: "/ecommerce/products/categories", label: "categories" },
  { href: "/ecommerce/customers", label: "customers" },
  { href: "/ecommerce/settings", label: "settings" },
];
