import { Col, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Discord,
  Instagram,
  Telegram,
  TikTok,
  Twitter,
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
            <Link href="/token" target="">
              Tokens
            </Link>
            <Link href="/blocks" target="">
              Blockchain
            </Link>
            <Link href="/validators" target="">
              Validators
            </Link>
            {/* <Link href="#" target="">
              Analytics
            </Link> */}
            <Link href="/nodes" target="">
              Nodes
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <h3>About Us</h3>
            <Link
              href="https://www.qubetics.com/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </Link>
            <Link href="https://www.qubetics.com/terms-of-use" target="__blank">
              Terms of Service
            </Link>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <h3>Product & Services</h3>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics Validator App
            </Link>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics Delegator App
            </Link>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics DEX
            </Link>
            <Link
              href=" "
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics App
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <h3>Resources</h3>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Official web
            </Link>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics Network Documentation
            </Link>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics Documentation
            </Link>
            <Link
              href=""
              target=""
              style={{ pointerEvents: "none", color: "gray" }}
            >
              Qubetics IDE
            </Link>
          </Col>
        </Row>
        <div className="footernew_topFooterItem">
          <h3>Get in touch!</h3>
          <div className="footernew_topFooterItem_socialIcon">
            {/* <Link href="" target="">
              <Facebook />
            </Link> */}
            <Link href="https://x.com/qubetics?mx=2" target="_blank">
              <Twitter />
            </Link>
            <Link href="https://www.instagram.com/qubetics" target="_blank">
              <Instagram />
            </Link>
            <Link href="https://www.tiktok.com/@qubetics" target="_blank">
              <TikTok />
            </Link>
            <Link href="https://t.me/qubetics" target="_blank">
              <Telegram />
            </Link>
            <Link href="https://discord.com/invite/KHfSNbzdSE" target="_blank">
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
