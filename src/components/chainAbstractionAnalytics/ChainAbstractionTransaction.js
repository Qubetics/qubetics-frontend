'use client';
import { Table, Tag } from 'antd';
import './ChainAbstractionAnalytics.scss';
import { ArrowUpicon, BNBIcon } from '../../../public/SvgIcons';

const ChainAbstractionTransaction = () => {
  const columns = [
    {
      title: 'Intent Transaction',
      dataIndex: 'intentTx',
      key: 'intentTx',
      render: (_, record) => (
        <div className="tx-cell">
          <span>{record.intentTx}</span>
          <div className="tx-date">{record.date}</div>
        </div>
      ),
    },
    {
      title: 'Source Token',
      key: 'source',
      render: (_, record) => (
        <div className="token-cell">
          <span>
            {record.source.icon}
          </span>
          <div className='token-cell-in'>
            <p>{record.source.amount} {record.source.symbol}</p>
            <span className='chain-tag'>
              <h3>
                {record.source.chain}
              </h3>
              <ArrowUpicon />
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Destination Token',
      key: 'destination',
      render: (_, record) => (
        <div className="token-cell">
          <span>
            {record.destination.icon}
          </span>
          <div className='token-cell-in'>
            <p>{record.destination.amount} {record.destination.symbol}</p>
            <span className='chain-tag'>
              <h3>
                {record.destination.chain}
              </h3>
              <ArrowUpicon />
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Transfer Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <p className="status-tag">{status}</p>
      ),
    },
    {
      title: 'Destination Transaction',
      key: 'destTx',
      render: (_, record) => (
        <div className="tx-cell">
          <span>{record.destTx}</span>
          <div className="tx-date">{record.date}</div>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <span className="view-action">View</span>,
    },
  ];

  const transactions = [
    {
      key: 1,
      intentTx: '0xX9f...6c2sd8',
      date: '22 May 2025 17:41:52',
      source: {
        amount: '0.01002958',
        symbol: 'BNB',
        icon: <BNBIcon />,
        chain: 'Matechain',
      },
      destination: {
        amount: '0.01002958',
        symbol: 'BNB',
        icon: <BNBIcon />,
        chain: 'BNB',
      },
      type: 'Send',
      status: 'Completed',
      destTx: 'exf9f...6c2sd8',
    },
    {
      key: 1,
      intentTx: '0xX9f...6c2sd8',
      date: '22 May 2025 17:41:52',
      source: {
        amount: '0.01002958',
        symbol: 'BNB',
        icon: <BNBIcon />,
        chain: 'Matechain',
      },
      destination: {
        amount: '0.01002958',
        symbol: 'BNB',
        icon: <BNBIcon />,
        chain: 'BNB',
      },
      type: 'Send',
      status: 'Completed',
      destTx: 'exf9f...6c2sd8',
    },
    {
      key: 1,
      intentTx: '0xX9f...6c2sd8',
      date: '22 May 2025 17:41:52',
      source: {
        amount: '0.01002958',
        symbol: 'BNB',
        icon: <BNBIcon />,
        chain: 'Matechain',
      },
      destination: {
        amount: '0.01002958',
        symbol: 'BNB',
        icon: <BNBIcon />,
        chain: 'BNB',
      },
      type: 'Send',
      status: 'Completed',
      destTx: 'exf9f...6c2sd8',
    },
  ];

  return (
    <div className='abstraction_transaction'>
      <Table
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={transactions}
        pagination={false}
        className="commontable custom-transaction-table "
      />
    </div>
  );
};

export default ChainAbstractionTransaction;
