"use client";
import { EXPLORER_CHAIN_NAME } from "@/constant/constant";
import { Col, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { footerLinks, SocialMediaLinks } from "./config/FooterLinks";
import "./Footer.scss";
import { trackEvent } from "@/utils/eventTrack";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const [origin, setOrigin] = useState(""); // State for storing origin
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin.split("//")[1].split("-")[0]); // Set origin once client-side
    }
  }, []);

  const handleTrackEvent = (label) => {
    trackEvent({
      action: "link_click",
      category: "Footer",
      label: label,
    });
  };

  return (
    <section className="footernew">
      <div className="container">
        <Row gutter={[20, 16]} justify="center">
          <Col xs={24} sm={12} lg={7}>
            <h2>
              {" "}
              <Image src="/NewLogo.svg" height={50} width={177} alt="logo" />
            </h2>
            <p>
              Build without limits. Qubetics an interoperable ecosystem uniting
              all leading networks.
            </p>
          </Col>
          {footerLinks.map((section, idx) => (
            <Col key={idx} xs={24} sm={12} lg={4}>
              <h3 className="mb-2 font-semibold">{section.title}</h3>
              <div className="flex flex-col space-y-1">
                {section.items.map((item, i) =>
                  item.disabled ? (
                    <Link
                      href={"#"}
                      style={{
                        cursor: "not-allowed",
                        pointerEvents: "none",
                        color: "gray",
                      }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      key={i}
                      onClick={() => handleTrackEvent(item.label)}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </Col>
          ))}
        </Row>
        <div className="footernew_topFooterItem">
          <h3>Get in touch!</h3>
          <div className="footernew_topFooterItem_socialIcon">
            {SocialMediaLinks.map((item, i) => {
              return (
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={i}
                  onClick={() => handleTrackEvent(item.label)}
                >
                  {item.icon}
                </Link>
              );
            })}
          </div>
        </div>
        <p className="footernew_year">
          {new Date().getFullYear()} Copyright {EXPLORER_CHAIN_NAME}. All rights
          reserved.
        </p>
      </div>
    </section>
  );
};
export default Footer;
