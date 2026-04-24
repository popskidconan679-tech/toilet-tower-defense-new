'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface InventorySearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  rarityFilter: string | null
  onRarityChange: (rarity: string | null) => void
  sortBy: 'name' | 'level' | 'quantity'
  onSortChange: (sort: 'name' | 'level' | 'quantity') => void
}

export default function InventorySearch({
  searchQuery,
  onSearchChange,
  rarityFilter,
  onRarityChange,
  sortBy,
  onSortChange,
}: InventorySearchProps) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Input
        placeholder="Search units by name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-slate-900 border-purple-500/30 placeholder:text-slate-500"
      />

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-2">
        {/* Rarity Filters */}
        <Badge
          variant={rarityFilter === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onRarityChange(null)}
        >
          All Rarities
        </Badge>
        {['Supreme', 'Ultimate', 'Celestial'].map((rarity) => (
          <Badge
            key={rarity}
            variant={rarityFilter === rarity ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onRarityChange(rarityFilter === rarity ? null : rarity)}
          >
            {rarity}
          </Badge>
        ))}

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Sort by: {sortBy === 'name' ? 'Name' : sortBy === 'level' ? 'Level' : 'Quantity'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700">
            <DropdownMenuItem onClick={() => onSortChange('name')} className="cursor-pointer">
              By Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('level')} className="cursor-pointer">
              By Level
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('quantity')} className="cursor-pointer">
              By Quantity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
