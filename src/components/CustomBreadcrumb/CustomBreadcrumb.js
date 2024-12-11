// CustomBreadcrumb.jsx
import React from "react";
import { Breadcrumb } from "antd";
import { BreadCrumbArrow } from "../../../public/SvgIcons";

const CustomBreadcrumb = ({ items, activeIndex, activeClassName }) => {
  return (
    <div className="commonBreadcrumb">
      <Breadcrumb separator={<BreadCrumbArrow />}>
        {items.map((item, index) => (
          <Breadcrumb.Item
            key={index}
            href={item.href}
            className={index === activeIndex ? activeClassName : ""}
          >
            {item.icon && <item.icon />}
            <span>{item.label}</span>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default CustomBreadcrumb;
