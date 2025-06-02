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
    <Card
      className="flex flex-col shrink-0 items-center justify-end pb-1 xs:pb-4 w-32 h-32 xs:h-40 xs:w-40 m-4 md:m-6"
      sx={{
        color: 'white',
        backgroundColor: '#606060'
      }}>
      <Tile type={props.type} />
    </Card>
  )
}
