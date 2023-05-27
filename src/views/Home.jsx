import MenuLayout from "../layouts/menu/MenuLayout";
import navs from "../navs/navs";
import FilterUser from "../filters/User";

export default function Home() {
  return (
    <FilterUser>
      <MenuLayout navs={navs.admin} />
    </FilterUser>
  );
}
