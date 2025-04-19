// import Link from "next/link"

import { Link } from "react-router";

interface NavItemProps {
  label: string,
  link: string,


}

const NavItem: React.FC<NavItemProps> = ({ label, link }) => {
  return (
    <Link
      to={link}
      className={`relative text-richblack-5 hover:text-[#1ecdf8] py-2 rounded-md text-base font-normal whitespace-nowrap
        after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#1ecdf8] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`}
    >
      {label}
    </Link>

  );
}

export default NavItem;
