import MainLayout from "./MainLayout";
import BlankLayout from "./BlankLayout";

export const Layouts: { [key: string]: (_props: any) => JSX.Element } = {
  BlankLayout,
  MainLayout,
};
