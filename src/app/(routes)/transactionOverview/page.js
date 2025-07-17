import SearchbarComponent from '@/components/search/SearchbarComponent'
import './TransactionOverview.scss'
import { CopyIcon, CopyIcons } from '../../../../public/SvgIcons'
import baseImg from '../../../../public/basesvg.svg'
import Image from 'next/image'
const TransactionOverview = () => {

  return (
    <div className='transaction_overview'>
      <div className='searchbar container'>
        <SearchbarComponent />
      </div>
      <div className='container'>
        <h2 className='sub_heading'>Transaction Overview</h2>

        <div className="transacton_overview_card transaction_list ">
          <h3 className='status'>Completed</h3>
          <div className="sender_list listing">
            <div className='list_item'>
              <h4>Intent Transaction Hash</h4>
              <h5>ex5ea95239Af8aA2A260de92Fc45898e039øc4fda7fba7793..</h5>
            </div>
            <div className='list_item'>
              <h4>Token</h4>
              <h5>5664.49 USDC ($5663.15)</h5>
            </div>
            <div className='list_item'>
              <h4>Chain</h4>
              <div className="chain">
                <Image src={baseImg} alt="" />
                <h5>Base</h5>
              </div>
            </div>
            <div className='list_item'>
              <h4>Sender Address</h4>
              <h5>5239Af8aA2A260de92Fc45898e039øc4f <span><CopyIcons /></span></h5>
            </div>
            <div className='list_item'>
              <h4>Time Started</h4>
              <h5>22 May 2025 16:03:01</h5>
            </div>
          </div>

          <div className="reciever_list listing">
            <div className='list_item'>
              <h4>Destination Tx Hash</h4>
              <h5>ex5ea9523Af8aA2A260de92Fc45898e039øc4f <span><CopyIcons /></span></h5>
            </div>
            <div className='list_item'>
              <h4>Token</h4>
              <h5>5664.49 USDC ($5663.15)</h5>
            </div>
            <div className='list_item'>
              <h4>Chain</h4>
              <div className='chain'>
                <Image src={baseImg} alt="" />
                <h5>Arbitrum</h5>
              </div>
            </div>
            <div className='list_item'>
              <h4>Recipient Address</h4>
              <h5>5239Af8aA2A260de92Fc45898e039øc4f <span><CopyIcons /></span></h5>
            </div>
            <div className='list_item'>
              <h4>Time Completed</h4>
              <h5>22 May 2025 16:03:01</h5>
            </div>
          </div>
        </div>

        <h2 className='sub_heading'>Metadata</h2>

        <div className="transacton_overview_card metadata_list ">
          <div className="listing">
            <div className='list_item'>
              <h4>Transfer Type</h4>
              <h5>Contract</h5>
            </div>
            <div className='list_item'>
              <h4>Job ID</h4>
              <h5>#123456789</h5>
            </div>
          </div>
          <div className="listing">
            <div className='list_item'>
              <h4>Solver</h4>
              <h5>RouterX</h5>
            </div>
            <div className='list_item'>
              <h4>Token Contract</h4>
              <h5>5239Af8aA2A260de92Fc45898e039øc4f <span><CopyIcons /></span></h5>
            </div>

          </div>
        </div>

        <h2 className='sub_heading'>Fee & Logs</h2>

        <div className="transacton_overview_card fee_list">
          <div className="listing">
            <div className='list_item'>
              <h4>Fees</h4>
              <h5>100 TICS</h5>
            </div>
            <div className='list_item'>
              <h4>Gas Used</h4>
              <h5>23,000</h5>
            </div>
            <div className='list_item'>
              <h4>Gas Price</h4>
              <h5>12 Gwei</h5>
            </div>
          </div>


          <div class="status-log">
            <h4>Status Log</h4>
            <div class="timeline">
              <div class="timeline-item active">
                <div class="circle"></div>
                <div class="content">
                  <p class="label">Submitted</p>
                  <p class="timestamp">22 May 2025 16:03:01</p>
                </div>
              </div>
              <div class="timeline-item active">
                <div class="circle"></div>
                <div class="content">
                  <p class="label">Executed</p>
                  <p class="timestamp">22 May 2025 16:03:45</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="circle"></div>
                <div class="content">
                  <p class="label">Confirmed</p>
                  <p class="timestamp">22 May 2025 16:25:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionOverview