import ListAltIcon from '@mui/icons-material/ListAlt'
import AddIcon from '@mui/icons-material/Add'

export default function AddTile() {
  return (
    <>
      <div className="h-20">
        <ListAltIcon style={{ fontSize: 80 }}></ListAltIcon>
        <AddIcon style={{ verticalAlign: 'top', fontSize: 30, marginLeft: -10 }}></AddIcon>
      </div>
      <div>Add recipes</div>
    </>
  )
}
