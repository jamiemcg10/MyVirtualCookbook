import AddTile from './AddTile'
import NotesTile from './NotesTile'
import OrganizeTile from './OrganizeTile'
import { Card } from '@mui/material'

type TileType = 'add' | 'organize' | 'notes'

function Tile(props: { type: TileType }) {
  switch (props.type) {
    case 'add':
      return <AddTile />
    case 'organize':
      return <OrganizeTile />
    case 'notes':
      return <NotesTile />
  }
}

export default function HomePageTile(props: { type: TileType }) {
  return (
    <Card className="flex flex-col shrink-0 items-center justify-around w-40 h-40 m-6 text-white bg-[#606060]">
      <Tile type={props.type} />
    </Card>
  )
}
