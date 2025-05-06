import ListAltIcon from '@mui/icons-material/ListAlt'
import CreateIcon from '@mui/icons-material/Create'
import { CSSProperties } from 'react'

const createIconStyles: CSSProperties = {
  fontSize: 40,
  position: 'absolute',
  right: 5,
  top: 4,
  stroke: '#606060'
}

export default function NotesTile() {
  return (
    <>
      <div className="w-3/5 relative h-20">
        <ListAltIcon style={{ fontSize: 80, position: 'absolute', left: 0 }}></ListAltIcon>
        <CreateIcon style={createIconStyles}></CreateIcon>
      </div>
      <div>Take notes</div>
    </>
  )
}
