import { CiBag1, CiBoxes, CiClock1, CiCoinInsert, CiDeliveryTruck, CiFileOn, CiMap, CiMemoPad, CiShoppingCart, CiTrash, CiUnlock, CiViewList } from "react-icons/ci";

export const Menus = [
  {
    name: "Deals",
    subMenuHeading: ["Design", "Scale"],
    subMenu: [
      {
        name: "New Arrivals",
        desc: "recently added products.",
        icon: CiMemoPad,
      },
      {
        name: "Best Sellers",
        desc: "popular or top-rated products.",
        icon: CiCoinInsert,
      },
      {
        name: "Limited Edition",
        desc: "limited-time products.",
        icon: CiClock1,
      },
    ],
    gridCols: 2,
  },
  {
    name: "Account",
    subMenuHeading: ["Get started", "Programs", "Recent"],
    subMenu: [
      {
        name: "Orders",
        desc: "View, track, and manage orders.",
        icon: CiBag1,
      },
      {
        name: "Wishlist",
        desc: "Save favorites for future purchases.",
        icon: CiMap,
      },
      {
        name: "Cart",
        desc: "Review items before completing purchase.",
        icon: CiShoppingCart,
      },
      {
        name: "Close Account",
        desc: "Permanently delete your account here.",
        icon: CiTrash,
      },
      {
        name: "Store locator",
        desc: "Locate stores based on address.",
        icon: CiTrash,
      }
    ],
    gridCols: 2,
  },
  {
    name: "Support",
    subMenu: [
      {
        name: "FAQs",
        desc: "A section addressing common questions about orders, shipping, returns, and payments.",
        icon: CiFileOn,
      },
      {
        name: "Shipping & delivery",
        desc: "Information on shipping options, delivery times, and any international shipping policies.",
        icon: CiDeliveryTruck,
      },
      {
        name: "Returns & Refunds",
        desc: "Details on your return policy, how to initiate returns, and the refund process.",
        icon: CiBoxes,
      },
      {
        name:"Terms and conditions",
        desc:"",
        icon: CiViewList
      },
      {
        name:"Privacy Policy",
        desc:"",
        icon: CiUnlock
      },
    ],
    gridCols: 2,
  },
  {
    name: "About us",
  },
  {
    name: "Pricing",
  },
  {
    name: "Contact",
  },
];