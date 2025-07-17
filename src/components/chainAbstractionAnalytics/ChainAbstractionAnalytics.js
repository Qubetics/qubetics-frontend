import { Col, Row, Space } from 'antd'
import './ChainAbstractionAnalytics.scss'
import { TickPriceIcon } from '../../../public/SvgIcons'
import { Select } from "antd";

const ChainAbstractionAnalytics = () => {
  const data = [
    { text: 'Total Cross-Chain Transactions', balance: '1.92M', img: < TickPriceIcon /> },
    { text: 'Total Value Locked', balance: '$67.5M', img: < TickPriceIcon /> },
    { text: 'Chains Connected', balance: '17', img: < TickPriceIcon /> }
  ];

  const transactionItems = [
    { value: 'abc', label: 'abc' },
    { value: "bcv", label: 'bcv' },
    { value: "edf", label: 'edf' },
  ];


  return (
    <div className='abstraction_analytics'>
      <Row gutter={[20, 20]}>
        {data.map((item, index) => (
          <Col lg={8} key={index}>
            <div className='abstraction_analytic_card marcketCapCard'>
              <div className='cardSec_items'>
                <div className="cardsitem">
                  <div className="imgIcon">{item.img}</div>
                  <div>
                    <p>{item.text}</p>
                    <h2>{item.balance}</h2>
                  </div>
                </div>
              </div>
              <div className='abstraction_analytic_card_icon'>

              </div>
              <span>
                <h3>{item.title}</h3>
                <h4>{item.subtitle}</h4>
              </span>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]} className='margin-30'>
        <Col lg={12}>
          <div className='abstraction_chart_card'>
            <div className="abstraction_chart_card_head">
              <h3>On Chain Analytics</h3>
              <div className='abstraction_chart_card_right'>
                <h4 className="value">
                  Avg: <span> 2m 34s</span>
                </h4>
                <h4 className="value">
                  Today: <span> 2m 12s</span>
                </h4>
              </div>
            </div>
            <div className='abstraction_chart_card_content'>

            </div>
          </div>
        </Col>
        <Col lg={12}>
          <div className='abstraction_chart_card'>
            <div className="abstraction_chart_card_head">
              <h3>Transaction Load Over Time</h3>
              <div className='abstraction_chart_card_right'>
                <Space wrap>
                  <Select
                    style={{ width: 80 }}
                    options={transactionItems}
                  />
                </Space>
              </div>
            </div>
            <div className='abstraction_chart_card_content'>

            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className='margin-30'>
        <Col lg={12}>
          <div className='abstraction_chart_card'>
            <div className="abstraction_chart_card_head">
              <h3>Top Tokens Transferred</h3>
              <div className='abstraction_chart_card_right'>
                <h4 className="value">
                  <span> $2.7M</span>
                </h4>
              </div>
            </div>
            <div className='abstraction_chart_card_content'>

            </div>
          </div>
        </Col>
        <Col lg={12}>
          <div className='abstraction_chart_card'>
            <div className="abstraction_chart_card_head">
              <h3>Active Users/Day</h3>
              <div className='abstraction_chart_card_right'>

              </div>
            </div>
            <div className='abstraction_chart_card_content'>

            </div>
          </div>
        </Col>
      </Row>
      <div className='abstraction_chart_card margin-30' ></div>

    </div>
  )
}

export default ChainAbstractionAnalytics