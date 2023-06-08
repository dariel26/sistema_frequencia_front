import MenuLayout from "../layouts/menu/MenuLayout";
import navs from "../navs/navs";
import FilterUser from "../filters/User";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <FilterUser>
      <MenuLayout
        navs={navs.admin}
        actions={[
          {
            onClick: () => {
              localStorage.removeItem("token");
              navigate("/login");
            },
            name: "Sair",
            icon: <FiLogOut size={18} />,
          },
        ]}
      />
    </FilterUser>
  );
}
