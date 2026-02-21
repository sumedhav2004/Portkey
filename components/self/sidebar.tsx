import React from 'react'
import Logo from './logo'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


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
  return (
    <div className='max-w-xs border w-full h-screen fixed border-sidebar-border flex flex-col justify-between items-center p-4 bg-sidebar-accent'>
      <div className='flex flex-col max-h-[20%] items-start'>
        <Logo size="80" /> 
        <h2 className='text-muted-foreground text-xl'>Portkey</h2>
      </div>

      <div className="w-full h-2/3 overflow-y-auto no-scrollbar overflow-x-hidden border border-border rounded-lg">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="truncate">Name</TableHead>
              <TableHead className="text-right w-20">Price</TableHead>
              <TableHead className="text-right w-20">24h</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {props.data.map((each, i) => (
              <TableRow
                key={i}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="w-12">
                  <img
                    src={each.image}
                    alt={each.name}
                    className="w-8 h-8 rounded-full object-contain"
                  />
                </TableCell>

                <TableCell className="font-medium text-muted-foreground truncate">
                  {each.name}
                </TableCell>

                <TableCell className="text-right text-muted-foreground">
                  ${each.current_price.toFixed(2)}
                </TableCell>

                <TableCell
                  className={`text-right font-medium ${
                    (each.price_change_percentage_24h ?? 0) > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {(each.price_change_percentage_24h ?? 0).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      <div className=''>

      </div>
    </div>
  )
}

export default sidebar