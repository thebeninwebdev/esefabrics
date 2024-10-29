// Define a type for the sub-menu items
interface SubMenuItem {
    name: string; // Name of the sub-menu item
    desc: string; // Description of the sub-menu item
    icon: React.ElementType; // Icon component type
  }
  
  // Define a type for the main menu item
 export interface MainMenuItem {
    name: string; // Name of the main menu item
    subMenuHeading?: string[]; // Headings for the sub-menus
    subMenu?: SubMenuItem[]; // Array of sub-menu items
    gridCols?: number; // Number of grid columns
  }