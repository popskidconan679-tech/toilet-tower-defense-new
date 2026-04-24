'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VIP_BONUSES } from '@/lib/game-constants'

interface ShopVIPProps {
  playerStats: any
  onPurchase: () => void
}

export default function ShopVIP({ playerStats, onPurchase }: ShopVIPProps) {
  return (
    <div className="space-y-6">
      {/* VIP Banner */}
      <div className="relative overflow-hidden rounded-lg border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6">
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">🌟 VIP Membership</h2>
          <p className="text-yellow-300">Join the elite and get exclusive benefits!</p>
        </div>
      </div>

      {/* VIP Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-purple-500/20 p-6">
          <h3 className="font-bold text-lg text-yellow-400 mb-4">Monthly Benefits</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span>Coin Multiplier</span>
              </span>
              <Badge className="bg-yellow-600/50 text-yellow-300 border-yellow-500/50 text-lg px-3 py-1">
                x{VIP_BONUSES.coinMultiplier}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span>Gem Multiplier</span>
              </span>
              <Badge className="bg-blue-600/50 text-blue-300 border-blue-500/50 text-lg px-3 py-1">
                x{VIP_BONUSES.gemMultiplier}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Luck Multiplier</span>
              </span>
              <Badge className="bg-purple-600/50 text-purple-300 border-purple-500/50 text-lg px-3 py-1">
                x{VIP_BONUSES.luckMultiplier}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                <span>Unit Cost Discount</span>
              </span>
              <Badge className="bg-green-600/50 text-green-300 border-green-500/50 text-lg px-3 py-1">
                30% OFF
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900 border-purple-500/20 p-6">
          <h3 className="font-bold text-lg text-yellow-400 mb-4">What You Get</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex gap-2">
              <span className="text-yellow-400">✓</span>
              <span>3x Coin rewards</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">✓</span>
              <span>3x Gem rewards</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">✓</span>
              <span>3x Luck gains</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">✓</span>
              <span>30% discount on all units</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">✓</span>
              <span>VIP badge on profile</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400">✓</span>
              <span>Priority support</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Pricing */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-purple-400">Choose Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: '1 Month', price: 599, months: 1 },
            { name: '3 Months', price: 1499, months: 3, discount: '17%' },
            { name: '1 Year', price: 4999, months: 12, discount: '30%', popular: true },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={`p-4 relative ${
                plan.popular
                  ? 'border-2 border-yellow-500/50 bg-gradient-to-b from-yellow-600/20 to-slate-900'
                  : 'bg-slate-900 border-purple-500/20'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold">
                  BEST VALUE
                </Badge>
              )}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-lg">{plan.name}</h4>
                  {plan.discount && (
                    <p className="text-sm text-green-400">Save {plan.discount}!</p>
                  )}
                </div>
                <div className="text-3xl font-bold text-yellow-400">{plan.price}</div>
                <p className="text-sm text-slate-400">
                  {plan.months === 1
                    ? '30 days'
                    : `${plan.months} months`}
                  {' '}of VIP
                </p>
                <Button
                  className={`w-full font-bold ${
                    plan.popular
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Purchase
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <h4 className="font-bold mb-2 text-slate-300">VIP Details</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• All multipliers stack together</li>
          <li>• Renews automatically (cancel anytime)</li>
          <li>• Discount applies to all unit purchases</li>
          <li>• Multipliers apply to all game modes</li>
        </ul>
      </Card>
    </div>
  )
}
