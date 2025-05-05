import ListAltIcon from '@mui/icons-material/ListAlt'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import FolderIcon from '@mui/icons-material/Folder'

export default function OrganizeTile() {
	return (
		<>
			<div className="flex h-20">
				<ListAltIcon style={{ fontSize: 80 }}></ListAltIcon>
				<div className="flex flex-col -ml-1 py-1">
					<ArrowRightAltIcon></ArrowRightAltIcon>
					<ArrowRightAltIcon></ArrowRightAltIcon>
					<ArrowRightAltIcon></ArrowRightAltIcon>
				</div>
				<div className="flex flex-col py-1">
					<FolderIcon className="oi-folder"></FolderIcon>
					<FolderIcon className="oi-folder"></FolderIcon>
					<FolderIcon className="oi-folder"></FolderIcon>
				</div>
			</div>
			<div>Organize</div>
		</>
	)
}
