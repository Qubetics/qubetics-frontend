import { Col, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Discord,
  Facebook,
  Instagram,
  Telegram,
  TikTok,
  Twitter
} from "../../../public/SvgIcons";
import "./Footer.scss";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const pathname = usePathname();

  return (
    <section
      // // style={{ display: pathname === Routes.HOME && "block" }}
      // className={`footer`}
      className="footernew"
    >
      <div className="container">
        <Row gutter={[16, 16]} justify="center">
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
          <Col xs={24} sm={12} lg={4}>
            <h3>Quick Links</h3>
            <Link href="#" target="_blank">
              Tokens
            </Link>
            <Link href="#" target="__blank">
              Blockchain
            </Link>
            <Link href="#" target="__blank">
              Validators
            </Link>
            <Link href="#" target="__blank">
              Analytics
            </Link>
            <Link href="#" target="__blank">
              Nodes
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <h3>About Us</h3>
            <Link href="" target="_blank">
              Privacy Policy
            </Link>
            <Link href="" target="__blank">
              Terms of Service
            </Link>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <h3>Product & Services</h3>
            <Link href="" target="_blank">
              Qubetics Validator App
            </Link>
            <Link href="" target="_blank">
              Qubetics Delegator App
            </Link>
            <Link href="" target="_blank">
              Qubetics DEX
            </Link>
            <Link href=" " target="_blank">
              Qubetics App
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <h3>Resources</h3>
            <Link href="" target="_blank">
              Official web
            </Link>
            <Link href="" target="_blank">
              Qubetics Network Documentation
            </Link>
            <Link href="" target="_blank">
              Qubetics Documentation
            </Link>
            <Link href="" target="_blank">
              Qubetics IDE
            </Link>
          </Col>
        </Row>
        <div className="footernew_topFooterItem">
          <h3>Get in touch!</h3>
          <div className="footernew_topFooterItem_socialIcon">
            <Link href="" target="_blank">
              <Facebook />
            </Link>
            <Link href="" target="_blank">
              <Twitter />
            </Link>
            <Link href="" target="_blank">
              <Instagram />
            </Link>
            <Link href="" target="_blank">
              <TikTok />
            </Link>
            <Link href="" target="_blank">
              <Telegram />
            </Link>
            <Link href="" target="_blank">
              <Discord />
            </Link>

     
          </div>
          {/* <div
            className="footernew_topFooterItem_backTopTop"
            onClick={scrollToTop}
          >
            <span className="rotateIcon">
              <Uparrow />
            </span>
            <p>Back to Top</p>
          </div> */}
        </div>
        <p className="footernew_year">
          {/* © 2024 {EXPLORER_CHAIN_NAME}. All Rights Reserved. */}
          ©2024 Copyright Qubetics. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
