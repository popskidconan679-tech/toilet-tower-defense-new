'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ShopCurrencyProps {
  playerStats: any
}

export default function ShopCurrency({ playerStats }: ShopCurrencyProps) {
  const gemPackages = [
    { gems: 100, price: '$4.99', originalPrice: '$5.99', discount: '17%' },
    { gems: 500, price: '$19.99', originalPrice: '$24.99', discount: '20%' },
    { gems: 1200, price: '$39.99', originalPrice: '$49.99', discount: '20%' },
    { gems: 2800, price: '$79.99', originalPrice: '$99.99', discount: '20%' },
    { gems: 6200, price: '$149.99', originalPrice: '$199.99', discount: '25%' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300">
          💎 Gems can be earned in Endless Mode (100 gems per wave) or purchased here.
        </p>
      </div>

      {/* Current Gems */}
      <Card className="bg-slate-900 border-purple-500/20 p-6 text-center">
        <div className="text-6xl font-bold text-blue-400 mb-2">{playerStats?.gems || 0}</div>
        <p className="text-slate-400">Current Gems</p>
      </Card>

      {/* Gem Packages */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-purple-400">Gem Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gemPackages.map((pkg, idx) => (
            <Card key={idx} className="bg-slate-900 border-purple-500/20 p-4 hover:border-purple-500/50 transition relative overflow-hidden">
              {pkg.discount && (
                <div className="absolute -right-8 -top-2 bg-red-600 text-white px-8 py-1 rotate-45 text-xs font-bold">
                  -{pkg.discount}
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-400">{pkg.gems}</span>
                  <span className="text-xs text-slate-400 line-through">{pkg.originalPrice}</span>
                </div>
                <p className="text-sm text-slate-400">{pkg.price} USD</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Buy Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Exchange Section */}
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-lg font-bold text-purple-400 mb-4">Exchange Rates</h3>
        <Card className="bg-slate-900 border-purple-500/20 p-4">
          <div className="space-y-2 text-slate-400">
            <p className="flex justify-between">
              <span>1 Gem = 0.1 Coins</span>
              <span className="text-slate-300">(Coming soon)</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
