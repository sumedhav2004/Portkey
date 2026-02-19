import React from 'react'
import Logo from './logo'


type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h?: number;
};

type Props = {
  data: Array<Coin>
}

const sidebar = (props: Props) => {
  console.log("FROM SIDEBAR: ",props.data)
  return (
    <div className='max-w-xs border w-full h-screen fixed border-sidebar-border flex flex-col justify-between items-center p-4 bg-sidebar-accent'>
      <div className='flex flex-col max-h-[20%] items-start'>
        <Logo size="80" /> 
        <h2 className='text-muted-foreground text-xl'>Portkey</h2>
      </div>

      <div className='overflow-y-scroll flex flex-col w-full h-2/3 no-scrollbar border border-white rounded-md gap-2 p-1'>
        {props.data.map((each) => (
          <div className='w-full flex flex-row items-center justify-between gap-2 p-2'>
            <img src={each.image} alt="" className='w-10' />
            <p className='text-white w-1/3 flex-wrap'>{each.name}</p>
            <p className='text-white font-semibold'>${each.current_price.toFixed(1)}</p>
            <p className={each?.price_change_percentage_24h > 0 ? `text-green-500`:`text-red-500`}>{(each.price_change_percentage_24h)?.toFixed(1)}%</p>
          </div>
        ))}
      </div>

      <div className=''>

      </div>
    </div>
  )
}

export default sidebar