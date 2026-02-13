import React from "react";
import { Modal } from "antd";
import Link from "next/link";
import saveProxy from "@/services/saveProxy";
import { customToast } from "@/components/common/toast";
import { CONTARCT_NULL_ADDRESS } from "@/constant/constant";
const ProxyModal = ({
  isModalOpen,
  setIsModalOpen,
  implementationAddress,
  proxyVerified,
  hash,
}) => {
  const handleOk = async () => {
    if (proxyVerified == 1) {
      const isProxySave = await saveProxy(hash);
      if (isProxySave) {
        customToast.success("Successfully Saved");
        setIsModalOpen(false);
      }
    } else {
      setIsModalOpen(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title="Proxy Contract Verification Page"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={proxyVerified == 1 && "Save"}
        cancelText={proxyVerified == 1 ? "Cancel" : ""}
      >
        <div
          style={{
            backgroundColor: proxyVerified === 0 ? "#e9bebe" : "#abe7da",
            padding: "15px",
            paddingBottom: 0,
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        >
          {implementationAddress !== CONTARCT_NULL_ADDRESS && (
            <h4>
              The proxy contract verification completed with the message:{" "}
            </h4>
          )}

          <br />
          {proxyVerified == 0 &&
          implementationAddress !== CONTARCT_NULL_ADDRESS ? (
            <p style={{ color: "#d74343" }}>
              The implementation contract at{" "}
              <Link href={`/contract/${implementationAddress}`}>
                {implementationAddress}
              </Link>{" "}
              does not seem to be verified.
            </p>
          ) : proxyVerified == 0 &&
            implementationAddress == CONTARCT_NULL_ADDRESS ? (
            <p style={{ color: "#d74343" }}>
              <h3>
                You have no implementation address for this Proxy to verified
              </h3>
            </p>
          ) : (
            <p style={{ color: "#1C7C5E" }}>
              The Proxy's {hash} implementation contract is found at{" "}
              <Link href={`/contract/${implementationAddress}`}>
                {implementationAddress}
              </Link>{" "}
            </p>
          )}
          <br />
        </div>
        <div style={{ backgroundColor: "white" }}>
          {proxyVerified == 0 ? (
            <p>
              Please verify and publish the contract source before proceeding
              with this proxy verification.
            </p>
          ) : (
            <p>
              If this is correct, please click Save and the implementation
              address will be saved
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};
export default ProxyModal;
