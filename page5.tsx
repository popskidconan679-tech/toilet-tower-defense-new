'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InventoryGrid from '@/components/inventory/inventory-grid'
import InventorySearch from '@/components/inventory/inventory-search'
import GameNavigation from '@/components/game-navigation'

export const dynamic = 'force-dynamic'

export default function InventoryPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [units, setUnits] = useState<any[]>([])
  const [filteredUnits, setFilteredUnits] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [rarityFilter, setRarityFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'quantity'>('name')

  useEffect(() => {
    const loadInventory = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/auth/login')
        return
      }
      setUser(data.session.user)

      // Load player units
      const { data: playerUnits } = await supabase
        .from('player_units')
        .select('*, unit_definitions(*)')
        .eq('user_id', data.session.user.id)
        .order('acquired_at', { ascending: false })

      if (playerUnits) {
        setUnits(playerUnits)
        setFilteredUnits(playerUnits)
      }
      setLoading(false)
    }

    loadInventory()
  }, [supabase, router])

  // Filter and search logic
  useEffect(() => {
    let result = [...units]

    // Apply search
    if (searchQuery) {
      result = result.filter((u) =>
        u.unit_definitions?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply rarity filter
    if (rarityFilter) {
      result = result.filter((u) => u.unit_definitions?.rarity === rarityFilter)
    }

    // Apply sorting
    if (sortBy === 'name') {
      result.sort((a, b) =>
        (a.unit_definitions?.name || '').localeCompare(b.unit_definitions?.name || '')
      )
    } else if (sortBy === 'level') {
      result.sort((a, b) => b.level - a.level)
    } else if (sortBy === 'quantity') {
      result.sort((a, b) => b.quantity - a.quantity)
    }

    setFilteredUnits(result)
  }, [units, searchQuery, rarityFilter, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-purple-500/20 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Inventory
          </h1>
          <p className="text-slate-400 text-sm">Total Units: {units.length}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/game')}>
          Back to Game
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Search and Filter Bar */}
        <InventorySearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          rarityFilter={rarityFilter}
          onRarityChange={setRarityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-purple-500/20 p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{units.length}</div>
            <p className="text-slate-400 text-sm">Total Units</p>
          </Card>
          <Card className="bg-slate-900 border-purple-500/20 p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {units.filter((u) => u.unit_definitions?.rarity === 'Supreme').length}
            </div>
            <p className="text-slate-400 text-sm">Supreme</p>
          </Card>
          <Card className="bg-slate-900 border-purple-500/20 p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {units.filter((u) => u.unit_definitions?.rarity === 'Ultimate').length}
            </div>
            <p className="text-slate-400 text-sm">Ultimate</p>
          </Card>
          <Card className="bg-slate-900 border-purple-500/20 p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">
              {units.filter((u) => u.unit_definitions?.rarity === 'Celestial').length}
            </div>
            <p className="text-slate-400 text-sm">Celestial</p>
          </Card>
        </div>

        {/* Units Grid */}
        {filteredUnits.length > 0 ? (
          <InventoryGrid units={filteredUnits} onUnitUpdate={() => {}} />
        ) : (
          <Card className="bg-slate-900 border-purple-500/20 p-12 text-center">
            <p className="text-slate-400 text-lg">
              {searchQuery || rarityFilter ? 'No units match your filters' : 'No units in inventory yet'}
            </p>
            <p className="text-slate-500 text-sm mt-2">Visit the shop to purchase units!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
